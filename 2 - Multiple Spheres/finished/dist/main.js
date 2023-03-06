(()=>{"use strict";class e{constructor(e,r,t){this.center=new Float32Array(e),this.radius=r,this.color=new Float32Array(t)}}var r,t="undefined"!=typeof Float32Array?Float32Array:Array;function n(e,r,t){var n=r[0],i=r[1],s=r[2],a=t[0],o=t[1],c=t[2];return e[0]=i*c-s*o,e[1]=s*a-n*c,e[2]=n*o-i*a,e}Math.random,Math.PI,Math.hypot||(Math.hypot=function(){for(var e=0,r=arguments.length;r--;)e+=arguments[r]*arguments[r];return Math.sqrt(e)}),r=new t(3),t!=Float32Array&&(r[0]=0,r[1]=0,r[2]=0);class i{constructor(e){this.position=new Float32Array(e),this.theta=0,this.phi=0,this.recalculate_vectors()}recalculate_vectors(){this.forwards=new Float32Array([Math.cos(180*this.theta/Math.PI)*Math.cos(180*this.phi/Math.PI),Math.sin(180*this.theta/Math.PI)*Math.cos(180*this.phi/Math.PI),Math.sin(180*this.phi/Math.PI)]),this.right=new Float32Array([0,0,0]),n(this.right,this.forwards,[0,0,1]),this.up=new Float32Array([0,0,0]),n(this.up,this.right,this.forwards)}}const s="@group(0) @binding(0) var screen_sampler : sampler;\r\n@group(0) @binding(1) var color_buffer : texture_2d<f32>;\r\n\r\nstruct VertexOutput {\r\n    @builtin(position) Position : vec4<f32>,\r\n    @location(0) TexCoord : vec2<f32>,\r\n}\r\n\r\n@vertex\r\nfn vert_main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {\r\n\r\n    var positions = array<vec2<f32>, 6>(\r\n        vec2<f32>( 1.0,  1.0),\r\n        vec2<f32>( 1.0, -1.0),\r\n        vec2<f32>(-1.0, -1.0),\r\n        vec2<f32>( 1.0,  1.0),\r\n        vec2<f32>(-1.0, -1.0),\r\n        vec2<f32>(-1.0,  1.0)\r\n    );\r\n\r\n    var texCoords = array<vec2<f32>, 6>(\r\n        vec2<f32>(1.0, 0.0),\r\n        vec2<f32>(1.0, 1.0),\r\n        vec2<f32>(0.0, 1.0),\r\n        vec2<f32>(1.0, 0.0),\r\n        vec2<f32>(0.0, 1.0),\r\n        vec2<f32>(0.0, 0.0)\r\n    );\r\n\r\n    var output : VertexOutput;\r\n    output.Position = vec4<f32>(positions[VertexIndex], 0.0, 1.0);\r\n    output.TexCoord = texCoords[VertexIndex];\r\n    return output;\r\n}\r\n\r\n@fragment\r\nfn frag_main(@location(0) TexCoord : vec2<f32>) -> @location(0) vec4<f32> {\r\n  return textureSample(color_buffer, screen_sampler, TexCoord);\r\n}";var a=function(e,r,t,n){return new(t||(t=Promise))((function(i,s){function a(e){try{c(n.next(e))}catch(e){s(e)}}function o(e){try{c(n.throw(e))}catch(e){s(e)}}function c(e){var r;e.done?i(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(a,o)}c((n=n.apply(e,r||[])).next())}))};const o=document.getElementById("gfx-main"),c=new class{constructor(){this.spheres=new Array(256);for(let r=0;r<this.spheres.length;r++){const t=[3+7*Math.random(),10*Math.random()-5,10*Math.random()-5],n=.1+1.9*Math.random(),i=[.3+.7*Math.random(),.3+.7*Math.random(),.3+.7*Math.random()];this.spheres[r]=new e(t,n,i)}this.camera=new i([-20,0,0])}},h=new class{constructor(e,r){this.render=()=>{this.prepareScene();let e=performance.now();const r=this.device.createCommandEncoder(),t=r.beginComputePass();t.setPipeline(this.ray_tracing_pipeline),t.setBindGroup(0,this.ray_tracing_bind_group),t.dispatchWorkgroups(this.canvas.width,this.canvas.height,1),t.end();const n=this.context.getCurrentTexture().createView(),i=r.beginRenderPass({colorAttachments:[{view:n,clearValue:{r:.5,g:0,b:.25,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.screen_pipeline),i.setBindGroup(0,this.screen_bind_group),i.draw(6,1,0,0),i.end(),this.device.queue.submit([r.finish()]),this.device.queue.onSubmittedWorkDone().then((()=>{let r=performance.now(),t=document.getElementById("render-time");t&&(t.innerText=(r-e).toFixed(2))})),requestAnimationFrame(this.render)},this.canvas=e,this.scene=r}Initialize(){return a(this,void 0,void 0,(function*(){yield this.setupDevice(),yield this.createAssets(),yield this.makePipeline(),this.render()}))}setupDevice(){var e,r;return a(this,void 0,void 0,(function*(){this.adapter=yield null===(e=navigator.gpu)||void 0===e?void 0:e.requestAdapter(),this.device=yield null===(r=this.adapter)||void 0===r?void 0:r.requestDevice(),this.context=this.canvas.getContext("webgpu"),this.format="bgra8unorm",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"})}))}makePipeline(){return a(this,void 0,void 0,(function*(){const e=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba8unorm",viewDimension:"2d"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage",hasDynamicOffset:!1}}]});this.ray_tracing_bind_group=this.device.createBindGroup({layout:e,entries:[{binding:0,resource:this.color_buffer_view},{binding:1,resource:{buffer:this.sceneParameters}},{binding:2,resource:{buffer:this.sphereBuffer}}]});const r=this.device.createPipelineLayout({bindGroupLayouts:[e]});this.ray_tracing_pipeline=this.device.createComputePipeline({layout:r,compute:{module:this.device.createShaderModule({code:"struct Sphere {\r\n    center: vec3<f32>,\r\n    color: vec3<f32>,\r\n    radius: f32,\r\n}\r\n\r\nstruct ObjectData {\r\n    spheres: array<Sphere>,\r\n}\r\n\r\nstruct Ray {\r\n    direction: vec3<f32>,\r\n    origin: vec3<f32>,\r\n}\r\n\r\nstruct SceneData {\r\n    cameraPos: vec3<f32>,\r\n    cameraForwards: vec3<f32>,\r\n    cameraRight: vec3<f32>,\r\n    cameraUp: vec3<f32>,\r\n    sphereCount: f32,\r\n}\r\n\r\n@group(0) @binding(0) var color_buffer: texture_storage_2d<rgba8unorm, write>;\r\n@group(0) @binding(1) var<uniform> scene: SceneData;\r\n@group(0) @binding(2) var<storage, read> objects: ObjectData;\r\n\r\n@compute @workgroup_size(1,1,1)\r\nfn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {\r\n\r\n    let screen_size: vec2<u32> = textureDimensions(color_buffer);\r\n    let screen_pos : vec2<i32> = vec2<i32>(i32(GlobalInvocationID.x), i32(GlobalInvocationID.y));\r\n\r\n    let horizontal_coefficient: f32 = (f32(screen_pos.x) - f32(screen_size.x) / 2) / f32(screen_size.x);\r\n    let vertical_coefficient: f32 = (f32(screen_pos.y) - f32(screen_size.y) / 2) / f32(screen_size.x);\r\n\r\n    let forwards: vec3<f32> = scene.cameraForwards;\r\n    let right: vec3<f32> = scene.cameraRight;\r\n    let up: vec3<f32> = scene.cameraUp;\r\n\r\n    var myRay: Ray;\r\n    myRay.direction = normalize(forwards + horizontal_coefficient * right + vertical_coefficient * up);\r\n    myRay.origin = scene.cameraPos;\r\n\r\n    let pixel_color : vec3<f32> = rayColor(&myRay);\r\n\r\n    textureStore(color_buffer, screen_pos, vec4<f32>(pixel_color, 1.0));\r\n}\r\n\r\nfn rayColor(ray: ptr<function,Ray>) -> vec3<f32> {\r\n\r\n    var color: vec3<f32> = vec3(0.0, 0.0, 0.0);\r\n\r\n    const epsilon: f32 = 0.01;\r\n    const maxDistance: f32 = 9999;\r\n    const maxSteps: u32 = 32;\r\n    var totalDistanceMarched: f32 = 0.0;\r\n\r\n    for (var step: u32 = 0; step < maxSteps; step++) {\r\n\r\n        var i: i32 = 0;\r\n        var distanceMarched: f32 = distance_to_scene(ray, &i);\r\n        \r\n        if (distanceMarched < epsilon) {\r\n            color = objects.spheres[i].color;\r\n            break; \r\n        }\r\n        \r\n        if (totalDistanceMarched > maxDistance) {\r\n            break;\r\n        }\r\n        totalDistanceMarched += distanceMarched;\r\n        \r\n        (*ray).origin += (*ray).direction * distanceMarched;\r\n    }\r\n    return color;\r\n}\r\n\r\nfn distance_to_scene(\r\n    ray: ptr<function,Ray>, \r\n    closest_sphere_index: ptr<function,i32>) -> f32 {\r\n\r\n    var closest_distance: f32 = 9999;\r\n    for (var i: i32 = 0; i < i32(scene.sphereCount); i++) {\r\n\r\n        var distance: f32 = distance_to_sphere(ray, i);\r\n        \r\n        if (distance < closest_distance) {\r\n            closest_distance = distance;\r\n            *closest_sphere_index = i;\r\n        }\r\n    }\r\n    return closest_distance;\r\n}\r\n\r\nfn distance_to_sphere(\r\n    ray: ptr<function,Ray>, \r\n    sphere_index: i32) -> f32 {\r\n\r\n    let rayToSphere: vec3<f32> = objects.spheres[sphere_index].center - (*ray).origin;\r\n    if (dot(rayToSphere, (*ray).direction) < 0) {\r\n        return 9999;\r\n    }\r\n    else {\r\n        return length(rayToSphere) - objects.spheres[sphere_index].radius;\r\n    }\r\n    \r\n}"}),entryPoint:"main"}});const t=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{}}]});this.screen_bind_group=this.device.createBindGroup({layout:t,entries:[{binding:0,resource:this.sampler},{binding:1,resource:this.color_buffer_view}]});const n=this.device.createPipelineLayout({bindGroupLayouts:[t]});this.screen_pipeline=this.device.createRenderPipeline({layout:n,vertex:{module:this.device.createShaderModule({code:s}),entryPoint:"vert_main"},fragment:{module:this.device.createShaderModule({code:s}),entryPoint:"frag_main",targets:[{format:"bgra8unorm"}]},primitive:{topology:"triangle-list"}})}))}createAssets(){return a(this,void 0,void 0,(function*(){this.color_buffer=this.device.createTexture({size:{width:this.canvas.width,height:this.canvas.height},format:"rgba8unorm",usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING}),this.color_buffer_view=this.color_buffer.createView(),this.sampler=this.device.createSampler({addressModeU:"repeat",addressModeV:"repeat",magFilter:"linear",minFilter:"nearest",mipmapFilter:"nearest",maxAnisotropy:1});const e={size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST};this.sceneParameters=this.device.createBuffer(e);const r={size:32*this.scene.spheres.length,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST};this.sphereBuffer=this.device.createBuffer(r)}))}prepareScene(){const e={cameraPos:this.scene.camera.position,cameraForwards:this.scene.camera.forwards,cameraRight:this.scene.camera.right,cameraUp:this.scene.camera.up,sphereCount:this.scene.spheres.length};this.device.queue.writeBuffer(this.sceneParameters,0,new Float32Array([e.cameraPos[0],e.cameraPos[1],e.cameraPos[2],0,e.cameraForwards[0],e.cameraForwards[1],e.cameraForwards[2],0,e.cameraRight[0],e.cameraRight[1],e.cameraRight[2],0,e.cameraUp[0],e.cameraUp[1],e.cameraUp[2],e.sphereCount]),0,16);const r=new Float32Array(8*this.scene.spheres.length);for(let e=0;e<this.scene.spheres.length;e++)r[8*e]=this.scene.spheres[e].center[0],r[8*e+1]=this.scene.spheres[e].center[1],r[8*e+2]=this.scene.spheres[e].center[2],r[8*e+3]=0,r[8*e+4]=this.scene.spheres[e].color[0],r[8*e+5]=this.scene.spheres[e].color[1],r[8*e+6]=this.scene.spheres[e].color[2],r[8*e+7]=this.scene.spheres[e].radius;this.device.queue.writeBuffer(this.sphereBuffer,0,r,0,8*this.scene.spheres.length)}}(o,c);h.Initialize()})();