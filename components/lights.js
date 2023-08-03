import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createLights() {
  const hemiLight = new THREE.HemisphereLight(
    colors.hemi,
    colors.hemiGround,
    2
  );
  hemiLight.position.set(0, 50, 0);

  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);

  const dirLight = new THREE.DirectionalLight(colors.dirLight, 3);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);

  return { hemiLight, hemiLightHelper, dirLight, dirLightHelper };
}
