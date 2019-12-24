var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//SETUP
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//APP

let users = {};
let BOARD_WIDTH = 100;
let BOARD_HEIGHT = 100;

io.on('connection', function(socket){
  console.log('a user connected');
  newUser = {absX: Math.round(Math.random()*BOARD_WIDTH), absY: Math.round(Math.random()*BOARD_HEIGHT), radius: 15, id: socket.id, velX: 0, velY: 0};
  socket.emit('info', {id: socket.id, users: users, user: newUser});
  users[socket.id] = newUser
  console.log(users);
  socket.broadcast.emit('newUser', users[socket.id])
  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete users[socket.id]
    console.log(users);
    socket.broadcast.emit('userLeft', socket.id);
  });
  socket.on('updateClientCoords', function(data){
    try {
      users[socket.id].velX = data.velX;
      users[socket.id].velY = data.velY;
      // console.log(data.velX+" "+data.velY);
      // if(data.velX === 0 && data.velY === 0){
        users[socket.id].absX = data.absX;
        users[socket.id].absY = data.absY;
      // }
      // users[socket.id].x = data.x;
      // users[socket.id].y = data.y;
      socket.broadcast.emit('userMoved', users[socket.id]);
    }catch(e){
      //;
    }
  });
});
