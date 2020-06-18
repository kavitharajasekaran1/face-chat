let express = require('express');
let app = express();
let server = require('http').Server(app);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cron = require("node-cron");
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');




let io = require('socket.io')(server);
const cors = require('cors');
const db = require('./db');

const router = express.Router();
require('./routes')(router);
app.use('/', router);


let stream = require('./src/stream');

let path = require('path');
var port = process.env.PORT || 8080;

app.use('/assets', express.static(path.join(__dirname, '/src/assets')));

app.get('/joinmeeting.html', function (req, res) {
  res.sendFile(path.join(__dirname+'/src/joinmeeting.html'));
})

app.get('/singup.html', function (req, res) {
    res.sendFile(path.join(__dirname+'/src/singup.html'));
  })
  // app.get('/userpage1.html', function (req, res) {
  //   res.sendFile(path.join(__dirname+'/src/userpage1.html'));
  // })
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/src/userpage.html'));
  })
  app.get('/schedule.html', function (req, res) {
    res.sendFile(path.join(__dirname+'/src/schedule.html'));
  })


app.get('/index.html', function(req,res) {
    res.sendFile(path.join(__dirname+'/src/index.html'));
    });

    app.get('/navbar.html', function(req,res) {
      res.sendFile(path.join(__dirname+'/src/navbar.html'));
      });

io.of('/stream').on('connection', stream);

// var count = 0;


var $ipsConnected = [];



io.on('connection', function (socket) {
  let count = Object.keys(io.sockets.sockets).length;
  console.log(count,"real count")



//   var $ipAddress = socket.handshake.address;

//   if (!$ipsConnected.hasOwnProperty($ipAddress)) {

//   	$ipsConnected[$ipAddress] = 1;

//   	count++;

  socket.emit('counter', {count:count});





console.log("client is connected");
 /* Disconnect socket */

 socket.on('disconnect', function() {

  // if ($ipsConnected.hasOwnProperty($ipAddress)) {
  let count = Object.keys(io.sockets.sockets).length;


    count--;

    socket.emit('counter', {count:count});

  //}

});
socket.on('username1', function(username) {
    console.log("+++++++++++++++++++++++++++username+++++++++++++++++++++++++++++++")
    socket.username = username;
    // socket.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    // if(socket.username !=undefined){
    // io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    io.emit('is_online',{name:socket.username,status:"join"})

    console.log(socket.username,"username in server")
   // }

});
socket.on('disconnect', function(username) {
    if(socket.username !=undefined){
        console.log("uuuuuuu")
    // io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    io.emit('is_online',{name:socket.username,status:"left"})
    }
})
socket.on('roomlink',function(data){
  console.log(data,"roomlink=====>>>>")
  app.get(JSON.stringify(data), function (req, res) {
    res.sendFile(path.join(__dirname+'/src/userpage.html'));
  })

})
socket.on('endmeeting',function(data){
  console.log(data,"endmeeting")
  socket.broadcast.emit('endmeeting',data)
})

//====================================testing==================================================//





})

server.listen(port, () => console.log(`Active on ${port} port`));