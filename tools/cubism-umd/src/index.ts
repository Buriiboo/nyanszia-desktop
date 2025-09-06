// Build a UMD that exposes the full namespace as window.Live2DCubismFramework

import * as NS from '@framework/live2dcubismframework';

// Pull in side-effect modules so UMD includes the classes you need:
import '@framework/rendering/cubismrenderer_webgl';
import '@framework/motion/cubismmotion';
import '@framework/model/cubismmodel';
import '@framework/cubismdefaultparameterid';

// (Optional extras you might need later)
// import '@framework/physics/cubismphysics';
// import '@framework/effect/cubismbreath';
// import '@framework/math/cubismmatrix44';

export * as Live2DCubismFramework from '@framework/live2dcubismframework';
(window as any).Live2DCubismFramework = NS;  // define the global used by your renderer.js
