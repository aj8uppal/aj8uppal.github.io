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

  let center = {x: canvas.width/2, y: canvas.height/2};

  let mouseX = center.x;
  let mouseY = center.y;
  let player = {x: mouseX, y: mouseY, velX: 0, velY: 0, absX: -1, absY: -1, radius: circleRadius, color: "navy"};
  let speed = 10;
  let fps = 30;

  let BOARD_WIDTH = 10000;
  let BOARD_HEIGHT = 7500;

  let offset;

  let circles = [];

  let id = '';

  let main = () => {
    requestAnimationFrame(main);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(circles.length);
      for(let c = 0; c < circles.length; ++c){
        let circle = circles[c];
        if(circle.absX < offset.x || circle.absY < offset.y || circle.absX > offset.x+canvas.width || circle.absY > offset.y+canvas.height){
          // console.log("bad");
          continue;
        }
        // debugger;
        // console.log("good");
        // circle.x = circle.absX - offset.x;
        // circle.y = circle.absY - offset.y;
        circle.x+=(circle.velX-player.velX);
        circle.y+=(circle.velY-player.velY);
        // dX = circle.targetX - circle.x;
        // dY = circle.targetY - circle.y;
        // if(dX === 0){
        //   if(Math.abs(dY) > speed){
        //     circle.y+=dY > 0 ? speed : -speed;
        //   }
        // }else if(dX**2 + dY**2 > speed*2){
        //   theta = Math.atan2(dY, dX);
        //   circle.x+=speed*Math.cos(theta)
        //   circle.y+=speed*Math.sin(theta)
        // }else{
        //   circle.x = circle.targetX;
        //   circle.y = circle.targetY;
        // }
        drawCircle(circle);
      }
      // player.x+=player.velX;
      // player.y+=player.velY;
      // dX = mouseX - player.x;
      // dY = mouseY - player.y;
      // if( (dX**2+dY**2)**0.5 < player.radius){
      //   player.velX = 0;
      //   player.velY = 0;
      //   socket.emit('updateClientCoords', {velX: player.velX, velY: player.velY, x: player.x, y: player.y})
      // }
      // player.x = mouseX;
      // player.y = mouseY;
      player.absX+=player.velX;
      player.absY+=player.velY;
      offset.x+=player.velX;
      offset.y+=player.velY;

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
    mouseX = e.clientX+player.radius/2;
    mouseY = e.clientY+player.radius/2;
    dX = mouseX - player.x;
    dY = mouseY - player.y;
    magnitude = (dX**2+dY**2)**0.5;
    magnitude = parseFloat(magnitude.toFixed(3))
    player.velX = magnitude < player.radius ? 0 : dX/150;
    player.velY = magnitude < player.radius ? 0 : dY/150;
    // if(dX === 0){
    //   if(Math.abs(dY) > speed){
    //     player.y+=dY > 0 ? speed : -speed;
    //   }
    // }else if(dX**2 + dY**2 > speed*2){
    //   theta = Math.atan2(dY, dX);
    //   player.x+=speed*Math.cos(theta)
    //   player.y+=speed*Math.sin(theta)
    // }else{
    //   player.x = player.targetX;
    //   player.y = player.targetY;
    // }
    console.log(player.absX+", "+player.absY);
    socket.emit('updateClientCoords', {velX: player.velX, velY: player.velY, absX: player.x+offset.x, absY: player.y+offset.y})
  });
  // alert("connecting 2222...");
  socket.on('info', function(data){
    id = data.id;
    circles = Object.values(data.users);
    // console.log(circles);
    // console.log(id);
    offset = {x: data.user.absX - center.x, y: data.user.absY - center.y};
    player.absX = data.user.absX;
    player.absY = data.user.absY;

    circles.forEach((circle, index)=>{
      circle.x = circle.absX - offset.x;
      circle.y = circle.absY - offset.y;
      // break;
    })
    // alert(player.absX+", "+player.absY);
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
        circle.absX = user.absX;
        circle.absY = user.absY;
        circle.velY = user.velY;
        circle.velX = user.velX;
        circle.x = circle.absX - offset.x;
        circle.y = circle.absY - offset.y;
      }
    })
  });

});
