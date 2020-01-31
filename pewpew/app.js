const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3010;

//SETUP
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});

//APP

let users = {};
let usersWaiting = [];
let names = {};
let acceptedRematch = [];
let deniedRematch = [];

let getFirstAvailableUser = (users, id, flagid) => {
  let match = Object.entries(users).find(ele => ele[0] != id && ele[0] != flagid && ele[1] === -1);
  return match ? match[0] : match;
}

io.on('connection', function(socket){
  users[socket.id] = -1;
  socket.emit('connected')
  socket.on('disconnect', function(){
    if((opponentId = users[socket.id]) !== -1){
      io.to(opponentId).emit('opponentDC');
      delete users[opponentId];
      users[socket.id] = -1;
    }else{
      usersWaiting.splice(usersWaiting.indexOf(socket.id), 1); //if this throws an error, it means the disconnecting user was neither in the queue nor was it matched...
    }
    delete users[socket.id];
    console.log(`${socket.id} has left.`)
  });
  socket.on('ready', function(name){
    let oID;
    names[socket.id] = name;
    if(Object.values(users).indexOf(socket.id) !== -1){
      oID = users[socket.id];
    }
    // let match;
    // assert(usersWaiting.length < 2);
    // if(usersWaiting.length > 0){
    //   match = usersWaiting[0];
    //   usersWaiting.splice(0, 1);
    // }else{
    //   match = getFirstAvailableUser(users, socket.id, oID);
    // }
    let match;
    if((newOppIndex = usersWaiting.findIndex(i => i !== oID && i !== socket.id)) !== -1){
      // console.log(newOppIndex);
      match = usersWaiting[newOppIndex];
      usersWaiting.splice(newOppIndex, 1);
      console.log(`Matched ${socket.id} to ${match} and vice-versa. Removed ${match} from queue. Queue is now ${usersWaiting.length} long. There are ${Object.values(users).length} users online.`);
    }else{
      match = getFirstAvailableUser(users, socket.id, oID);
    }
    // let match = usersWaiting.find(i => i !== oID) ||
    if(match === undefined){
      if(usersWaiting.indexOf(socket.id) === -1){
        console.log(`Adding ${socket.id} to match queue...`);
        usersWaiting.push(socket.id)
      }
      // console.log(`${socket.id} could not find match. Retrying...`);
    }else{
      users[match] = socket.id;
      users[socket.id] = match;
      socket.emit('matched', {id: match, name: names[match]});
      io.to(match).emit('matched', {id: socket.id, name: names[socket.id]});
    }
  });
  socket.on('keyDown', function(keyCode){
    io.to(users[socket.id]).emit('opponentKeyDown', keyCode);
  });
  socket.on('keyUp', function(data){
    io.to(users[socket.id]).emit('opponentKeyUp', data);
  });
  socket.on('shot', function(pos){
    socket.emit('playerShot', pos);
    io.to(users[socket.id]).emit('opponentShot', pos);
  });
  socket.on('hit', function(){
    io.to(users[socket.id]).emit('lost');
  });
  socket.on('usersOnline', function(){
    socket.emit('usersOnline', [usersWaiting.length, Object.values(users).length]);
  });
  socket.on('rematch', function(flag){
    if(accepted = acceptedRematch.indexOf(users[socket.id]) > -1){ //opponent wants rematch
      io.to(users[socket.id]).emit('rematch', flag);
      socket.emit('rematch', flag);
      if(flag){
        acceptedRematch.splice(accepted, 1);
        return;
      }else{
        users[users[socket.id]] = -1;
        delete users[socket.id];
      }
    }else if(denied = deniedRematch.indexOf(users[socket.id]) > -1 && accepted === -1){ //opponent does not want rematch
      deniedRematch.splice(denied, 1);
      socket.emit('rematch', false);
      delete users[users[socket.id]];
      if(flag){
        users[socket.id] = -1;
      }else{
        delete users[socket.id];
      }
      return;
    }else{
      io.to(users[socket.id]).emit('acceptedRematch', flag); //opponnet has not responded
    }
    if(flag){
      acceptedRematch.push(socket.id);
    }else{
      deniedRematch.push(socket.id);
    }
  });
});
let updateUserCount = () => {
  for(let i in users){
    io.to(i).emit('usersOnline', [usersWaiting.length, Object.values(users).length]);
  }
  setTimeout(updateUserCount, 2500);
}
updateUserCount();
