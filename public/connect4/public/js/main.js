$(function(){
  let id = -1;
  let gameOver = false;
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    ip = data.split("ip=")[1].split("\n")[0];
    $.get("http://ec2-3-19-227-224.us-east-2.compute.amazonaws.com:8000/api/visit", {
      ip: ip
    }, (data)=>{
      id = parseInt(JSON.parse(data));
      // alert(id);
    });
  });
  let curPlayer = 1 //1: p1, 2: p2
  let board = Array.apply(null, Array(7)).map(_ => Array(0))
  let hoverCol = -1;
  $(".column").on("mousemove", function(e){
    let offsetX = $(this).offset().left;
    let offsetY = $(this).offset().top;
    $(".hovertoken").css({"left": `calc(${offsetX}px + 1vmax)`, "top": `calc(${offsetY}px - 2.5vmax)`, "display": "block"});
    // debugger;
    hoverCol = $(this).index(".column");
  })
  function move(col){
    board[col].push(curPlayer);
    let newToken = $(".hovertoken").clone().removeClass("hovertoken");

    newToken.css("left", `calc(${$($(".column")[col]).offset().left}px + 1vmax)`)
    $(".board").prepend(newToken);
    setTimeout(function(){
      newToken.css("transform", `translateY(${45.5-board[col].length*7}vmax)`);
    }, 75);
    $(".hovertoken").removeClass(`p${curPlayer}`);
    curPlayer = curPlayer == 2 ? 1 : 2;
    $(".hovertoken").addClass(`p${curPlayer}`);
  }
  $(".column").on("click", function(e){
    // console.log(board[hoverCol-1]);
    // console.log(hoverCol);
    if(gameOver || board[hoverCol].length == 6){
      return;
    }
    if(curPlayer == 1){
      move(hoverCol);
      $.get("http://ec2-3-19-227-224.us-east-2.compute.amazonaws.com:8000/api/move", {col: hoverCol, id: id}, (data) => {
        console.log(data);
        data = JSON.parse(data);
        if(data.length){
          if(data[0] == "computerwin"){
            move(parseInt(data[1]));
            setTimeout(function(){
              alert("Computer won!")
            }, 1500);
          }else{
            setTimeout(function(){
              alert("Player won!")
            }, 1500);
          }
          gameOver = true;
        }else{
          move(parseInt(JSON.parse(data)));
        }
      })
    }
  })
});
