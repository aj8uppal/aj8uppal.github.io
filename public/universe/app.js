const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 6355;

//SETUP
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});

io.on('connection', function(socket){
  console.log(`${socket.id} connected!`);
  socket.on('disconnect', function(){
    console.log(`${socket.id} disconnected!`);
  })
})
