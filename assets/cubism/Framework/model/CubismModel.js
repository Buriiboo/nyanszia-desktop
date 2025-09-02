(function () {
    const $ = window.Live2DCubismFramework;
    const Core = window.Live2DCubismCore;
  
    class CubismModel {
      constructor(coreModel) {
        this._coreModel = coreModel;
  
        this.drawables = {
          getDrawableCount: () => Core.Drawables.getDrawableCount(coreModel),
          getRenderOrders: () => Core.Drawables.getRenderOrders(coreModel),
          getVisibilities: () => Core.Drawables.getVisibilities(coreModel),
          getOpacities: () => Core.Drawables.getOpacities(coreModel),
          getTextureIndices: () => Core.Drawables.getTextureIndices(coreModel),
          getVertexCount: (i) => Core.Drawables.getVertexCount(coreModel, i),
          getIndexCount: (i) => Core.Drawables.getIndexCount(coreModel, i),
          getVertexPositions: (i) => Core.Drawables.getVertexPositions(coreModel, i),
          getVertexUvs: (i) => Core.Drawables.getVertexUvs(coreModel, i),
          getIndices: (i) => Core.Drawables.getIndices(coreModel, i)
        };
      }
  
      static create(moc) {
        if (!moc || !moc._moc) {
          console.error("❌ CubismModel.create: Invalid moc object.");
          return null;
        }
  
        const coreModel = Core.Model.fromMoc(moc._moc);
        if (!coreModel) {
          console.error("❌ Failed to create core model from moc.");
          return null;
        }
  
        return new CubismModel(coreModel);
      }
  
      getCoreModel() {
        return this._coreModel;
      }
    }
  
    window.Live2DCubismFramework.CubismModel = CubismModel;
  })();
  