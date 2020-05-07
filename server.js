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
var port = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, '/src/assets')));

app.get('/joinmeeting.html', function (req, res) {
  res.sendFile(path.join(__dirname+'/src/joinmeeting.html'));
})

app.get('/singup.html', function (req, res) {
    res.sendFile(path.join(__dirname+'/src/singup.html'));
  })
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

  
  // cron.schedule("* * * * *", function() {


  //       socket.emit("cron","meeting started")

    
  //   console.log("running a task every minute");
  
//})



// router.post('/schedule', async (req, res) => {

// //       console.log("kkkkkkk")

// //   var date = new Date(2020, 4, 5, 22 ,20, 40);
  
// //   var j = schedule.scheduleJob(date, function(){
      
// //       socket.emit("cron",date)
// //       console.log("wonerfulll")

  
// // })
// //   res.send({ result:"success"})


// console.log(req.body)
// let date = req.body.date;
// let time = req.body.time;
// var firstname = req.body.name;
// var email = req.body.email
// let meetingID = req.body.meetingid;
// let url = req.body.url;
// let split = date.split("-")
// let year = split[0];
// let date1 = split[1];
// let day = split[2]

// let split1 = time.split(":")
// let hour = split1[0]
// let minute = split1[1];

// let totalminutes =Number(hour) *60 + Number(minute)
// console.log(totalminutes)
// lessten = totalminutes -10;
// console.log(lessten)
// function time_convert(num)
// { 
// var hours = Math.floor(num / 60);  
// var minutes = num % 60;
// console.log(minutes.toString())
// if(minutes.toString().length ==1){
  
// minutes = "0"+minutes 
// }
// return hours + ":" + minutes;         
// }
// var final_time = time_convert(lessten)
// console.log(final_time,"finaltime++++++++++++++++")
// let split3 = final_time.split(":")
// let final_hour = split3[0]
// let final_minute = split3[1]
// console.log(Number(year))
// console.log(Number(day))
// console.log(Number(final_hour))
// console.log(Number(final_minute))




// // var email = "k@mailinator.com"



//     console.log("will execute")
//     var data = new Date(Number(year), Number(date1)-1, Number(day), Number(final_hour) ,Number(final_minute), 0);
//        console.log(data,"final")
// //   var date = new Date(2020, 4, 5, 13 ,53, 0);
// var j = schedule.scheduleJob(data, async function(){
//   obj ={
//     email:email,
//     time : final_time


//   }
//   console.log(obj,"obj======")
 

//   io.emit("cron",obj)
//          console.log("wonerfulll")


//  var transporter = nodemailer.createTransport({
//      host: 'smtp.gmail.com',
//      port: 587,
//      secure: false,
//      auth: {
//          user: "sanedspsaservices@gmail.com",
//          pass: "mnrdmpshtcbndtdj"
//      }
   
//    });
//    var mailOptions = {
//      from: 'kavithasek@yahoo.co.in',
//      to: "k@mailinator.com",
//      subject: 'Advance Directive of ',
//      // html:'<button style="font-weight: bold;color:white; font-size:14px;font-family: sans-serif" class="btn" onclick="dashboardCode()">LOG IN </button>' ,
 
//      html:'<p>Hello</br>'+firstname+'</p>\n\n<p> please click the link to </p>' ,
//   generateTextFromHtml: true,
//    }
//    transporter.sendMail(mailOptions, function(error, info){
//      if (error) {
//        console.log(error);
//      } else {
//        console.log('Email sent: ' + info.response);
//      }
//    });



//  console.log('The world is going to end today.');

// });

// res.send({ result:"success"})





//  })
   
 


    let count = Object.keys(io.sockets.sockets).length;
    console.log(count,"real count")

  

  	socket.emit('counter', {count:count});

  



  console.log("client is connected");
   /* Disconnect socket */

   socket.on('disconnect', function() {
    // if ($ipsConnected.hasOwnProperty($ipAddress)) {
    let count = Object.keys(io.sockets.sockets).length;



      count--;
      console.log(count,"discount++++++++")


      socket.emit('counter', {count:count});

    //}

});

socket.on('username1', function(username) {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    socket.username = username;
    // socket.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    if(socket.username !=undefined){
    io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    console.log(socket.username,"username in server")
    }

});
socket.on('disconnect', function(username) {
    if(socket.username !=undefined){
        console.log("uuuuuuu")
    io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    }
})
socket.on('roomlink',function(data){
  console.log(data,"roomlink=====>>>>")
  app.get(JSON.stringify(data), function (req, res) {
    res.sendFile(path.join(__dirname+'/src/userpage.html'));
  })

})

//====================================testing==================================================//





})

server.listen(port, () => console.log(`Active on ${port} port`));