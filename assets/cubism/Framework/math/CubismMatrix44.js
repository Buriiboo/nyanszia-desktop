(function () {
    class CubismMatrix44 {
      constructor() {
        this._matrix = new Float32Array(16);
        this.loadIdentity();
      }
  
      loadIdentity() {
        const m = this._matrix;
        m[0] = 1;  m[4] = 0;  m[8] = 0;  m[12] = 0;
        m[1] = 0;  m[5] = 1;  m[9] = 0;  m[13] = 0;
        m[2] = 0;  m[6] = 0;  m[10] = 1; m[14] = 0;
        m[3] = 0;  m[7] = 0;  m[11] = 0; m[15] = 1;
      }
  
      scale(x, y) {
        this._matrix[0] *= x;
        this._matrix[5] *= y;
      }
  
      getArray() {
        return this._matrix;
      }
    }
  
    // ⛩️ Expose globally
    window.Live2DCubismFramework = window.Live2DCubismFramework || {};
    window.Live2DCubismFramework.CubismMatrix44 = CubismMatrix44;
  })();
  