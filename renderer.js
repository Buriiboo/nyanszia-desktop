const Live2D = window.Live2DCubismFramework;
const { CubismFramework, Option, CubismModelSettingJson } = Live2D;
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

console.log("Trying to fetch Nyanszia.model3.json from:", window.location.href);
fetch(path.join(__dirname, "assets/nyanszia_model/Nyanszia.model3.json"))
  .then(res => {
    console.log("Model3.json fetch status: ", res.status, res.url);
    return res.json();
  })
  .then(async json => {

    console.log("🔍 Available in Live2D:", Object.keys(Live2D));

    const setting = new CubismModelSettingJson(json, json.size);
    const mocUrl = `./assets/nyanszia_model/${setting.getModelFileName()}`;

    const mocData = await fetch(mocUrl).then(res => res.arrayBuffer());
    const moc = Live2D.CubismMoc.create(mocData);
    model = moc.createModel();

    const matrix = new Live2D.CubismMatrix44();
    matrix.loadIdentity();
    matrix.scale(2.0, 2.0);
    model.setMatrix(matrix);

    const textureCount = setting.getTextureCount();
    for (let i = 0; i < textureCount; i++) {
      const textureFileName = setting.getTextureFileName(i);
      const texture = await loadTexture(gl, `./assets/nyanszia_model/${textureFileName}`);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    requestAnimationFrame(draw);
  });

function draw() {
  if (!model) return;

  gl.clearColor(1.0, 0.8, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  model.update();
  model.draw(gl);

  requestAnimationFrame(draw);
}

function loadTexture(gl, url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      console.log("✅ Texture loaded:", url);
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
