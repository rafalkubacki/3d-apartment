import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createLights() {
  const d = mDimensions.radius;

  const hemiLight = new THREE.HemisphereLight(
    colors.dirLight,
    colors.dirLight,
    3
  );
  hemiLight.position.set(0, mDimensions.height * 1.5, 3);

  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 0);

  const topLight = new THREE.DirectionalLight(colors.topLight, 1);
  topLight.position.set(0, mDimensions.height * 2, 0);
  topLight.castShadow = true;
  topLight.shadow.mapSize.width = mDimensions.radius * 2;
  topLight.shadow.mapSize.height = mDimensions.radius * 2;
  topLight.shadow.camera.left = -d;
  topLight.shadow.camera.right = d;
  topLight.shadow.camera.top = d;
  topLight.shadow.camera.bottom = -d;
  topLight.shadow.camera.far = mDimensions.radius * 2;
  topLight.shadow.bias = -0.0001;

  const topLightHelper = new THREE.DirectionalLightHelper(topLight, 1);

  const dirLight = new THREE.DirectionalLight(colors.dirLight, 3);
  dirLight.position.set(
    mDimensions.radius * 0.25,
    mDimensions.height * 0.75,
    mDimensions.radius
  );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = mDimensions.radius * 2;
  dirLight.shadow.mapSize.height = mDimensions.radius * 2;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = mDimensions.radius * 2;
  dirLight.shadow.bias = -0.0001;

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 3);

  return {
    hemiLight,
    hemiLightHelper,
    topLight,
    topLightHelper,
    dirLight,
    dirLightHelper,
  };
}
