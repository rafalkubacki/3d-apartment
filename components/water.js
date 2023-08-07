import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createWater() {
  const waters = new THREE.Group();

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: colors.windows,
    roughness: 0.9,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5,
  });

  const geometries = [[240, 28, 100, -518, 1378, -230]];

  geometries.forEach((geometry) => {
    const groundGeometry = new THREE.BoxGeometry(
      geometry[0],
      geometry[1],
      geometry[2]
    );

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(
      geometry[3] + geometry[0] / 2,
      geometry[4] + geometry[1] / 2,
      geometry[5] - geometry[2] / 2
    );
    // ground.receiveShadow = true;
    waters.add(ground);
  });

  return { waters };
}
