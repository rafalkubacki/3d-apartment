import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Sky } from "three/addons/objects/Sky.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

// SETTINGS
const settings = {
  floors: true,
  floorsVisible: false,
  onlyFloors: true,
  ground: true,
  cube: false,
  sky: true,
  helpers: false,
  ambient: true,
  spotlight: true,
  directional: true,
  model: true,
  cameraControls: true,
  floorOpacity: 0.25,
};

let selectedFloor = null;

const mDimensions = {
  source: "park/scene.gltf",
  height: 85,
  radius: 145,
  rotate: 0,
};

// const mDimensions = {
//   source: "chicago/scene.gltf",
//   height: 85,
//   radius: 145,
//   rotate: 0,
// };

const floors = [
  {
    height: 9,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [63.6904, -0.1, -20.7328],
      [42.4745, -0.1, -32.2055],
      [-7.9824, -0.1, -32.5188],
      [-6.4947, -0.1, -51.9196],
      [-42.3278, -0.1, -75.4608],
      [-63.3213, -0.1, -36.0974],
      [-36.3894, 37.2, -16.9758],
    ],
    apartments: {
      available: 1,
    },
  },
  {
    height: 9.4,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [63.6904, -0.1, -20.7328],
      [42.4745, -0.1, -32.2055],
      [-7.9824, -0.1, -32.5188],
      [-6.4947, -0.1, -51.9196],
      [-42.3278, -0.1, -75.4608],
      [-63.3213, -0.1, -36.0974],
      [-36.3894, 37.2, -16.9758],
    ],
    apartments: {
      available: 3,
    },
  },
  {
    height: 9.4,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [63.6904, -0.1, -20.7328],
      [42.4745, -0.1, -32.2055],
      [-7.9824, -0.1, -32.5188],
      [-6.4947, -0.1, -51.9196],
      [-42.3278, -0.1, -75.4608],
      [-63.3213, -0.1, -36.0974],
      [-36.3894, 37.2, -16.9758],
    ],
    apartments: {
      available: 7,
    },
  },
  {
    height: 9.4,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [63.6904, -0.1, -20.7328],
      [42.4745, -0.1, -32.2055],
      [-7.9824, -0.1, -32.5188],
      [-6.4947, -0.1, -51.9196],
      [-42.3278, -0.1, -75.4608],
      [-63.3213, -0.1, -36.0974],
      [-36.3894, 37.2, -16.9758],
    ],
    apartments: {
      available: 5,
    },
  },
  {
    height: 9.4,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [57.7653, 37.5601, -7.1552],
      [50.0442, 39.2907, -7.643],
      [50.0581, 39.0195, -24.0472],
      [-23.5656, 38.9623, -24.0472],
      [-23.4026, 39.1022, -10.4022],
      [-32.5027, 37.3798, -10],
    ],
    apartments: {
      available: 4,
    },
  },
  {
    height: 9.4,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [57.7653, 37.5601, -7.1552],
      [-32.5027, 37.3798, -10],
    ],
    apartments: {
      available: 2,
    },
  },
  {
    height: 9.4,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [39.5675, 57.9068, 31.5393],
      [27.0879, 76.3427, -0.8234],
      [-1.5654, 76.3615, -0.8341],
      [-14.9503, 57.9068, 30.249],
    ],
    apartments: {
      available: 1,
    },
  },
  {
    height: 10,
    points: [
      [-1.3816, -0.1, 64.3154],
      [5.9172, -0.1, 72],
      [18.6825, -0.1, 72],
      [26.5145, -0.1, 64.458],
      [39.5675, 57.9068, 31.5393],
      [27.0879, 76.3427, -0.8234],
      [-1.5654, 76.3615, -0.8341],
      [-14.9503, 57.9068, 30.249],
    ],
    apartments: {
      available: 0,
    },
  },
];

