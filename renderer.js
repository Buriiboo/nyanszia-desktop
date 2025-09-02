const Live2D = window.Live2DCubismFramework;
const { CubismFramework, Option, CubismMatrix44, CubismModel } = Live2D;
const CubismModelSettingJson = window.CubismModelSettingJson;
const CubismRenderer_WebGL = Live2D.CubismRenderer_WebGL;
const path = require("path");

// Canvas setup
const canvas = document.getElementById("live2d");
const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
canvas.style.position = "absolute";
canvas.style.bottom = "10px";
canvas.style.right = "10px";
canvas.style.background = "rgba(255, 0, 255, 0.1)";
canvas.style.zIndex = "9999";
canvas.style.border = "3px solid hotpink";

// Initialize Cubism
const option = new Option();
option.logFunction = console.log;
option.loggingLevel = Live2D.LogLevel.LogLevel_Verbose;

CubismFramework.startUp(option);
CubismFramework.initialize();

let model = null;
let renderer = null;

console.log("Trying to fetch Nyanszia.model3.json from:", window.location.href);
fetch(path.join(__dirname, "assets/nyanszia_model/Nyanszia.model3.json"))
  .then(res => res.arrayBuffer())
  .then(async arrayBuffer => {
    console.log("✅ model3.json loaded!");

    const jsonStr = new TextDecoder("utf-8").decode(arrayBuffer);
    const setting = new CubismModelSettingJson(jsonStr);

    console.log("🔍 Available in Live2D:", Object.keys(Live2D));
    console.log("📦 Model filename:", setting.getModelFileName());

    const mocUrl = `./assets/nyanszia_model/${setting.getModelFileName()}`;
    const mocData = await fetch(mocUrl).then(res => res.arrayBuffer());

    const moc = Live2D.CubismMoc.create(mocData);
    const cubismModel = Live2D.CubismModel.create(moc); // ✨ uses full model wrapper

    if (!cubismModel) {
      console.error("❌ Failed to create CubismModel.");
      return;
    }

    // Renderer setup
    renderer = CubismRenderer_WebGL.create(gl);
    renderer.initialize(cubismModel); 

    // Apply transform
    const matrix = new CubismMatrix44();
    matrix.loadIdentity();
    matrix.scale(2.0, 2.0);
    renderer.setMvpMatrix(matrix);

    // Load textures
    const textureCount = setting.getTextureCount();
    const textures = [];
    for (let i = 0; i < textureCount; i++) {
      const textureFileName = setting.getTextureFileName(i);
      const texture = await loadTexture(gl, `./assets/nyanszia_model/textures/${textureFileName}`);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      textures.push(texture);
      console.log("✅ Texture loaded:", textureFileName);
    }

    // Assign textures
    for (let i = 0; i < textures.length; i++) {
      renderer.bindTexture(i, textures[i]);
    }

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    model = cubismModel;
    requestAnimationFrame(draw);
  });

function draw() {
  if (!renderer) return;

  gl.clearColor(1.0, 0.8, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  renderer.drawModel(); // ✨ Draw her!

  requestAnimationFrame(draw);
}

function loadTexture(gl, url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      resolve(texture);
    };

    img.onerror = (err) => {
      console.error("❌ Failed to load texture:", url, err);
      reject(err);
    };
  });
}
