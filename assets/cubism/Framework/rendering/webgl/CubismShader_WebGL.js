(function () {
    const $ = window.Live2DCubismFramework;
  
    class CubismShader_WebGL {
      constructor(gl) {
        this.gl = gl;
        this.shaderProgram = null;
      }
  
      static getInstance(gl) {
        if (!this._instance) {
          this._instance = new CubismShader_WebGL(gl);
          this._instance.initShader();
        }
        return this._instance;
      }
  
      initShader() {
        const gl = this.gl;
  
        const vertexSrc = `
          attribute vec3 aPosition;
          attribute vec2 aTexCoord;
          varying vec2 vTexCoord;
          uniform mat4 uMatrix;
          void main(void) {
            gl_Position = uMatrix * vec4(aPosition, 1.0);
            vTexCoord = aTexCoord;
          }
        `;
  
        const fragmentSrc = `
          precision mediump float;
          varying vec2 vTexCoord;
          uniform sampler2D uTexture;
          uniform float uAlpha;
          void main(void) {
            vec4 color = texture2D(uTexture, vTexCoord);
            gl_FragColor = vec4(color.rgb, color.a * uAlpha);
          }
        `;
  
        const vertShader = this.compileShader(gl.VERTEX_SHADER, vertexSrc);
        const fragShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
  
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
  
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          console.error("Shader link failed:", gl.getProgramInfoLog(shaderProgram));
          return;
        }
  
        this.shaderProgram = shaderProgram;
        this.attribLocations = {
          position: gl.getAttribLocation(shaderProgram, "aPosition"),
          texCoord: gl.getAttribLocation(shaderProgram, "aTexCoord")
        };
        this.uniformLocations = {
          matrix: gl.getUniformLocation(shaderProgram, "uMatrix"),
          texture: gl.getUniformLocation(shaderProgram, "uTexture"),
          alpha: gl.getUniformLocation(shaderProgram, "uAlpha")
        };
      }
  
      compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
  
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error("Shader compile failed:", gl.getShaderInfoLog(shader));
          return null;
        }
  
        return shader;
      }
  
      useShader(matrix, texture, alpha) {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);
        gl.uniformMatrix4fv(this.uniformLocations.matrix, false, matrix);
        gl.uniform1i(this.uniformLocations.texture, 0);
        gl.uniform1f(this.uniformLocations.alpha, alpha);
      }
    }
  
    window.Live2DCubismFramework.CubismShader_WebGL = CubismShader_WebGL;
  })();
  