function init() {
  // SCENE
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.FogExp2(0x888888, mDimensions.radius * 0.000025);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xffffff));
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  renderer.shadowMap.enabled = true;
  renderer.useLegacyLights = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.75;
  document.body.appendChild(renderer.domElement);

  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    mDimensions.radius * 3
  );
  camera.position.set(0, mDimensions.height * 0.75, mDimensions.radius);

  if (settings.helpers) {
    const cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);
  }

  // CONTROLS
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = mDimensions.radius;
  controls.minDistance = mDimensions.radius / 2;
  controls.maxPolarAngle = Math.PI / 2;

  if (settings.helpers) {
    scene.add(new THREE.AxesHelper(mDimensions.radius));
  }

  // CAMERA CONTROLS
  const btnString = `
  <div class="navigation">
    <div class="navigation__block">
      <span class="navigation__label">Camera:</span>
      <button id="front-camera">Front</button>
      <button id="right-camera">Right</button>
      <button id="back-camera">Back</button>
      <button id="left-camera">Left</button>
      <span class="navigation__label">Time:</span>
      <button id="day-time">Day</button>
      <button id="night-time">Night</button>
    </div>
    <div class="navigation__block">
      <span class="navigation__label">Selected floor:</span>
      <span class="navigation__number" id="selected-floor">-</span>
      <span class="navigation__label">Available apartments:</span>
      <span class="navigation__number" id="available-apartments">-</span>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML("beforeend", btnString);

  document.body.addEventListener("click", (e) => {
    e.preventDefault();
    if (!e.target.id) return false;

    switch (e.target.id) {
      case "front-camera":
        camera.position.set(0, mDimensions.height * 0.75, mDimensions.radius);
        break;

      case "right-camera":
        camera.position.set(mDimensions.radius, mDimensions.height * 0.75, 0);
        break;

      case "back-camera":
        camera.position.set(0, mDimensions.height * 0.75, -mDimensions.radius);
        break;

      case "left-camera":
        camera.position.set(-mDimensions.radius, mDimensions.height * 0.75, 0);
        break;

      case "day-time":
        camera.position.set(-mDimensions.radius, mDimensions.height * 0.75, 0);
        break;

      case "night-time":
        camera.position.set(-mDimensions.radius, mDimensions.height * 0.75, 0);
        break;
    }
  });

  return [scene, renderer, camera];
}
const [scene, renderer, camera] = init();

const textureLoader = new THREE.TextureLoader();
const pointTexture = textureLoader.load("disc.png");
pointTexture.colorSpace = THREE.SRGBColorSpace;
const pointsMaterial = new THREE.PointsMaterial({
  color: 0x0080ff,
  map: pointTexture,
  size: 2,
  alphaTest: 0.5,
});

// let group;
// points();

function points() {
  group = new THREE.Group();
  scene.add(group);

  // points

  let dodecahedronGeometry = new THREE.DodecahedronGeometry(100);

  // if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data

  dodecahedronGeometry.deleteAttribute("normal");
  dodecahedronGeometry.deleteAttribute("uv");

  dodecahedronGeometry =
    BufferGeometryUtils.mergeVertices(dodecahedronGeometry);

  const vertices = [];
  const positionAttribute = dodecahedronGeometry.getAttribute("position");

  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    console.log(positionAttribute);
    vertices.push(vertex);
  }

  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);

  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(points);

  // convex hull

  const meshMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.5,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const meshGeometry = new ConvexGeometry(vertices);

  const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  group.add(mesh);

  //
}

// GROUND
function displayGround() {
  const groundMaterial = new THREE.MeshLambertMaterial({
    color: 0xd1d8e0,
  });
  const groundGeometry = new THREE.BoxGeometry(
    mDimensions.radius * 2,
    2,
    mDimensions.radius * 2
  );

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -1.1;
  ground.receiveShadow = true;
  scene.add(ground);
}
if (settings.ground) displayGround();

// CUBE
function displayCube() {
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x161616,
  });

  groundMaterial.transparent = true;
  groundMaterial.opacity = 0.5;

  const groundGeometry = new THREE.BoxGeometry(
    mDimensions.radius,
    mDimensions.height,
    mDimensions.radius
  );

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = mDimensions.height * 0.5;
  ground.receiveShadow = true;
  scene.add(ground);
}
if (settings.cube) displayCube();

function displayFloors() {
  const clickers = [];

  const defaultMaterial = new THREE.MeshBasicMaterial({
    color: 0x3498db,
    opacity: settings.floorsVisible ? settings.floorOpacity : 0,
    transparent: true,
  });

  let y = 0;

  // FLOORS
  floors.forEach((floor, key) => {
    if (floor.points) {
      let floorVertices = [];
      let floorPoints = [];

      if (key > 0) {
        console.log(y);
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

      // const geometry = new ConvexGeometry(vertices);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI * 0.5;
      mesh.position.y = y + floor.height;
      console.log(mesh);
      clickers[key] = mesh;

      scene.add(clickers[key]);
      clickers[key].name = "floor-" + key;
    }
  });
}
if (settings.floors) displayFloors();

// CLICK
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0) {
    const object = intersects[0];

    if (settings.onlyFloors) {
      if (!object) return false;
      if (!object.object) return false;
      if (!object.object.name.includes("floor-")) return false;

      const name = object.object.name;

      if (selectedFloor) {
        var obj = scene.getObjectByName(selectedFloor);
        obj.material.opacity = 0;
      }

      object.object.material.opacity =
        object.object.material.opacity == 0 ? settings.floorOpacity : 0;

      const floorNumber = Number(name.split("-").pop());
      selectedFloor = name;
      document.getElementById("selected-floor").textContent = floorNumber;
      document.getElementById("available-apartments").textContent =
        floors[floorNumber].apartments.available;
    } else {
      const p = object.point;
      console.log(`[${p.x.toFixed(4)}, ${p.y.toFixed(4)}, ${p.z.toFixed(4)}],`);
      const vertices = [];
      vertices.push(p.x, p.y, p.z);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      const material = new THREE.PointsMaterial({ color: 0xff0000 });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
    }
  }
}
renderer.domElement.addEventListener("click", onClick, false);

// SKY
function displaySky() {
  const sky = new Sky();
  sky.scale.setScalar(mDimensions.radius * 2);
  scene.add(sky);

  const sun = new THREE.Vector3();

  const effectController = {
    turbidity: 20,
    rayleigh: 0.7,
    mieCoefficient: 0,
    mieDirectionalG: 0.7,
    elevation: 40,
    azimuth: 0,
    exposure: renderer.toneMappingExposure,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);
  }

  if (settings.helpers) {
    const gui = new GUI();

    gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
    gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
    gui
      .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
      .onChange(guiChanged);
    gui
      .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
      .onChange(guiChanged);
    gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
    gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
    gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);
  }

  guiChanged();
}
if (settings.sky) displaySky();

function displayGrid() {
  const grid = new THREE.GridHelper(mDimensions.radius * 2, 10);
  grid.material.opacity = 0.2;
  grid.material.depthWrite = false;
  grid.material.transparent = true;
  scene.add(grid);
}
if (settings.grid) displayGrid();

function displayAmbient() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
}
if (settings.ambient) displayAmbient();

function displaySpotlight() {
  const spotLight = new THREE.SpotLight(0xffeec6, 0.5);
  spotLight.position.set(0, mDimensions.height * 1.5, mDimensions.radius);
  spotLight.angle = 1;
  spotLight.penumbra = 0.01;
  spotLight.decay = 0.1;
  spotLight.distance = mDimensions.radius * 2;
  spotLight.castShadow = true;
  scene.add(spotLight);

  spotLight.target.position.set(0, 0, 0);
  scene.add(spotLight.target);

  if (settings.helpers) {
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);
  }
}
if (settings.spotlight) displaySpotlight();

function displayDirectionalLight() {
  const light = new THREE.DirectionalLight(0xc9d3e0, 1);
  light.position.x = 0;
  light.position.y = mDimensions.height * 0.75;
  light.position.z = mDimensions.radius;
  scene.add(light);

  if (settings.helpers) {
    const helper = new THREE.DirectionalLightHelper(light, 5);
    scene.add(helper);
  }
}
if (settings.directional) displayDirectionalLight();

function displayModel() {
  const loader = new GLTFLoader();
  loader.load(
    mDimensions.source,
    function (gltf) {
      const model = gltf.scene.children[0]; // for sketchfab
      model.rotation.z = Math.PI;
      var box = new THREE.Box3().setFromObject(model);
      var center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);
      model.position.y = 0;
      model.castShadow = true;
      model.receiveShadow = true;
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}
if (settings.model) displayModel();

function animate() {
  requestAnimationFrame(animate);

  camera.lookAt(0, mDimensions.height * 0.5, 0);

  renderer.render(scene, camera);
}
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
