$(function(){
  let coords = {};
  let scale = 9;
  let offset = 0.75
  let x;
  let y;
  let borderWidth = 0.15;
  let blankX;
  let blankY;


  let draw = () => {
    $(".number").each((i, ele)=>{
      let ticker = $(ele).find("span").html();
      x = coords[ticker][0];
      y = coords[ticker][1];
      $(ele).css({"top": (y+1)*offset+(y*scale)-borderWidth+"vw", "left": (x+1)*offset+(x*scale)-borderWidth+"vw"})
      if(ticker == "9"){
        blankX = x;
        blankY = y;
      }
    });
  }

  $(".number").each((i, ele)=>{
    x = i%3;
    y = Math.floor(i/3);
    coords[$(ele).find("span").html()] = [x, y];
    // console.log(i%3+", "+Math.floor(i/3));

  });
  draw();


  $(".number").click(function(e){
    let ticker = $(this).find("span").html()
    blankX = coords["9"][0];
    blankY = coords["9"][1];
    let delta_x = blankX-coords[ticker][0];
    let delta_y = blankY-coords[ticker][1];
    let dir = "not valid";
    if(delta_x == 1 && delta_y == 0){
      dir = "right";
    }else if(delta_x == -1 && delta_y == 0){
      dir = "left";
    }else if(delta_x == 0 && delta_y == -1){
      dir = "up";
    }else if(delta_x == 0 && delta_y == 1){
      dir = "down";
    }else{
      return;
    }
    slide(dir)
  })
  let slide = (dir) => {
    let tempX = coords["9"][0];
    let tempY = coords["9"][1];
    let x = tempX;
    let y = tempY;
    if(dir == "left"){
      x = tempX+1;
    }else if(dir == "right"){
      x = tempX - 1;
    }else if(dir == "up"){
      y = tempY + 1;
    }else{
      y = tempY - 1;
    }
    ticker = Object.entries(coords).find(i=>i[1].toString() == [x, y].toString())[0];
    coords["9"][0] = x;
    coords["9"][1] = y;
    coords[ticker][0] = tempX;
    coords[ticker][1] = tempY;
    console.log(getState(coords))
    draw();
  }

  let getState = (coords) => {
    let arr = Object.keys(coords).map((i)=>{
        return coords[i].slice().reverse().concat(i)
    });
    let sorted = arr.sort()
    return sorted.map((i)=>i[2]).join("").replace("9", "0");
  }

  let solvePath = (path) => {
    if(path.length <= 0){
      alert("Solved!");
      return;
    }
    slide(path[0])
    setTimeout(function(){
      solvePath(path.slice(1))
    }, 500);
  }

  $("button").click(function(){
    $.get(
        "http://ec2-3-19-227-224.us-east-2.compute.amazonaws.com:5000/api/path",
        {path: getState(coords)},
        function(data) {
           solvePath(JSON.parse(data));
        }
    );
  })
});
