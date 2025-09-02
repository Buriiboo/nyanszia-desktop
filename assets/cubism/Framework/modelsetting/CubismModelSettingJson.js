(function() {
    const $ = window.Live2DCubismFramework;
    class CubismModelSettingJson {
      constructor(buffer) {
        const json = JSON.parse(buffer);
        this._json = json;
      }
  
      getModelFileName() {
        return this._json.FileReferences.Moc;
      }
  
      getTextureCount() {
        return this._json.FileReferences.Textures.length;
      }
  
      getTextureFileName(i) {
        return this._json.FileReferences.Textures[i];
      }
  
      getMotionGroupCount() {
        return Object.keys(this._json.FileReferences.Motions || {}).length;
      }
  
      getMotionGroupName(i) {
        return Object.keys(this._json.FileReferences.Motions || {})[i];
      }
  
      getMotionCount(group) {
        return this._json.FileReferences.Motions[group]?.length || 0;
      }
  
      getMotionFileName(group, i) {
        return this._json.FileReferences.Motions[group][i].File;
      }
  
      getMotionSoundFileName(group, i) {
        return this._json.FileReferences.Motions[group][i].Sound || null;
      }
  
      getExpressionCount() {
        return this._json.FileReferences.Expressions?.length || 0;
      }
  
      getExpressionName(i) {
        return this._json.FileReferences.Expressions[i].Name;
      }
  
      getExpressionFileName(i) {
        return this._json.FileReferences.Expressions[i].File;
      }
  
      getPhysicsFileName() {
        return this._json.FileReferences.Physics;
      }
  
      getPoseFileName() {
        return this._json.FileReferences.Pose;
      }
  
      getUserDataFile() {
        return this._json.FileReferences.UserData;
      }
  
      getHitAreasCount() {
        return this._json.HitAreas?.length || 0;
      }
  
      getHitAreaName(i) {
        return this._json.HitAreas[i].Name;
      }
  
      getHitAreaId(i) {
        return this._json.HitAreas[i].Id;
      }
  
      getLayoutMap() {
        return this._json.Layout || {};
      }
    }
  
    // ⛩️ Export to window for renderer.js access
    window.CubismModelSettingJson = CubismModelSettingJson;
  })();
  