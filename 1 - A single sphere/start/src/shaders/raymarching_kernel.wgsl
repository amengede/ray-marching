@group(0) @binding(0) var color_buffer: texture_storage_2d<rgba8unorm, write>;

struct Sphere {
    center: vec3<f32>,
    radius: f32,
}

struct Ray {
    direction: vec3<f32>,
    origin: vec3<f32>,
}

@compute @workgroup_size(1,1,1)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {

    let screen_size: vec2<u32> = textureDimensions(color_buffer);
    let screen_pos : vec2<i32> = vec2<i32>(i32(GlobalInvocationID.x), i32(GlobalInvocationID.y));

    let horizontal_coefficient: f32 = (f32(screen_pos.x) - f32(screen_size.x) / 2) / f32(screen_size.x);
    let vertical_coefficient: f32 = (f32(screen_pos.y) - f32(screen_size.y) / 2) / f32(screen_size.x);
    let forwards: vec3<f32> = vec3<f32>(1.0, 0.0, 0.0);
    let right: vec3<f32> = vec3<f32>(0.0, -1.0, 0.0);
    let up: vec3<f32> = vec3<f32>(0.0, 0.0, 1.0);

    var mySphere: Sphere;
    mySphere.center = vec3<f32>(3.0, 0.0, 0.0);
    mySphere.radius = 1.0;

    var myRay: Ray;
    myRay.direction = normalize(forwards + horizontal_coefficient * right + vertical_coefficient * up);
    myRay.origin = vec3<f32>(0.0, 0.0, 0.0);

    var pixel_color : vec3<f32> = vec3<f32>(0.5, 0.0, 0.25);

    /*
        Task: march the ray forwards until it touches the sphere,
        or misses.
    */
    const maxSteps: u32 = 32;

    for (var step: u32 = 0; step < maxSteps; step++) {

        //TODO: get the distance from the ray to the sphere
        
        //TODO: if the ray is close enough to the sphere,
        //      set the color to the sphere's color 
        //      (0.5, 1.0, 0.75)
        
        //TODO: is it possible to check if the ray has missed
        //      the sphere?
        
        //TODO: march the origin of the ray forwards by the
        //      appropriate distance
    }

    textureStore(color_buffer, screen_pos, vec4<f32>(pixel_color, 1.0));
}

/*
    Task: implement a signed distance function for a sphere.

    It should return the distance from the ray's origin to
    the sphere's center and should be signed:
        +ve:    ray outside sphere surface
        0:      ray on sphere surface
        -ve:    ray inside sphere surface
*/