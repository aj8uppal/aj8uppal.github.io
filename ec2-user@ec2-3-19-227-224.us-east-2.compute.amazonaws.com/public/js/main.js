$(function(){
  let name = prompt("What is your name?");
  let opponentName;
  let socket = io('ws://abd63da9.ngrok.io');
  // let socket = io('ws://localhost:3010');
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 4;
  camera.position.y = -0.5;

  let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas")});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var myElement = document.getElementById("canvas");

  // create a simple instance
  // by default, it only adds horizontal recognizers
  var mc = new Hammer(myElement, {inputClass: Hammer.TouchInput});
  mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  mc.add( new Hammer.Tap({ event: 'singletap' }) );

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

  let textLabel = new AnimatedElement("#info", "text");
  textLabel.appear();
  let choiceLabel = new AnimatedElement(".choices", "button");
  let rematchLabel = new AnimatedElement("#opponentrematch", "text");

  let newGameOption = false;
  let connected = false;
  let matched = false;
  let gameOver = false;
  let fade = false;
  let opponentFade = false;
  let fadeIn = false;
  let opponentFadeIn = false;

  let keyPresses = {87: false, 65: false, 83: false, 68: false, 32: false}; //W A S D SPACE
  let opponentKeyPresses = {65: false, 68: false}; //A D
  let bullets = [];
  let shot = false;
  let rematchOpen = true;

  let playerWidth = 1;
  let playerHeight = 1;
  let playerDepth = 0.75;
  let playerOpacity = 0.8;
  let cameraHeight = visibleHeightAtZDepth(0, camera);
  let floorWidth = visibleWidthAtZDepth(0, camera);
  let floorHeight = 0.5;
  let floorDepth = 15;

  let cubeGeometry = new THREE.BoxGeometry( playerWidth, playerHeight, playerDepth );
  let playerMaterial = new THREE.MeshBasicMaterial( { color: 0x228b22, opacity: playerOpacity, transparent: true } );
  let opponentMaterial = new THREE.MeshBasicMaterial( { color: 0x9b111e, opacity: playerOpacity+0.1, transparent: true } );

  //player
  let player = new THREE.Mesh( cubeGeometry, playerMaterial );
  player.position.y = -2;
  player.position.z = 0.75;

  //opponent
  let opponent = new THREE.Mesh( cubeGeometry, opponentMaterial );
  opponent.position.y = -2;
  opponent.position.z = -(floorDepth/2-playerDepth*2);

  //floor plane (thin box)
  let floorGeometry = new THREE.BoxGeometry(floorWidth, floorHeight, floorDepth);
  let floorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.75, transparent: false } );
  let floor = new THREE.Mesh( floorGeometry, floorMaterial );
  floor.position.y = player.position.y-(playerHeight-floorHeight/2);

  //add edges
  let lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10 } );
  let playerEdgeGeometry = new THREE.EdgesGeometry( player.geometry );
  let opponentEdgeGeometry = new THREE.EdgesGeometry( opponent.geometry );

  let playerWireframe = new THREE.LineSegments( playerEdgeGeometry, lineMaterial );
  playerWireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
  player.add( playerWireframe );

  let opponentWireframe = new THREE.LineSegments( opponentEdgeGeometry, lineMaterial );
  opponentWireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
  opponent.add( opponentWireframe );

  mc.on("panleft", (ev) => {
      keyPresses[65] = true;
      keyPresses[68] = false;
      socket.emit('keyDown', 65);
      socket.emit('keyUp', {keyCode: 68, pos: {x: player.position.x, y: player.position.y}});
  });
  mc.on("panright", (ev) => {
      // player.position.x+=5;
      keyPresses[68] = true;
      keyPresses[65] = false;
      socket.emit('keyDown', 68);
      socket.emit('keyUp', {keyCode: 65, pos: {x: player.position.x, y: player.position.y}});
  });
  mc.on("singletap", function(ev) {
    keyPresses[32] = true;
    shot = false;
    keyPresses[87] = false;
    keyPresses[83] = false;
    socket.emit('keyUp', {keyCode: 87, pos: {x: player.position.x, y: player.position.y}});
    socket.emit('keyUp', {keyCode: 83, pos: {x: player.position.x, y: player.position.y}});
  });
  mc.on("panup", (ev) => {
      // player.position.x+=5;
      keyPresses[87] = true;
      keyPresses[83] = false;
      socket.emit('keyDown', 87);
      socket.emit('keyUp', {keyCode: 83, pos: {x: player.position.x, y: player.position.y}});
  });
  mc.on("pandown", (ev) => {
      // player.position.x+=5;
      keyPresses[83] = true;
      keyPresses[87] = false;
      socket.emit('keyDown', 83);
      socket.emit('keyUp', {keyCode: 87, pos: {x: player.position.x, y: player.position.y}});
  });

  const color = 0x000000;  // white
  const near = 1;
  const far = 20;

  // opponent.receiveShadow = true;
  opponent.castShadow = true;

  // player.receiveShadow = true;
  player.castShadow = true;

  floor.receiveShadow = true;
  scene.add( player );
  scene.add( opponent );
  scene.add(floor);
  scene.background = new THREE.Color(color);
  scene.fog = new THREE.Fog(color, near, far);

  let light = new THREE.DirectionalLight( 0xffffff, 1);
  light.position.set( opponent.x, 3, opponent.z ); 			//default; light shining from top
  light.castShadow = true;            // default false
  scene.add( light );


  //socket stuff
  let initiateConnection = (ellipsisLength) => {
    if(matched){
      return;
    }
    textLabel.changeHTML("Connecting"+".".repeat(ellipsisLength));
    setTimeout(function(){
      initiateConnection(ellipsisLength === 3 ? 0 : ellipsisLength + 1);
    }, 250);
  }

  socket.on('connected', function(){
    initiateConnection(3);
    connected = true;
    socket.emit('ready', name);
  });

  socket.on('matched', function(data){
    matched = true;
    gameOver = false;
    textLabel.changeText(`Matched with ${data.name}.`);
    textLabel.disappearIn(1500);
    opponentName = data.name;
  });

  socket.on('opponentDC', function(){
    if(matched){
      alert("Your opponent disconnected. They suck.");
    }
  });

  socket.on('opponentKeyDown', function(keyCode){
    opponentKeyPresses[keyCode] = true;
  })

  socket.on('opponentKeyUp', function(data){
    opponentKeyPresses[data.keyCode] = false;
    opponent.position.x = -data.pos.x;
    opponent.position.y = data.pos.y;
  })

  socket.on('playerShot', function(pos){
    console.log('playerShot');
    bullets.push(new Bullet(...pos, scene, floorDepth, true));
  })

  socket.on('opponentShot', function(pos){
    console.log('opponentShot');
    bullets.push(new Bullet(...[-pos[0], pos[1], opponent.position.z], scene, camera.position.z, false));
  });

  socket.on('lost', function(){
    textLabel.changeText("You lost!");
    gameOver = true;
    fade = true;
    rematchOpen = true;
    textLabel.changeTextIn("Rematch?", 2000);
    choiceLabel.appearIn(2000);
  });

  socket.on('rematch', function(flag){
    if(flag){
      init();
      textLabel.disappear();
    }else{
      matched = false;
      if(rematchOpen){
        $("#yes").addClass("disabled");
        rematchOpen = false;
      }
    }
  });

  socket.on('acceptedRematch', function(flag){
    if(flag){
      rematchLabel.css("color", "#228b22");
      rematchLabel.changeHTML(`${opponentName || "Opponent"} wants a rematch!`);
    }else{
      rematchOpen = false;
      matched = false;
      rematchLabel.css("color", "#9b111e");
      rematchLabel.changeHTML(`${opponentName || "Opponent"} has left.`);
      $("#yes").addClass("disabled");
    }
    rematchLabel.appear();
  });

  let init = () => {
    for(let b in bullets){
      bullets[b].remove();
    }
    bullets = [];
    gameOver = false;
    fadeIn = true;
    opponentFadeIn = true;
    choiceLabel.disappear();
    rematchLabel.disappear();
  }

  let animate = () =>  {
    requestAnimationFrame( animate );
    if(!connected || !matched){
      return;
    }
    if(fade){
      player.material.opacity-=0.01;
      if(player.material.opacity < 0.1){
        player.material.opacity = 0.1;
        fade = false;
      }
    }
    if(opponentFade){
      opponent.material.opacity-=0.01;
      if(opponent.material.opacity < 0.1){
        opponent.material.opacity = 0.1;
        opponentFade = false;
      }
    }
    if(fadeIn){
      player.material.opacity+=0.01;
      if(player.material.opacity > 1){
        player.material.opacity = 1;
        fadeIn = false;
      }
    }
    if(opponentFadeIn){
      opponent.material.opacity+=0.01;
      if(opponent.material.opacity > 1){
        opponent.material.opacity = 1;
        opponentFadeIn = false;
      }
    }

    if(!rematchOpen && !newGameOption){
      textLabel.changeTextIn("New Game?", 500, () => {
        $("#yes").removeClass("disabled");
        newGameOption = true;
      });
    }

    for(let b in bullets){
      if(gameOver){
        break;
      }
      let bullet = bullets[b];
      let valid = bullet.move(opponent, playerWidth, playerHeight, playerDepth);
      if(valid === -1){
        bullets.splice(b, 1);
      }else if(valid === 1 && bullet.playerFlag === true){
        scene.remove(bullet.bullet);
        bullets.splice(b, 1);
        opponentFade = true;
        socket.emit('hit');
        textLabel.changeHTML("You won!");
        textLabel.appear();
        gameOver = true;
        rematchOpen = true;
        textLabel.changeTextIn("Rematch?", 2500, () => {
          choiceLabel.appear();
        });
      }
    }

    if(opponentKeyPresses[65]){
      if(opponent.position.x < (floorWidth/2-playerWidth/2)){
        opponent.position.x+=0.05;
      }
    }
    if(opponentKeyPresses[68]){
      if(opponent.position.x > -(floorWidth/2-playerWidth/2)){
        opponent.position.x-=0.05;
      }
    }
    if(opponentKeyPresses[83]){
      if(opponent.position.y > -2){
        opponent.position.y-=0.05;
      }
    }
    if(opponentKeyPresses[87]){
      // if(opponent.position.x > -(floorWidth/2-playerWidth/2)){
      if(opponent.position.y < 1.2){
        opponent.position.y+=0.05;
      }
    }

    if(keyPresses[65]){
      if(player.position.x > -(floorWidth/2-playerWidth/2)){
        player.position.x-=0.05;
      }
    }
    if(keyPresses[68]){
      if(player.position.x < (floorWidth/2-playerWidth/2)){
        player.position.x+=0.05;
      }
    }
    if(keyPresses[83]){
      if(player.position.y > -2){
        player.position.y-=0.05;
      }
    }
    if(keyPresses[87]){
      if(player.position.y < 1.2){
        player.position.y+=0.05;
      }
    }
    if(keyPresses[32] && !shot && !gameOver){
      // bullets.push(new Bullet(...player.position.toArray(), scene, floorDepth, true));
      shot = true;
      socket.emit('shot', player.position.toArray());
    }

    renderer.render( scene, camera );
  };

  animate();
  function onDocumentKeyDown(event) {
      if(connected && matched){
        let keyCode = event.which;
        keyPresses[event.which] = true;
        if(keyCode === 65 || keyCode === 68 || keyCode === 83 || keyCode === 87){
          socket.emit('keyDown', keyCode);
        }
      }
  };
  function onDocumentKeyUp(event) {
      if(connected && matched){
        let keyCode = event.which;
        keyPresses[event.which] = false;
        if(keyCode === 32){
          shot = false;
        }else if(keyCode === 65 || keyCode === 68 || keyCode === 83 || keyCode === 87){
          socket.emit('keyUp', {keyCode: keyCode, pos: {x: player.position.x, y: player.position.y}});
        }
      }
  };

  window.addEventListener("keydown", function(e) {
      // space and arrow keysd
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
  }, false);

  document.addEventListener("keydown", onDocumentKeyDown, false);
  document.addEventListener("keyup", onDocumentKeyUp, false);
  $(".choice").click(function(){
    if(rematchOpen === true){
      //Rematch?
      if($(this).index() === 0){ //User clicked "yes"
        socket.emit("rematch", true);
      }else{ //User clicked no
        socket.emit("rematch", false);
        rematchOpen = false;
      }
    }else if(newGameOption === true){
      //New Game?
      if($(this).index() === 0){ //User clicked "yes"
        rematchLabel.disappear();
        textLabel.changeText("Connecting...", function(){
          socket.emit('ready', name);
          matched = false;
          init();
          initiateConnection(3);
        });
        choiceLabel.disappear();
      }else{ //User clicked no
        alert("Goodbye!");
        document.write("");
      }
    }
  })
});
