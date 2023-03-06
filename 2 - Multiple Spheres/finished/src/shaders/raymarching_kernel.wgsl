struct Sphere {
    center: vec3<f32>,
    color: vec3<f32>,
    radius: f32,
}

struct ObjectData {
    spheres: array<Sphere>,
}

struct Ray {
    direction: vec3<f32>,
    origin: vec3<f32>,
}

struct SceneData {
    cameraPos: vec3<f32>,
    cameraForwards: vec3<f32>,
    cameraRight: vec3<f32>,
    cameraUp: vec3<f32>,
    sphereCount: f32,
}

@group(0) @binding(0) var color_buffer: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(1) var<uniform> scene: SceneData;
@group(0) @binding(2) var<storage, read> objects: ObjectData;

@compute @workgroup_size(1,1,1)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {

    let screen_size: vec2<u32> = textureDimensions(color_buffer);
    let screen_pos : vec2<i32> = vec2<i32>(i32(GlobalInvocationID.x), i32(GlobalInvocationID.y));

    let horizontal_coefficient: f32 = (f32(screen_pos.x) - f32(screen_size.x) / 2) / f32(screen_size.x);
    let vertical_coefficient: f32 = (f32(screen_pos.y) - f32(screen_size.y) / 2) / f32(screen_size.x);

    let forwards: vec3<f32> = scene.cameraForwards;
    let right: vec3<f32> = scene.cameraRight;
    let up: vec3<f32> = scene.cameraUp;

    var myRay: Ray;
    myRay.direction = normalize(forwards + horizontal_coefficient * right + vertical_coefficient * up);
    myRay.origin = scene.cameraPos;

    let pixel_color : vec3<f32> = rayColor(&myRay);

    textureStore(color_buffer, screen_pos, vec4<f32>(pixel_color, 1.0));
}

fn rayColor(ray: ptr<function,Ray>) -> vec3<f32> {

    var color: vec3<f32> = vec3(0.0, 0.0, 0.0);

    const epsilon: f32 = 0.01;
    const maxDistance: f32 = 9999;
    const maxSteps: u32 = 32;
    var totalDistanceMarched: f32 = 0.0;

    for (var step: u32 = 0; step < maxSteps; step++) {

        var i: i32 = 0;
        var distanceMarched: f32 = distance_to_scene(ray, &i);
        
        if (distanceMarched < epsilon) {
            color = objects.spheres[i].color;
            break; 
        }
        
        if (totalDistanceMarched > maxDistance) {
            break;
        }
        totalDistanceMarched += distanceMarched;
        
        (*ray).origin += (*ray).direction * distanceMarched;
    }
    return color;
}

fn distance_to_scene(
    ray: ptr<function,Ray>, 
    closest_sphere_index: ptr<function,i32>) -> f32 {

    var closest_distance: f32 = 9999;
    for (var i: i32 = 0; i < i32(scene.sphereCount); i++) {

        var distance: f32 = distance_to_sphere(ray, i);
        
        if (distance < closest_distance) {
            closest_distance = distance;
            *closest_sphere_index = i;
        }
    }
    return closest_distance;
}

fn distance_to_sphere(
    ray: ptr<function,Ray>, 
    sphere_index: i32) -> f32 {

    let rayToSphere: vec3<f32> = objects.spheres[sphere_index].center - (*ray).origin;
    if (dot(rayToSphere, (*ray).direction) < 0) {
        return 9999;
    }
    else {
        return length(rayToSphere) - objects.spheres[sphere_index].radius;
    }
    
}