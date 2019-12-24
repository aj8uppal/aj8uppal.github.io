var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//SETUP
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(3010, function(){
  console.log('listening on *:3010');
});

//APP
let LOOP_RATE = 60; //per second

let users = {};
let usersWaiting = [];
let names = {};
let callQueue = [];

let getFirstAvailableUser = (users, id) => {
  let match = Object.entries(users).find(ele => ele[0] != id && ele[1] === -1);
  return match ? match[0] : match;
}

io.on('connection', function(socket){
  users[socket.id] = -1;
  socket.emit('connected')
  socket.on('disconnect', function(){
    if((opponentId = users[socket.id]) !== -1){
      io.to(opponentId).emit('opponentDC');
    }else{
      usersWaiting.splice(usersWaiting.indexOf(socket.id), 1); //if this throws an error, it means the disconnecting user was neither in the queue nor was it matched...
    }
    delete users[socket.id];
    console.log(`${socket.id} has left.`)
  });
  socket.on('ready', function(name){
    names[socket.id] = name;
    let match;
    // assert(usersWaiting.length < 2);
    if(usersWaiting.length > 0){
      match = usersWaiting[0];
      usersWaiting.splice(0, 1);
    }else{
      match = getFirstAvailableUser(users, socket.id);
    }
    if(match === undefined){
      usersWaiting.push(socket.id)
      console.log(`${socket.id} could not find match. Retrying...`);
    }else{
      users[match] = socket.id;
      users[socket.id] = match;
      socket.emit('matched', {id: match, name: names[match]});
      io.to(match).emit('matched', {id: socket.id, name: names[socket.id]});
      console.log(`Matched ${socket.id} to ${match} and vice-versa`);
    }
  });
  socket.on('keyDown', function(keyCode){
    callQueue.push({id: users[socket.id], event: 'opponentKeyDown', params: keyCode});
    callQueue.push({id: socket.id, event: 'playerKeyDown', params: keyCode});
    // io.to(users[socket.id]).emit('opponentKeyDown', keyCode);
  });
  socket.on('keyUp', function(keyCode){
    callQueue.push({id: users[socket.id], event: 'opponentKeyUp', params: keyCode});
    callQueue.push({id: socket.id, event: 'playerKeyUp', params: keyCode});
    // io.to(users[socket.id]).emit('opponentKeyUp', keyCode);
  });
  socket.on('shot', function(){
    callQueue.push({id: users[socket.id], event: 'opponentShot'});
    callQueue.push({id: socket.id, event: 'playerShot'});
    console.log('shot');
  });
  socket.on('hit', function(){
    callQueue.push({id: users[socket.id], event: 'lost'});
  })
});

let loop = () => {
  while(callQueue.length > 0){
    let call = callQueue[0];
    io.to(call.id).emit(call.event, call.params);
    callQueue.splice(0, 1);
  }
}

let loopTimer = setInterval(loop, 1000/LOOP_RATE);
