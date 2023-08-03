import * as THREE from "three";
import { mDimensions } from "../main";

export function createGrid() {
  const grid = new THREE.GridHelper(mDimensions.radius * 2, 10);
  grid.material.opacity = 0.2;
  grid.material.depthWrite = false;
  grid.material.transparent = true;

  return { grid };
}
