import * as THREE from "three";
import { mDimensions, colors, dirLight, topLight, hemiLight } from "../main";

export function createSky() {
  const vertexShader = document.getElementById("vertexShader").textContent;
  const fragmentShader = document.getElementById("fragmentShader").textContent;

  const skyGeo = new THREE.SphereGeometry(mDimensions.radius * 1.5, 32, 15);
  const skyDay = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: colors.hemi },
      bottomColor: { value: colors.fog },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
  });

  const skyNight = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: colors.hemiNight },
      bottomColor: { value: colors.fog },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeo, skyDay);

  document.body.addEventListener("click", (e) => {
    e.preventDefault();

    if (!e.target.id) return false;

    switch (e.target.id) {
      case "day-time":
        sky.material = skyDay;
        sky.material.needsUpdate = true;
        dirLight.intensity = 3;
        dirLight.position.set(
          mDimensions.radius * 0.25,
          mDimensions.height * 0.75,
          mDimensions.radius
        );
        break;

      case "night-time":
        sky.material = skyNight;
        sky.material.needsUpdate = true;
        dirLight.intensity = 2;
        dirLight.position.set(
          -mDimensions.radius * 0.25,
          mDimensions.height * 0.75,
          mDimensions.radius
        );
        break;
    }
  });

  return { sky };
}
