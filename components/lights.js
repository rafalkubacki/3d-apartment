import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createLights() {
  const hemiLight = new THREE.HemisphereLight(
    colors.dirLight,
    colors.dirLight,
    3
  );
  hemiLight.position.set(0, mDimensions.height * 1.5, 0);

  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);

  const dirLight = new THREE.DirectionalLight(colors.dirLight, 6);
  dirLight.position.set(
    mDimensions.radius * 0.5,
    mDimensions.height * 1.5,
    mDimensions.radius * 0.5
  );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = mDimensions.radius * 2;
  dirLight.shadow.mapSize.height = mDimensions.radius * 2;

  const d = mDimensions.radius * 2;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = mDimensions.radius * 2;
  dirLight.shadow.bias = -0.0001;

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);

  return { hemiLight, hemiLightHelper, dirLight, dirLightHelper };
}
