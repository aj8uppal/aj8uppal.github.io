class Spark {
  constructor(x, y, z, scene, colorFunc){
    this.x = x;
    this.y = y;
    this.z = z;
    this.gravity = 0.0075; //0.0981
    this.numOfParticles = 20;
    this.particles = [];
    this.radius = 0.05;
    this.particleGeometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.colorFunc = colorFunc;
    this.scene = scene;
    this.init();
  }
  init(){
    for(let i = 0; i < this.numOfParticles; i++){
      this.particles.push(new Particle(this.x, this.y, this.z, this.gravity, this.colorFunc, this.particleGeometry, this.scene));
    }
  }
  move(){
    for(let p in this.particles){
      if(!this.particles[p].move()){
        this.particles[p].remove();
        this.particles.splice(p, 1);
      }
    }
  }
}
