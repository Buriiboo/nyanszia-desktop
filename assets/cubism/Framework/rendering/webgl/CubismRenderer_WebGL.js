(function () {
    const $ = window.Live2DCubismFramework;
    const ShaderManager = $.CubismShader_WebGL;
  
    class CubismRenderer_WebGL {
      constructor(gl) {
        this.gl = gl;
        this.model = null;
        this.textures = [];
        this._mvpMatrix = null;
      }
  
      static create(gl) {
        return new CubismRenderer_WebGL(gl);
      }
  
      initialize(coreModel) {
        if (!coreModel || !coreModel.drawables) {
          console.error("❌ Cannot initialize renderer: coreModel is invalid.");
          return;
        }
  
        this.model = coreModel;
      }
  
      bindTexture(index, texture) {
        this.textures[index] = texture;
      }
  
      setMvpMatrix(matrix) {
        this._mvpMatrix = matrix.getArray();
      }
  
      drawModel() {
        const gl = this.gl;
        const model = this.model;
  
        if (!model || !this.textures.length || !this._mvpMatrix) {
          console.warn("⚠️ Renderer not fully initialized.");
          return;
        }
  
        const drawables = model.drawables;
        const count = drawables.getDrawableCount();
        const renderOrders = drawables.getRenderOrders();
        const visibilities = drawables.getVisibilities();
        const opacities = drawables.getOpacities();
        const textureIndices = drawables.getTextureIndices();
  
        const shader = ShaderManager.getInstance(gl);
  
        for (let i = 0; i < count; i++) {
          const drawableIndex = renderOrders[i];
          if (!visibilities[drawableIndex] || opacities[drawableIndex] <= 0.01) continue;
  
          const textureIndex = textureIndices[drawableIndex];
          const texture = this.textures[textureIndex];
          if (!texture) continue;
  
          const vertexCount = drawables.getVertexCount(drawableIndex);
          const indexCount = drawables.getIndexCount(drawableIndex);
          const pos = drawables.getVertexPositions(drawableIndex);
          const uv = drawables.getVertexUvs(drawableIndex);
          const idx = drawables.getIndices(drawableIndex);
  
          const positions = new Float32Array(vertexCount * 2);
          const texCoords = new Float32Array(vertexCount * 2);
          const indices = new Uint16Array(indexCount);
  
          for (let v = 0; v < vertexCount; v++) {
            positions[v * 2] = pos[v * 2];
            positions[v * 2 + 1] = pos[v * 2 + 1];
            texCoords[v * 2] = uv[v * 2];
            texCoords[v * 2 + 1] = uv[v * 2 + 1];
          }
  
          for (let j = 0; j < indexCount; j++) {
            indices[j] = idx[j];
          }
  
          const vao = gl.createVertexArray();
          gl.bindVertexArray(vao);
  
          const posVbo = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, posVbo);
          gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(shader.attribLocations.position);
          gl.vertexAttribPointer(shader.attribLocations.position, 2, gl.FLOAT, false, 0, 0);
  
          const uvVbo = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, uvVbo);
          gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(shader.attribLocations.texCoord);
          gl.vertexAttribPointer(shader.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);
  
          const ibo = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
  
          shader.useShader(this._mvpMatrix, texture, opacities[drawableIndex]);
  
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
  
          gl.deleteBuffer(posVbo);
          gl.deleteBuffer(uvVbo);
          gl.deleteBuffer(ibo);
          gl.bindVertexArray(null);
          gl.deleteVertexArray(vao);
        }
      }
    }
  
    window.Live2DCubismFramework.CubismRenderer_WebGL = CubismRenderer_WebGL;
  })();
  