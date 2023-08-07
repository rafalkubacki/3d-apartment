import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Sky } from "three/addons/objects/Sky.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { createLights } from "./components/lights";
import { createGround } from "./components/ground";
import { createSky } from "./components/sky";
import { createBuildings } from "./components/buildings";
import { createGrid } from "./components/grid";
import { createCube } from "./components/cube";
import { createUi } from "./components/ui";
import { createWater } from "./components/water";

// SETTINGS
export const mDimensions = window.apartment360;

export const settings = {
  floorsVisible: false,
  onlyFloors: false,
  cube: false,
  model: true,
  cameraControls: true,
  floorOpacity: 0.75,
  cameraAngle: mDimensions.radius * 0.25,
  cameraHeight: mDimensions.height * 0.25,
  cameraDistance: mDimensions.radius * 0.75,
};

let selectedFloor = null;

export const colors = {
  background: new THREE.Color(0x636e72), // Doesnt change anything
  hemi: new THREE.Color(0xbde0fe), // Top sky color
  hemiNight: new THREE.Color(0x485460),
  hemiGround: new THREE.Color(0x636e72), // Bottom shadow color
  hemiGroundNight: new THREE.Color(0x1e272e),
  topLight: new THREE.Color(0xdddddd), // Additional top light
  dirLight: new THREE.Color(0xdddddd), // Buildings color correction
  dirLightNight: new THREE.Color(0xd2dae2),
  buildings: new THREE.Color(0x636e72), // Flat building walls
  fog: new THREE.Color(0xdfe6e9), // Lower sky
  floor: new THREE.Color(0x10ac84),
  windows: new THREE.Color(0x1b263b),
  water: new THREE.Color(0xa2d2ff),
};

const floors = window.floors;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  mDimensions.radius * 3
);

scene.background = colors.background;
scene.fog = new THREE.Fog(colors.fog, 1, mDimensions.radius * 4);

// export let cubeCamera, cubeRenderTarget;

// cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
// cubeRenderTarget.texture.type = THREE.HalfFloatType;

// cubeCamera = new THREE.CubeCamera(1, mDimensions.radius * 2, cubeRenderTarget);
// cubeCamera.position.copy(camera.position);

const windowMaterial = new THREE.MeshStandardMaterial({
  color: colors.windows,
  // envMap: cubeRenderTarget.texture,
  roughness: 0.5,
  metalness: 1,
  transparent: true,
  opacity: 0.6,
});

export const {
  hemiLight,
  hemiLightHelper,
  topLight,
  topLightHelper,
  dirLight,
  dirLightHelper,
} = createLights();
const { ground } = createGround();

const { buildings } = createBuildings();
const { waters } = createWater();

export const { sky } = createSky();

createUi();

scene.add(hemiLight, topLight, dirLight, ground, buildings, waters, sky);

if (mDimensions.helpers === true) {
  scene.add(hemiLightHelper, topLightHelper, dirLightHelper);
}

// RENDERER
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

// CAMERA
camera.position.set(
  settings.cameraAngle,
  settings.cameraHeight,
  settings.cameraDistance
);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = mDimensions.radius * 1.25;
controls.minDistance = mDimensions.radius * 0.5;
controls.maxPolarAngle = Math.PI / 2;

const textureLoader = new THREE.TextureLoader();
const pointTexture = textureLoader.load("disc.png");
pointTexture.colorSpace = THREE.SRGBColorSpace;
const pointsMaterial = new THREE.PointsMaterial({
  color: 0xff0000,
  map: pointTexture,
  size: 10,
  alphaTest: 0.5,
});

function displayFloors() {
  const clickers = [];

  const defaultMaterial = new THREE.MeshStandardMaterial({
    color: colors.floor,
    opacity: settings.floorsVisible ? settings.floorOpacity : 0,
    transparent: true,
  });

  let y = mDimensions.floorStart;

  // FLOORS
  floors.forEach((floor, key) => {
    if (floor.points) {
      let floorVertices = [];
      let floorPoints = [];

      if (key > 0) {
        y = y + floors[key - 1].height;
      }

      for (let i = 0; i < floor.points.length; i++) {
        const vertex = new THREE.Vector3(
          floor.points[i][0],
          y,
          floor.points[i][2]
        );
        floorVertices.push(vertex);
        floorPoints.push([floor.points[i][0], floor.points[i][2]]);
      }

      floorPoints.push([floor.points[0][0], floor.points[0][2]]);

      const shape = new THREE.Shape();

      floorPoints.forEach((element, i) => {
        if (i == 0) {
          shape.moveTo(element[0], element[1]);
        } else {
          shape.lineTo(element[0], element[1]);
        }
      });

      const extrudeSettings = {
        steps: 1,
        depth: floor.height,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
      };
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = defaultMaterial.clone();

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI * 0.5;
      mesh.position.y = y + floor.height;
      mesh.renderOrder = 10000;
      clickers[key] = mesh;

      scene.add(clickers[key]);
      clickers[key].name = "floor-" + key;
    }
  });
}
displayFloors();

// CLICK
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  if (mDimensions.helpers !== true) return false;

  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0) {
    const object = intersects[0];

    const p = object.point;

    console.log(`[${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}],`);
    console.log(object);

    const vertices = [];
    vertices.push(p.x, p.y, p.z);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    const points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);
  }
}
renderer.domElement.addEventListener("click", onClick, false);

function clearSelectedFloor() {
  if (selectedFloor) {
    document.body.style.cursor = null;
    document.getElementById("selected-floor").textContent = "-";
    document.getElementById("available-apartments").textContent = "-";

    const prevSelected = scene.getObjectByName(selectedFloor);

    if (prevSelected) {
      prevSelected.material.opacity = 0;
    }
  }
}

function onHover(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObject(scene, true);

  if (intersects.length == 0) {
    clearSelectedFloor();
    return false;
  }

  const object = intersects[0];

  if (!object?.object?.name?.includes("floor-")) {
    clearSelectedFloor();
    return false;
  }

  const name = object.object.name;

  if (selectedFloor && selectedFloor === name) {
    return false;
  }

  if (selectedFloor && selectedFloor != name) {
    clearSelectedFloor();
  }

  document.body.style.cursor = "pointer";
  object.object.material.opacity = settings.floorOpacity;

  const floorNumber = Number(name.split("-").pop());

  document.getElementById("selected-floor").textContent = floorNumber;
  document.getElementById("available-apartments").textContent =
    floors[floorNumber].apartments.available;

  selectedFloor = name;
}
renderer.domElement.addEventListener("mousemove", onHover, false);

let model;

function displayModel() {
  const loader = new GLTFLoader();
  loader.load(
    mDimensions.source,
    function (gltf) {
      model =
        gltf.scene.children.length > 0 ? gltf.scene.children[0] : gltf.scene;
      model.rotation.z = mDimensions.rotate;

      var box = new THREE.Box3().setFromObject(model);
      var center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);
      model.position.y = mDimensions.placement.y;
      model.position.x = model.position.x + mDimensions.placement.x;
      model.position.z = model.position.z + mDimensions.placement.z;

      model.traverse((n) => {
        if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;

          if (n.name.includes("vidra") || n.name.includes("vidro")) {
            n.material = windowMaterial;
          }

          if (n.name.includes("car")) {
            n.receiveShadow = false;
          }
        }
      });

      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}
displayModel();

function animate() {
  requestAnimationFrame(animate);

  camera.lookAt(0, mDimensions.height * 0.5, 0);

  // cubeCamera.update(renderer, scene);
  renderer.render(scene, camera);
}
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
