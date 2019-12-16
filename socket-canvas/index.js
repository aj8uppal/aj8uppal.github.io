var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.origins('*:*')

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

io.on('connection', function(socket){
  console.log('a user connected');
  users[socket.id] = {x: -1, y: -1, radius: 15};
  console.log(users);
  socket.emit('sendID', socket.id)
  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete users[socket.id]
    console.log(users);
  });
  socket.on('updateClientCoords', function(data){
    users[socket.id].x = data.x;
    users[socket.id].y = data.y;
  });
  setInterval(() => {
    io.emit('updateFromServer', users);
  }, 50);
});