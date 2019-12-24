class Bullet {
  constructor(x, y, z, scene, thresholdDepth, playerFlag){
    //x coord, y coord, z coord, threejs scene, threshold in units before removing, player flag (true means player bullet, false means opponent)
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = scene;
    this.playerFlag = playerFlag;
    this.thresholdDepth = thresholdDepth;
    this.color = 0xff9500;
    this.speed = playerFlag ? 0.05 : -0.05;
    this.radius = 0.25;
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.material = new THREE.MeshBasicMaterial( {color: this.color} );
    this.materialDanger = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    this.bullet = new THREE.Mesh( this.geometry, this.material );
    this.bullet.position.set( this.x, this.y, this.z );
    this.scene.add( this.bullet );
  }
  move(obj, pW, pH, pD){
    //returns -1 if object has expired, 1 if it collided with the opponent, 0 otherwise
    this.bullet.position.z-=this.speed;

    if(this.playerFlag){
      if(this.bullet.position.z < -this.thresholdDepth){
        this.scene.remove( this.bullet );
        return -1;
      }
      return this.checkCollisionWith(obj, pW, pH, pD);
    }else{
      if(this.bullet.position.z > this.thresholdDepth){
        this.scene.remove( this.bullet );
        return -1;
      }
    }
  }
  checkCollisionWith(obj, pW, pH, pD){
    //returns 0 if no collision, 1 if collision
    return (Number)( ( this.bullet.position.z + this.radius > obj.position.z - pD/2 && this.bullet.position.z - this.radius < obj.position.z + pD/2 )  &&
      ( this.bullet.position.x + this.radius > obj.position.x - pW/2 && this.bullet.position.x - this.radius < obj.position.x + pW/2 ) );
  }
}
