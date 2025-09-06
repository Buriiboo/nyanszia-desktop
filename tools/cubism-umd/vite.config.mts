import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Live2DCubismFramework',
      formats: ['umd'],
      fileName: () => 'live2dcubismframework.js',
    },
    sourcemap: false,
    minify: false,
    rollupOptions: { treeshake: false }, 
  },
  resolve: {
    alias: {
      '@framework': path.resolve(__dirname, '../../assets/cubism/FrameworkSrc'),
    },
  },
});
