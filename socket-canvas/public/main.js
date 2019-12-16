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
  document.addEventListener('touchstart', function(e) {e.preventDefault()}, false);
  document.addEventListener('touchmove', function(e) {e.preventDefault()}, false);

  let socket = io('ws://ccdb5e92.ngrok.io');
  let canvas = $("#canvas")[0];
  let ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let circleRadius = 15;
  let mouseX = canvas.width/2-circleRadius/2;
  let mouseY = canvas.height/2-circleRadius/2;
  let player = {x: mouseX, y: mouseY, radius: circleRadius, color: "navy"};

  let circles = [];

  let id = '';

  let main = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let c = 0; c < circles.length; ++c){
      let circle = circles[c];
      drawCircle(circle);
    }
    player.x = mouseX;
    player.y = mouseY;
    drawCircle(player);
    window.requestAnimationFrame(main);
  }
  let drawCircle = (circle) => {
    ctx.fillStyle = circle.color || "red";
    ctx.beginPath();
    ctx.arc(circle.x-circle.radius/2, circle.y-circle.radius/2, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  $("#canvas").mousemove(function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    socket.emit('updateClientCoords', {x: mouseX, y: mouseY})
  });
  alert("connecting...");
  socket.on('info', function(data){
    id = data.id;
    circles = Object.values(data.users);
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
        circle.x = user.x;
        circle.y = user.y;
      }
    })
  });

});
