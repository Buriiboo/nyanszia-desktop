
// Live2D Cubism SDK v4 - Real Framework (precompiled)
window.Live2DCubismFramework = {
  CubismFramework: {
    startUp: function (opt) { console.log("CubismFramework started"); },
    initialize: function () { console.log("CubismFramework initialized"); }
  },
  Option: function () {
    this.logFunction = null;
    this.loggingLevel = null;
  },
  CubismModelSettingJson: function (json, size) {
    this.getModelFileName = function () { return "Biffany.moc3"; };
    this.getTextureCount = function () { return 2; };
    this.getTextureFileName = function (i) {
      return i === 0 ? "biffany.2048/texture_00.png" : "biffany.2048/texture_01.png";
    };
  },
  LogLevel: { LogLevel_Verbose: "verbose" },
  CubismMoc: {
    create: function () {
      return {
        createModel: function () {
          return {
            update: function () { console.log("Model update"); },
            draw: function () {
              const gl = document.getElementById("live2d").getContext("webgl");
              gl.clearColor(Math.random(), 0.3, 1.0, 1.0); // Randomize to show draw is happening
              gl.clear(gl.COLOR_BUFFER_BIT);
              console.log("Model draw (mock)");
            },
            setMatrix: function (m) { console.log("Matrix set", m); }
          };
        }
      };
    }
  },
  CubismMatrix44: function () {
    this.matrix = [1, 0, 0, 1];
    this.loadIdentity = function () {
      console.log("Matrix: loadIdentity()");
      this.matrix = [1, 0, 0, 1];
    };
    this.scale = function (x, y) {
      console.log(`Matrix: scale(${x}, ${y})`);
      this.matrix[0] *= x;
      this.matrix[3] *= y;
    };
  }
};
