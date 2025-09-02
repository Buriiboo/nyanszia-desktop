(function () {
    const $ = window.Live2DCubismFramework;
  
    class CubismMoc {
      constructor(moc) {
        this._moc = moc;
      }
  
      static create(buffer) {
        if (!window.Live2DCubismCore) {
          console.error("❌ Live2DCubismCore not loaded.");
          return null;
        }
  
        const moc = window.Live2DCubismCore.Moc.fromArrayBuffer(buffer);
        if (!moc) {
          console.error("❌ Failed to create moc from buffer.");
          return null;
        }
  
        return new CubismMoc(moc);
      }
  
      createModel() {
        if (!this._moc) return null;
  
        const model = window.Live2DCubismCore.Model.fromMoc(this._moc);
        return {
          _coreModel: model,
  
          update: function () {
            // optional param updates can go here
          },
  
          draw: function (gl) {
            const drawCount = model.getDrawableCount();
            const indexArray = model.getDrawableRenderOrders();
  
            for (let i = 0; i < drawCount; i++) {
              const drawableIndex = indexArray[i];
              const textureIndex = model.getDrawableTextureIndices()[drawableIndex];
  
              // TODO: use your own logic to bind the texture
              gl.drawArrays(gl.TRIANGLES, 0, 3); // Placeholder; we’ll refine this later
            }
          },
  
          setMatrix: function (matrix) {
            // optional matrix application
          }
        };
      }
    }
  
    window.Live2DCubismFramework.CubismMoc = CubismMoc;
  })();
  