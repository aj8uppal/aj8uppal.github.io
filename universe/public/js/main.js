$(function(){
  let socket = io('ws://localhost:6355');
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
  camera.position.set(100, 0, 0);
  camera.lookAt(0, 0, 0);

  let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas")});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var light = new THREE.PointLight( 0xf9d71c, 5000);
  light.position.set( 0, 0, 0 );
  scene.add( light );

  var ambientLight = new THREE.AmbientLight( 0x404040, 0.25 ); // soft white light
  scene.add( ambientLight );

  let SCALE = 100;
  let timeScale = 0.02;

  let planets = [];
  let info = {
    'mercury': {
        'ecc': 0.205630,
        'sma': 0.387499,
        'per': 0.240846,
        'rad': 1.63e-5,
    },
    'venus': {
        'ecc': 0.006772,
        'sma': 0.723332,
        'per': 0.615198,
        'rad': 4.04538e-5,
    },
    'earth': {
        'ecc': 0.0167,
        'sma': 1,
        'per': 1,
        'rad': 4.2635e-5,
    },
    'mars': {
        'ecc': 0.0934,
        'sma': 1.523679,
        'per': 1.88082,
        'rad': 2.27075e-5,
    },
    'jupiter': {
        'ecc': 0.0489,
        'sma': 5.2044,
        'per': 11.862,
        'rad': 4.779e-4,
    },
    'saturn': {
        'ecc': 0.0565,
        'sma': 9.5826,
        'per': 29.4571,
        'rad': 4.02867e-4,
    },
    'uranus': {
        'ecc': 0.046381,
        'sma': 19.2184,
        'per': 84.0205,
        'rad': 1.7085e-4,
    },
    'neptune': {
        'ecc': 0.009456,
        'sma': 30.11,
        'per': 164.8,
        'rad': 1.6554e-4,
    },
    'pluto': {
        'ecc': 0.2488,
        'sma': 39.482,
        'per': 247.94,
        'rad': 7.888e-6,
    },
  }

  for(let p in info){
    planet = info[p];
    planets.push(new Planet(planet.ecc, planet.sma, planet.per, planet.rad*1e3, 273.15, scene, SCALE, p))
  }

  // let mercury = new Planet(0.205630, 0.387499, 0.240846, 1.63e-2, 273.15, scene, SCALE);
  // let venus = new Planet(0.006772, 0.723332, 0.615198, 4.04538e-2, 273.15, scene, SCALE);
  // let earth = new Planet(0.0167, 1, 1, 4.2635e-2, 273.15, scene, SCALE);
  // let mars = new Planet(0.0934, 1.523679, 1.88082, 2.27075e-2, 273.15, scene, SCALE);
  // let jupiter = new Planet(0.0489, 5.2044, 11.862, 4.779e-1, 273.15, scene, SCALE);
  // let saturn = new Planet(0.0565, 9.5826, 29.4571, 4.02867e-1, 273.15, scene, SCALE);
  // let uranus = new Planet(0.046381, 19.2184, 84.0205, 1.7085e-1, 273.15, scene, SCALE);
  // let neptune = new Planet(0.009456, 30.11, 164.8, 1.6554e-1, 273.15, scene, SCALE);
  // let pluto = new Planet(	0.2488, 39.482, 247.94, 7.888e-3, 273.15, scene, SCALE);



  // stars.push(new Star(50, 50, 50, 5, 1000, scene, 0xffffff));
  geometry = new THREE.SphereGeometry( 25, 32, 32 );
  material = new THREE.MeshBasicMaterial( {color: 0xf9d71c, transparent: true, opacity: 0.75} );
  source = new THREE.Mesh( geometry, material );
  source.position.set(0, 0, 0)
  scene.add(source);
  let controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.addEventListener('change', function(){renderer.render( scene, camera );});

  let animate = () => {
    requestAnimationFrame( animate );
    for(let p in planets){
      planets[p].move();
    }
    controls.update();
    $("#time").html(`Elapsed time: ${(planets[2].theta/(2*Math.PI)).toFixed(3)} years.`)
    // for(let s in stars){
    //
    //     stars[s].theta+=stars[s].dTheta;
    //     stars[s].star.position.x+=Math.cos(stars[s].theta)/10;
    //     // stars[s].star.position.y+=Math.sin(stars[s].theta);
    //     stars[s].star.position.z+=Math.cos(stars[s].theta)/10;
    // }
    renderer.render( scene, camera );
  }
  animate();
  $("#timescale").change(function(){
    for(let p in planets){
      planets[p].calculateDTheta(parseFloat($(this).val()));
    }
  })
});
