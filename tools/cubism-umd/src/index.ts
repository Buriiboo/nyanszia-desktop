// Build a UMD that exposes FULL Cubism namespace as the *default export*.
// Vite will map that to the global name you set in vite.config.mts
// (Live2DCubismFramework), so no manual window assignment needed.

import * as NS from '@framework/live2dcubismframework';

// Pull in class modules so they aren't tree-shaken:
import { CubismMoc } from '@framework/model/cubismmoc';
import { CubismModel } from '@framework/model/cubismmodel';
import { CubismRenderer_WebGL } from '@framework/rendering/cubismrenderer_webgl';
import { CubismMotion } from '@framework/motion/cubismmotion';
import { CubismDefaultParameterId } from '@framework/cubismdefaultparameterid';

// Optionals you might need later:
// import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
// import { CubismPhysics } from '@framework/physics/cubismphysics';
// import { CubismBreath } from '@framework/effect/cubismbreath';

// Attach classes to the namespace:
(NS as any).CubismMoc = CubismMoc;
(NS as any).CubismModel = CubismModel;
(NS as any).CubismRenderer_WebGL = CubismRenderer_WebGL;
(NS as any).CubismMotion = CubismMotion;
(NS as any).CubismDefaultParameterId = CubismDefaultParameterId;

// 👑 The important part: export *default* for UMD
export default NS;
