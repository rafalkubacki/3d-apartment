import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createBuildings() {
  const buildings = new THREE.Group();

  const groundMaterial = new THREE.MeshLambertMaterial({
    color: colors.buildings,
  });

  const geometries = [
    [
      mDimensions.radius * 0.5,
      mDimensions.height * 0.5,
      mDimensions.radius * 0.25,
      mDimensions.radius * 0.75,
      mDimensions.height * 0.25,
      mDimensions.radius * -0.25,
    ],
    [
      mDimensions.radius * 0.5,
      mDimensions.height * 0.5,
      mDimensions.radius * 0.25,
      mDimensions.radius * 0.75,
      mDimensions.height * 0.25,
      mDimensions.radius * 0.25,
    ],
    [
      mDimensions.radius * 0.5,
      mDimensions.height * 0.5,
      mDimensions.radius * 0.25,
      mDimensions.radius * 0.75,
      mDimensions.height * 0.25,
      mDimensions.radius * 0.75,
    ],
    [
      mDimensions.radius * 0.75,
      mDimensions.height * 1,
      mDimensions.radius * 0.25,
      mDimensions.radius * -0.5,
      mDimensions.height * 0.375,
      mDimensions.radius * 0.5,
    ],
    [
      mDimensions.radius * 0.25,
      mDimensions.height * 0.25,
      mDimensions.radius * 0.25,
      mDimensions.radius * -0.75,
      mDimensions.height * 0.125,
      mDimensions.radius * -0.25,
    ],
  ];

  geometries.forEach((geometry) => {
    const groundGeometry = new THREE.BoxGeometry(
      geometry[0],
      geometry[1],
      geometry[2]
    );

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(geometry[3], geometry[4], geometry[5]);
    ground.castShadow = true;
    ground.receiveShadow = true;

    buildings.add(ground);
    buildings.rotation.y = Math.PI;
  });

  return { buildings };
}
