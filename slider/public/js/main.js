$(function() {
  let coords = {};
  let scale = 9;
  let offset = 0.75
  let x;
  let y;
  let borderWidth = 0.15;
  let blankX;
  let blankY;
  let solving = false;
  let randomStates = [];
  let ip;
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    ip = data.split("ip=")[1].split("\n")[0];
    $.get("http://ec2-3-19-227-224.us-east-2.compute.amazonaws.com:5000/api/visit", {
      ip: ip
    }, (data)=>{
    });
  });

  let draw = ()=>{
    $(".number").each((i,ele)=>{
      let ticker = $(ele).find("span").html();
      x = coords[ticker][0];
      y = coords[ticker][1];
      $(ele).css({
        "top": (y + 1) * offset + (y * scale) - borderWidth + "vmin",
        "left": (x + 1) * offset + (x * scale) - borderWidth + "vmin"
      })
      if (ticker == "0") {
        blankX = x;
        blankY = y;
      }
    }
  );
}
let process = ()=>{
  $(".number").each((i,ele)=>{
    x = i % 3;
    y = Math.floor(i / 3);
    coords[$(ele).find("span").html()] = [x, y];
  }
);
}
process();
draw();

$(".number").click(function(e) {
  let ticker = $(this).find("span").html()
  blankX = coords["0"][0];
  blankY = coords["0"][1];
  let delta_x = blankX - coords[ticker][0];
  let delta_y = blankY - coords[ticker][1];
  let dir = "not valid";
  if (delta_x == 1 && delta_y == 0) {
    dir = "right";
  } else if (delta_x == -1 && delta_y == 0) {
    dir = "left";
  } else if (delta_x == 0 && delta_y == -1) {
    dir = "up";
  } else if (delta_x == 0 && delta_y == 1) {
    dir = "down";
  } else {
    return;
  }
  slide(dir)
})
let slide = (dir,delay)=>{
  let tempX = coords["0"][0];
  let tempY = coords["0"][1];
  let x = tempX;
  let y = tempY;
  if (dir == "left") {
    x = tempX + 1;
  } else if (dir == "right") {
    x = tempX - 1;
  } else if (dir == "up") {
    y = tempY + 1;
  } else if (dir == "down") {
    y = tempY - 1;
  }
  ticker = Object.entries(coords).find(i=>i[1].toString() == [x, y].toString())[0];
  coords["0"][0] = x;
  coords["0"][1] = y;
  coords[ticker][0] = tempX;
  coords[ticker][1] = tempY;
  draw();
  if (getState(coords) == "123456780") {

    if (solving == true) {
      solving = false;
    }

    let btn = $($("button")[0])
    setTimeout(function() {
      if(btn.html() == "Solving..."){
        btn.html("Solved.");
        btn.removeClass("disabled");
        btn.css({
          cursor: "pointer"
        })
      }
      $(".number").css({
        background: "#4caf50"
      });
      $(".number").css({
        border: "0.11vw solid #4caf50"
      });
      $(".container").css({
        border: "0.15vw dashed #4caf50"
      });
      setTimeout(function() {
        btn.html("Solve");
        $(".number").css({
          transition: "all 0.5s ease"
        });
        $(".number").css({
          background: "#424242"
        });
        $(".number").css({
          border: "0.11vw solid #424242"
        });
        $(".container").css({
          border: "0.15vw dashed #424242"
        });
      }, 500);

    }, delay || 500);
    return true;
  }
}

let getState = (coords)=>{
  let arr = Object.keys(coords).map((i)=>{
    return coords[i].slice().reverse().concat(i)
  }
);
let sorted = arr.sort()
return sorted.map((i)=>i[2]).join("");
}

let solvePath = (path)=>{
  if (slide(path[0])) {
    return;
  }
  setTimeout(function() {
    solvePath(path.slice(1))
  }, 375);
}

$("input").change(function(){
  if($(this)[0].checked){
    $("table").css("opacity", "1");
  }else{
    $("table").css("opacity", "0");
  }
})

$("button").click(async function(){
  if ($(this).html()[0] == "S") {
    if (solving) {
      return;
    } else if (getState(coords) == "123456780") {
      slide("not valid", 100)
      return;
    } else {
      solving = true;
    }
    $(this).css({
      cursor: "progress"
    })
    let all = $("input")[0].checked;
    $(this).html("Solving...");
    $(this).addClass("disabled");
    $.get("http://ec2-3-19-227-224.us-east-2.compute.amazonaws.com:5000/api/path", {
      path: getState(coords),
      all: all
    }, (data)=>{
      if(!all){
        // debugger;
        $("td").html("&mdash;");
        solvePath(JSON.parse(data));
        return;
      }
      let c = 1;
      let rows = $("tr");
      let children;
      data = JSON.parse(data);
      for(let i in data){
        if(i == "path"){
          continue;
        }
        // debugger;
        children = $(rows[c++]).children("td");
        for(let j = 0; j < children.length; j++){
          // debugger;
          $(children[j]).html(data[i][j]+(j==0 ? "" : ""));
        }
      }
      solvePath(data.path);
    }
  );
} else {
  if(randomStates.length == 0){
    $(this).html("Randomizing...");
    $(this).addClass("disabled");
    $(this).css({
      cursor: "progress"
    })
    await $.get("http://ec2-3-19-227-224.us-east-2.compute.amazonaws.com:5000/api/randomize", (data)=>{
      randomStates = JSON.parse(data);
      $(this).html("Randomize");
      $(this).removeClass("disabled");
      $(this).css({
        cursor: "pointer"
      })
    });
  }
  let board = randomStates.pop();
  let counter = 0
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      coords[board[counter++]] = [x, y]
    }
  }
  draw();

}
})
});
