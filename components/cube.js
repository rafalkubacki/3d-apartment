import * as THREE from "three";
import { mDimensions } from "../main";

export function createCube() {
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x0077ff,
  });

  groundMaterial.transparent = true;
  groundMaterial.opacity = 0.25;

  const groundGeometry = new THREE.BoxGeometry(
    mDimensions.radius,
    mDimensions.height,
    mDimensions.radius
  );

  const cube = new THREE.Mesh(groundGeometry, groundMaterial);
  cube.position.y = mDimensions.height * 0.5;

  return { cube };
}
