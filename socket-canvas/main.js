$(document).ready(function(){
  let canvas = $("#canvas")[0];
  let ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let circleRadius = 15;
  let player = {x: canvas.width/2-circleRadius/2, y: canvas.height/2-circleRadius/2, radius: circleRadius, color: "green"};

  let circles = [];

  let main = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let c = 0; c < circles.length; ++c){
      let circle = circles[c];
      drawCircle(circle);
    }
    player.x = 
    drawCircle(player);
    window.requestAnimationFrame(main);
  }
  let drawCircle = (circle) => {
    ctx.fillStyle = circle.color;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  $("#canvas").mousemove(function(e){

  });

  main();
});
