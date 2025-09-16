import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Live2DCubismFramework',     // <— global on window
      formats: ['iife'],                 // <— switch to IIFE
      fileName: () => 'live2dcubismframework.js',
    },
    sourcemap: false,
    minify: false,
    rollupOptions: {
      treeshake: false,                  // keep side-effect imports
      output: {
        extend: true,                    // don’t clobber existing globals
      },
    },
  },
  resolve: {
    alias: {
      '@framework': path.resolve(__dirname, '../../assets/cubism/FrameworkSrc'),
    },
  },
});
