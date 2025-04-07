console.log("Renderer loaded! Placeholder for NyansziaUserModel + draw loop setup.");

import { Live2DCubismFramework } from "./assets/cubism/Framework/live2dcubismframework.js";

window.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("live2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    console.error("❌ WebGL not supported");
    return;
  }

  console.log("✅ Canvas initialized:", canvas.width, canvas.height);

  const option = new Live2DCubismFramework.Option();
  option.logFunction = console.log;
  option.loggingLevel = Live2DCubismFramework.LogLevel.LogLevel_Verbose;

  Live2DCubismFramework.CubismFramework.startUp(option);
  Live2DCubismFramework.CubismFramework.initialize();

  const model3Path = "./assets/nyanszia_model/Nyanszia.model3.json";
  const response = await fetch(model3Path);
  const model3Json = await response.json();

  console.log("📦 Loaded model3.json:", model3Json);

  // Initialize matrices and rendering logic
  const matrix = new Live2DCubismFramework.CubismMatrix44();
  matrix.loadIdentity();
  matrix.scale(2.0, 2.0);
  console.log("🧮 Matrix set", matrix);

  // TEMPORARY placeholder rendering loop
  function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(draw);
  }

  draw();
});
