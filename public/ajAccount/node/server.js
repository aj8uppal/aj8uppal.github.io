var config = require('./config');
var app = require('http').createServer();
var https = require('https');
var io = require('socket.io')(app);
var fs = require('fs');
var crypto = require('crypto');
var assert = require('assert');
var path = require('path');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var text = 'I love kittens';

/*var cipher = crypto.createCipher(algorithm, key);  
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
var decipher = crypto.createDecipher(algorithm, key);
var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

assert.equal(decrypted, text);*/
var options = {
    key: fs.readFileSync('/etc/apache2/ssl/server.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};
//var app = https.createServer(options);
app.listen(config.serverPort);
var userData = {};
console.log("Starting server on port " + config.serverPort);

io.on('connection', function(socket) {

  socket.on('signup', function(data) {
    var username = data.username;
    console.log(data.username);
    var passwd = data.password;
    var email = data.email;
    var firstname = data.firstname;
    var lastname = data.lastname;
    var cipher = crypto.createCipher(algorithm, passwd);
    var encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');
    fs.writeFile("../users/"+username+".txt", encrypted, function(err) {
	if(err) {
		return console.log(err);
	}
	socket.emit("signupsuccess");
    });
//    console.log(encrypted);
  });
  socket.on('requestData', function(){
	socket.emit('sendData', userData);
	});
  socket.on('logout', function(){
	userData = {};
  });
  socket.on('signin', function(data) {
    var username = data.username;
    console.log(data.username+" "+ __dirname+"/"+'../users/'+username+'.txt');
    var passwd = data.password;
    var filePath = path.join(__dirname, '../users/'+username+'.txt');
    fs.readFile("../users/"+username+".txt", {encoding: 'utf-8'}, function(err,datum){
    if (!err){
    	console.log(datum)
    	var decipher = crypto.createDecipher(algorithm, passwd);
    	try{
		socket.emit("successlogin", {});
		var decrypted = decipher.update(datum, 'hex', 'utf8') + decipher.final('utf8');
		console.log(decrypted);
		userData = JSON.parse(decrypted);
		console.log(userData);
    	}catch(ex){
		socket.emit("failedlogin", {"username": username})
	}
    }else{
	socket.emit("failedlogin", {"username": username});
        console.log(err);
    }

    });
  });


});
