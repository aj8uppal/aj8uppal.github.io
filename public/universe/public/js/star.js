class Star {
  constructor(x, y, z, radius, temperature, scene){
    // super(x, y, z, radius, temperature, scene, 0xf9d71c);
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.material = new THREE.MeshBasicMaterial( {color: 0xf9d71c, transparent: true, opacity: 0.75} );
    this.star = new THREE.Mesh( this.geometry, this.material );
    this.star.position.set(x, y, z)
    this.scene = scene;
    this.scene.add(this.star);
  }
  scaleRadius(scale){
    this.scale = scale;
    this.star.scale.x = this.scale;
    this.star.scale.y = this.scale;
    this.star.scale.z = this.scale;
  }
}
