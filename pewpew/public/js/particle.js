class Particle {
  constructor(x, y, z, gravity, colorFunc, geometry, scene){
    this.x = x;
    this.y = y;
    this.z = z;
    this.velX = 0.05*(Math.random()-0.5);
    this.velZ = 0.05*(Math.random()-0.5);
    this.velY = 0.05*(Math.random()+2);
    this.gravity = gravity;
    this.color = parseInt(d3.rgb(colorFunc(Math.random()*2-1)).hex().slice(1), 16);
    this.material = new THREE.MeshBasicMaterial( {color: this.color, transparent: true, opacity: 1} );
    this.geometry = geometry;
    this.particle = new THREE.Mesh( this.geometry, this.material );
    this.particle.position.set(x, y, z);
    this.scene = scene;
    this.scene.add(this.particle);
  }
  move(){
    this.x+=this.velX;
    this.y+=this.velY;
    this.z+=this.velZ;
    this.velY-=this.gravity;
    if(this.startFade){
      this.material.opacity-=0.02;
      if(this.material.opacity <= 0){
        return false;
      }
    }
    this.particle.position.set(this.x, this.y, this.z);
    if(this.y < -2.5){
      this.y = -2.5;
      this.velY*=-0.65;
      this.startFade = true;
    }
    return true;
  }
  remove(){
    this.scene.remove(this.particle);
  }
}
