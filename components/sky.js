import * as THREE from "three";
import { mDimensions, colors } from "../main";

export function createSky() {
  const vertexShader = document.getElementById("vertexShader").textContent;
  const fragmentShader = document.getElementById("fragmentShader").textContent;
  const uniforms = {
    topColor: { value: colors.hemi },
    bottomColor: { value: colors.fog },
    offset: { value: 33 },
    exponent: { value: 0.6 },
  };

  const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);

  return { sky };
}
