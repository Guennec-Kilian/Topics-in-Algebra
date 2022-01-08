// Author: Guennec Kilian
// Title: Visualisation of f(z) = z^3-1 via Newton fractal

#ifdef GL_ES
precision mediump float;
#endif

// complex operators
#define cproduct(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define cdivide(a, b) vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y)))

// constantes (modifiable to change the rendering)
#define tolerance 0.5 // value between 0 and 1
#define maxIter 10000
#define invertSpeed 15. // float (put a . at the end for it to work)

uniform vec2 u_resolution;
uniform float u_time;

vec2 f(vec2 z){ // z^3-1
    return cproduct(z, cproduct(z,z)) - vec2(1,0);
}

vec2 fp(vec2 z){ // 3*z^2
    return 3.*cproduct(z,z);
}


void main() {
    
    vec2 z = gl_FragCoord.xy/u_resolution.xy; // get one pixel coordinate of the image
	
    // modify space from [0,1] X [0,1] to [-2.5, 1] X [-1, 1]
    z.x = 3.5*z.x - 2.5;
    z.y = 2.*z.y - 1.;
    
    // time function for the animation
    float fracu = fract(u_time/invertSpeed)*4.-2.;
    float c = fracu*sign(fracu)-1.;
    
    // colors vectors
    vec3 red = vec3(1.,0.,0.);
    vec3 green = vec3(0.,1.,0.);
    vec3 blue = vec3(0.,0.,1.);
    
    // roots of the equation f(z) = 0
    vec2 root1 = vec2(1.,0.);
    vec2 root2 = vec2(-0.5,-sqrt(3.)/2.);
    vec2 root3 = vec2(-0.5,sqrt(3.)/2.);
    
    for(int i=0;i<maxIter;i++){
    
        // calculate z_n+1 from z_n
        // comment/uncomment the expression of z_n+1 you want to try
        //
        // still image
        z -= cdivide(f(z),fp(z));
        //
        // movement along the reals
    	//z -= vec2(c,0.)+cdivide(f(z),fp(z));
        //
        // movement along the imaginaries
    	//z -= vec2(0., c)+cdivide(f(z),fp(z));
        //
        // variant of c for the next movement best used with large tolerances
        //vec2 c = 0.5*vec2(cos(u_time/2.), sin(u_time/2.));
        // movement along the reals and the imaginaries
    	//z -= c+cdivide(f(z),fp(z));
        
        // difference between z_n+1 and the roots
        vec2 diff1 = z-root1;
        vec2 diff2 = z-root2;
        vec2 diff3 = z-root3;
        
        // for each color, (red, green, blue) test if |diffx| < tolerance. Black is the default color for the abscence of informations
    	vec3 color = (1.-step(pow(tolerance,2.), pow(diff1.x,2.)+pow(diff1.y,2.))) * red + (1.-step(pow(tolerance,2.), pow(diff2.x,2.)+pow(diff2.y,2.))) * green + (1.-step(pow(tolerance,2.), pow(diff3.x,2.)+pow(diff3.y,2.))) * blue;
        
        gl_FragColor = vec4(color,1.0);
    }
    
}