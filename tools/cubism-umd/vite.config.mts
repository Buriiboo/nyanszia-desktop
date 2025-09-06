import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Live2DCubismFramework',             // global name on window
      formats: ['umd'],
      fileName: () => 'live2dcubismframework.js' // output filename
    },
    sourcemap: false,
    minify: false
  },
  resolve: {
    alias: {
      '@framework': path.resolve(__dirname, '../../assets/cubism/FrameworkSrc')
    }
  }
});
