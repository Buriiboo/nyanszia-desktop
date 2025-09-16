// IIFE build that exposes FULL Cubism namespace on window.Live2DCubismFramework

import * as NS from '@framework/live2dcubismframework';

// Ensure the important modules are included (prevents tree-shaking)
import { CubismMoc } from '@framework/model/cubismmoc';
import { CubismModel } from '@framework/model/cubismmodel';
import { CubismRenderer_WebGL } from '@framework/rendering/cubismrenderer_webgl';
import { CubismMotion } from '@framework/motion/cubismmotion';
import { CubismDefaultParameterId } from '@framework/cubismdefaultparameterid';

// Optional extras you can uncomment later
// import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
// import { CubismPhysics } from '@framework/physics/cubismphysics';
// import { CubismBreath } from '@framework/effect/cubismbreath';

// Attach classes to the namespace so your renderer can find them
(NS as any).CubismMoc = CubismMoc;
(NS as any).CubismModel = CubismModel;
(NS as any).CubismRenderer_WebGL = CubismRenderer_WebGL;
(NS as any).CubismMotion = CubismMotion;
(NS as any).CubismDefaultParameterId = CubismDefaultParameterId;

// Define the global explicitly (IIFE format will wrap this safely)
(globalThis as any).Live2DCubismFramework = NS;
