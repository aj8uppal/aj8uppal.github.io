class Body {
  constructor(x, y, z, radius, temperature, scene){
    //all units relative to earth
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.temperature = temperature;
    this.scene = scene;
    this.color = Math.random() * 0xffffff; //some function of temperature
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.material = new THREE.MeshPhongMaterial( {color: this.color} );
    this.body = new THREE.Mesh( this.geometry, this.material );
    this.body.position.set( this.x, this.y, this.z );
    this.body.castShadow = false;
    this.body.receiveShadow = false;
    this.theta = Math.random()*2*Math.PI;
    this.dTheta = Math.random()*0.02;
    this.scene.add( this.body );

  }
  setPos(x, y, z){
    this.body.position.set(x, y, z);
    // console.log(x, y, z);
  }
}
