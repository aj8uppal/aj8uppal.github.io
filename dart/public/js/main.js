$(function(){

  const visibleHeightAtZDepth = ( depth, camera ) => {
  // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
  };

  const visibleWidthAtZDepth = ( depth, camera ) => {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
  };

  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 0);
  // camera.lookAt(0, 0, -10)
  // camera.position.y = 0;
  let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas")});
  renderer.setSize( window.innerWidth-50, window.innerHeight-50 );
  document.body.appendChild( renderer.domElement );

  let floorGeometry = new THREE.SphereGeometry(15, 30, 30);
  let floorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff} );
  let floor = new THREE.Mesh( floorGeometry, floorMaterial );

  var geo = new THREE.BoxGeometry(20, 1, 20);
  var mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var plane = new THREE.Mesh(geo, mat);
  // plane.rotateX( - Math.PI / 2);
  plane.position.set(0, -5, 0);
  camera.lookAt(0, -2.5, 10)

  // camera.lookAt(plane.position);
  scene.add(plane);

  // scene.add(floor);

  let main = () => {

    // floor.position.y-=0.1;
    // console.log(floor.position);
    // debugger;
    renderer.render(scene, camera);
    requestAnimationFrame(main);
  }
  $(document).keydown(function(event){
    // camera.lookAt(floor.position);
    console.log(camera.position);
    switch(event.keyCode){
      case 37:
       camera.position.x-=1;
       break;
      case 38:
        camera.position.y+=1;
        break;
      case 39:
        camera.position.x+=1;
        break;
      case 40:
        camera.position.y-=1;
        break;
      case 65:
        camera.position.z-=1;
        break;
      case 68:
        camera.position.z+=1;
        break;
      default:
        break;

    }
  })
  main();
  // floor.position.z = 5;

});
