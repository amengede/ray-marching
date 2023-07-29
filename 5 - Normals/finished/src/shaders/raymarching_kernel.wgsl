@group(0) @binding(0) var color_buffer: texture_storage_2d<rgba8unorm, write>;

struct Sphere {
    center: vec3<f32>,
    radius: f32,
}

struct Ray {
    direction: vec3<f32>,
    origin: vec3<f32>,
}

const spheres: array<Sphere,6> = array(
    Sphere(vec3<f32>(6.0, -0.25,  1.5), 0.5),
    Sphere(vec3<f32>(6.0,  0.25,  1.5), 0.5),
    Sphere(vec3<f32>(6.0, -0.25,  0.0), 0.5),
    Sphere(vec3<f32>(6.0,  0.25,  0.0), 0.5),
    Sphere(vec3<f32>(6.0, 0.0, -1.5), 0.5),
    Sphere(vec3<f32>(5.375, 0.0, -1.5), 0.5)
);

@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {

    let screen_size: vec2<u32> = textureDimensions(color_buffer);
    let screen_pos : vec2<i32> = vec2<i32>(i32(GlobalInvocationID.x), i32(GlobalInvocationID.y));

    let horizontal_coefficient: f32 = (f32(screen_pos.x) - f32(screen_size.x) / 2) / f32(screen_size.x);
    let vertical_coefficient: f32 = (f32(screen_pos.y) - f32(screen_size.y) / 2) / f32(screen_size.x);
    let forwards: vec3<f32> = vec3<f32>(1.0, 0.0, 0.0);
    let right: vec3<f32> = vec3<f32>(0.0, -1.0, 0.0);
    let up: vec3<f32> = vec3<f32>(0.0, 0.0, -1.0);

    var myRay: Ray;
    myRay.direction = normalize(forwards + horizontal_coefficient * right + vertical_coefficient * up);
    myRay.origin = vec3<f32>(0.0, 0.0, 0.0);

    var pixel_color : vec3<f32> = vec3<f32>(0.5, 0.0, 0.25);

    const epsilon: f32 = 0.001;
    const maxDistance: f32 = 9999;
    const maxSteps: u32 = 32;
    var totalDistanceMarched: f32 = 0.0;

    for (var step: u32 = 0; step < maxSteps; step++) {

        var distanceMarched: f32 = distance_to_scene(myRay.origin, maxDistance);
        
        if (distanceMarched < epsilon) {
            pixel_color = 0.5 * (vec3<f32>(1.0) + calculate_normal(myRay.origin));
            break; 
        }
        
        if (totalDistanceMarched > maxDistance) {
            break;
        }
        totalDistanceMarched += distanceMarched;
        
        myRay.origin += myRay.direction * distanceMarched;
    }

    textureStore(color_buffer, screen_pos, vec4<f32>(pixel_color, 1.0));
}

fn calculate_normal(pos: vec3<f32>) -> vec3<f32> {

    let dx: vec3<f32> = vec3<f32>(0.001,   0.0,   0.0);
    let dy: vec3<f32> = vec3<f32>(  0.0, 0.001,   0.0);
    let dz: vec3<f32> = vec3<f32>(  0.0,   0.0, 0.001);

    let nx: f32 = distance_to_scene(pos + dx, 1.0) - distance_to_scene(pos - dx, 1.0);
    let ny: f32 = distance_to_scene(pos + dy, 1.0) - distance_to_scene(pos - dy, 1.0);
    let nz: f32 = distance_to_scene(pos + dz, 1.0) - distance_to_scene(pos - dz, 1.0);

    return normalize(vec3<f32>(nx, ny, nz));
}

fn distance_to_scene(
    pos: vec3<f32>,
    maxDistance: f32) -> f32 {
        
    var distance: f32 = maxDistance;
    
    // top row: union
    distance = min(
        distance, 
        union_op(distance_to_sphere(pos, 0), distance_to_sphere(pos, 1)));
        
    // middle row: intersection
    distance = min(
        distance, 
        intersect_op(distance_to_sphere(pos, 2), distance_to_sphere(pos, 3)));
        
    // top row: difference
    distance = min(
        distance, 
        difference_op(distance_to_sphere(pos, 4), distance_to_sphere(pos, 5)));
    
    return distance;
}

fn distance_to_sphere(
    pos: vec3<f32>, 
    i: i32) -> f32 {
    
    let sphere: Sphere = spheres[i];
    let rayToSphere: vec3<f32> = sphere.center - pos;
    return length(rayToSphere) - sphere.radius;
    
}

fn union_op(a: f32, b: f32) -> f32 {
    return min(a, b);
}

fn intersect_op(a: f32, b: f32) -> f32 {
    return max(a, b);
}

fn negate_op(a: f32) -> f32 {
    return -a;
}

fn difference_op(a: f32, b: f32) -> f32 {
    return max(a, -b);
}