$(document).ready(function(){
  // var xPos = null;
  // var yPos = null;
  // window.addEventListener( "touchmove", function ( event ) {
  //     var touch = event.originalEvent.touches[ 0 ];
  //     oldX = xPos;
  //     oldY = yPos;
  //     xPos = touch.pageX;
  //     yPos = touch.pageY;
  //     if ( oldX == null && oldY == null ) {
  //         return false;
  //     }
  //     else {
  //         if ( Math.abs( oldX-xPos ) > Math.abs( oldY-yPos ) ) {
  //             event.preventDefault();
  //             return false;
  //         }
  //     }
  // } );
  // document.addEventListener('touchstart', function(e) {e.preventDefault()}, false);
  // document.addEventListener('touchmove', function(e) {e.preventDefault()}, false);

  let socket = io('ws://ccdb5e92.ngrok.io');
  let canvas = $("#canvas")[0];
  let ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let circleRadius = 15;
  let mouseX = canvas.width/2-circleRadius/2;
  let mouseY = canvas.height/2-circleRadius/2;
  let player = {x: mouseX, y: mouseY, targetX: mouseX, targetY: mouseY, radius: circleRadius, color: "navy"};
  let speed = 10;
  let fps = 30;

  let BOARD_WIDTH = 10000;
  let BOARD_HEIGHT = 7500;

  let offset = {x: 1000, y: 1000};

  let circles = [];

  let id = '';

  let main = () => {
    requestAnimationFrame(main);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(let c = 0; c < circles.length; ++c){
        let circle = circles[c];
        dX = circle.targetX - circle.x;
        dY = circle.targetY - circle.y;
        if(dX === 0){
          if(Math.abs(dY) > speed){
            circle.y+=dY > 0 ? speed : -speed;
          }
        }else if(dX**2 + dY**2 > speed*2){
          theta = Math.atan2(dY, dX);
          circle.x+=speed*Math.cos(theta)
          circle.y+=speed*Math.sin(theta)
        }else{
          circle.x = circle.targetX;
          circle.y = circle.targetY;
        }
        drawCircle(circle);
      }
      dX = player.targetX - player.x;
      dY = player.targetY - player.y;
      if(dX === 0){
        if(Math.abs(dY) > speed){
          player.y+=dY > 0 ? speed : -speed;
        }
      }else if(dX**2 + dY**2 > speed*2){
        theta = Math.atan2(dY, dX);
        player.x+=speed*Math.cos(theta)
        player.y+=speed*Math.sin(theta)
      }else{
        player.x = player.targetX;
        player.y = player.targetY;
      }
      // player.x = mouseX;
      // player.y = mouseY;
      drawCircle(player);
    }
  }
  let drawCircle = (circle) => {
    ctx.fillStyle = circle.color || "red";
    ctx.beginPath();
    ctx.arc(circle.x-circle.radius/2, circle.y-circle.radius/2, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  $("#canvas").mousemove(function(e){
    player.targetX = e.clientX+player.radius/2;
    player.targetY = e.clientY+player.radius/2;
    socket.emit('updateClientCoords', {targetX: player.targetX, targetY: player.targetY})
  });
  // alert("connecting 2222...");
  socket.on('info', function(data){
    id = data.id;
    circles = Object.values(data.users);
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    main();
  });

  socket.on('newUser', function(user){
    circles.push(user)
  })

  socket.on('userLeft', function(id){
    circles.forEach((circle, index)=>{
      if(circle.id === id){
        circles.splice(index, 1);
      }
    })
  })

  socket.on('userMoved', function(user){
    circles.forEach((circle)=>{
      if(circle.id === user.id){
        circle.targetX = user.targetX;
        circle.targetY = user.targetY;
      }
    })
  });

});
