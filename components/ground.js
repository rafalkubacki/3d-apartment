import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createGround() {
  const groundGeo = new THREE.PlaneGeometry(
    mDimensions.radius * 4,
    mDimensions.radius * 4
  );
  const groundMat = new THREE.MeshLambertMaterial({ color: colors.buildings });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  return { ground };
}
