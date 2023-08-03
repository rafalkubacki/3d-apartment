import * as THREE from "three";
import { mDimensions } from "../main";

export function createGround() {
  const groundGeo = new THREE.PlaneGeometry(10000, 10000);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  groundMat.color.setHSL(0.095, 1, 0.75);

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -25;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  return { ground };
}
