import * as THREE from "three";
import { mDimensions, colors, camera, settings, sky } from "../main";

export function createUi() {
  const btnString = `
    <div class="navigation">
      <div class="navigation__block">
        <span class="navigation__label">Camera:</span>
        <button id="front-camera">Front</button>
        <button id="right-camera">Right</button>
        <button id="back-camera">Back</button>
        <button id="left-camera">Left</button>
        <span class="navigation__label">Time:</span>
        <button id="day-time">Day</button>
        <button id="night-time">Night</button>
      </div>
      <div class="navigation__block">
        <span class="navigation__label">Selected floor:</span>
        <span class="navigation__number" id="selected-floor">-</span>
        <span class="navigation__label">Available apartments:</span>
        <span class="navigation__number" id="available-apartments">-</span>
      </div>
    </div>
    `;
  document.body.insertAdjacentHTML("beforeend", btnString);
}

// CAMERA CONTROLS
document.body.addEventListener("click", (e) => {
  e.preventDefault();

  if (!e.target.id) return false;

  switch (e.target.id) {
    case "front-camera":
      camera.position.set(
        settings.cameraAngle,
        settings.cameraHeight,
        settings.cameraDistance
      );
      break;

    case "right-camera":
      camera.position.set(
        settings.cameraDistance,
        settings.cameraHeight,
        -settings.cameraAngle
      );
      break;

    case "back-camera":
      camera.position.set(
        -settings.cameraAngle,
        settings.cameraHeight,
        -settings.cameraDistance
      );
      break;

    case "left-camera":
      camera.position.set(
        -settings.cameraDistance,
        settings.cameraHeight,
        settings.cameraAngle
      );
      break;
  }
});
