const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express()
const port = 3000

const stream = fs.createWriteStream("contact.csv", {flags: 'a'});

//const contactFile = "contact.csv";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//app.use(express.json());

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.post('/', function (req, res) {
//  console.log(req.body);
  stream.write(`${req.body._replyto} says ${req.body.message}\n`);
//  fs.appendFileSync(contactFile, `${req.body._replyto} says ${req.body.message}\n`);
  res.send({ msg: JSON.stringify({response:'Thank you!'}) });
//  res.send('Got a POST request')
})

app.listen(port, () => console.log(`Contact form listening on port ${port}.`))

//
// stream.once('open', function(fd) {
//   stream.write("My first row\n");
//   stream.write("My second row\n");
//   stream.end();
// });
