class Bullet {
  constructor(x, y, z, scene, thresholdDepth, playerFlag){
    //x coord, y coord, z coord, threejs scene, threshold in units before removing, player flag (true means player bullet, false means opponent)
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = scene;
    this.playerFlag = playerFlag;
    this.thresholdDepth = thresholdDepth;
    // this.color = 0xff9500;
    this.color = playerFlag ? 0x228b22 : 0x9b111e;
    this.speed = playerFlag ? 0.2 : -0.2;
    this.radius = 0.1;
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.material = new THREE.MeshPhongMaterial( {color: this.color} );
    this.materialDanger = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    this.bullet = new THREE.Mesh( this.geometry, this.material );
    this.bullet.position.set( this.x, this.y, this.z );
    // this.bullet.receiveShadow = true;
    this.bullet.castShadow = true;
    this.scene.add( this.bullet );
  }
  move(obj, pW, pH, pD){
    //returns -1 if object has expired, 1 if it collided with the opponent, 0 otherwise
    this.bullet.position.z-=this.speed;

    if(this.playerFlag){
      if(this.bullet.position.z < -this.thresholdDepth){
        this.remove();
        return -1;
      }
      return this.checkCollisionWithPlayer(obj, pW, pH, pD);
    }else{
      if(this.bullet.position.z > this.thresholdDepth){
        this.remove();
        return -1;
      }
    }
  }
  checkCollisionWithPlayer(obj, pW, pH, pD){
    //returns 0 if no collision, 1 if collision
    return (Number)( ( ( this.bullet.position.z + this.radius > obj.position.z - pD/2 && this.bullet.position.z - this.radius < obj.position.z + pD/2 )  &&
      ( this.bullet.position.x + this.radius > obj.position.x - pW/2 && this.bullet.position.x - this.radius < obj.position.x + pW/2 ) ) &&
      ( ( this.bullet.position.z + this.radius > obj.position.z - pD/2 && this.bullet.position.z - this.radius < obj.position.z + pD/2 )  &&
        ( this.bullet.position.y + this.radius > obj.position.y - pH/2 && this.bullet.position.y - this.radius < obj.position.y + pH/2 ) ) );
  }
  checkCollisionWithBullets(opponentBullets){
    for(let o in opponentBullets){
      if(Math.abs(this.bullet.position.distanceTo(opponentBullets[o].bullet.position)) < this.radius + opponentBullets[o].radius){
        opponentBullets[o].remove();
        this.remove();
        opponentBullets.splice(o, 1);
        return true;
      }
    }
    return false;
  }
  remove(){
    this.scene.remove(this.bullet);
  }
  getPos(){
    return this.bullet.position;
  }
}
