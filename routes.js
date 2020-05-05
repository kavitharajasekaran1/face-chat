var Schema = require('./schema');
var randomize = require('randomatic');
var persondetails = Schema.PersonDetails;
let express = require('express');
let app = express();
const cron = require("node-cron");
let server = require('http').Server(app);
var nodemailer = require('nodemailer');

let io = require('socket.io')(server);
var schedule = require('node-schedule');



module.exports= router =>{
    router.post('/signup', async (req, res) => {

        var data = req.body;
        let randomno = randomize('0', 12)
        let url = data.url+"/"+"?"+randomno
        console.log(url,"url+++++++++++++++")
        console.log(data,"dat for signup=====>>>>")
        const person_details = new Schema.PersonDetails({
            firstname: data.firstname,
            lastname:data.lastname,
            email: data.email,
            mobileNo: data.phoneno,
            password: data.password,
            groupname: data.groupname,
            meetingID :randomno,
            url : url
        })
        person_details.save().then(() => {
            res.send({
                'result': "All the details are saved successfully",
                
            });
        });

    })
    router.post('/signin', async (req, res) => {
        console.log(req.body,"singin")
        let email = req.body.email 
        let password = req.body.password + "";
        persondetails.findOne({ 'email': email, 'password': password }, function (error, data) {
            console.log(data,"data=====>>>")
            if (data == null){
                res.send({result:"Incorrect user name or password"});
            }
            else if(data.email == email && data.password == password){
                res.send({ result:data
            })
            
            }
        });
    });

    router.post('/startmeeting', async (req, res) => {
        console.log(req.body,"singin")
        let roomlink = req.body.roomlink 
        let id= req.body.id;
        persondetails.updateOne({"_id":id},{$set:{"url":roomlink,"signin":true}}, function (error, data) {
            console.log(data,"data=====>>>")

            res.send({ result:"success"})
         
        });
    });
    router.post('/signincheck', async (req, res) => {
        var url = req.body.url;
        var meetingid = req.body.meetingid
        if(url){
        console.log('"' + req.body.url+ '"',"singinchecking")
        let url1 =  req.body.url; 
        persondetails.findOne({ '_id':url1},  async function (error, data) {
           if(error){
               console.log(error)
           }
            // console.log(data,"data=+++====>>>")
            if (data == null){
                res.send({result:"Something went wrong"});
            }
            else {
                res.send({ result:data.signin
            })
            
            }
        });
    }
    else{
        let url1 =  req.body.meetingid; 
        persondetails.findOne({ 'meetingID':url1},  async function (error, data) {
           if(error){
               console.log(error)
           }
            // console.log(data,"data=+++====>>>")
            if (data == null){
                res.send({result:"Something went wrong"});
            }
            else {
                res.send({ result:data.signin
            })
            
            }
        });

    }
    });
    router.post('/endmeeting', async (req, res) => {
        console.log(req.body,"endmeeting request")
        var mongoid = req.body.id;
        var meetingid = req.body.meetingid
        if(mongoid){
        let mongoid =  req.body.id; 
        console.log(mongoid)
        persondetails.updateOne({"_id":mongoid},{$set:{"signin":false}}, function (error, data) {
            console.log(data,"data=====>>>")

            res.send({ result:"success"})
         
        });
    }
    else{
        
        persondetails.updateOne({"meetingID":meetingid},{$set:{"signin":false}}, function (error, data) {
            console.log(data,"data=====>>>")

            res.send({ result:"success"})
         
        });

    }
    });

    router.post('/joinmeeting', async (req, res) => {
        console.log(req.body,"joinmeeting")
        let meetingID = req.body.meetingID 
        persondetails.findOne({ 'meetingID':meetingID }, function (error, data) {
            console.log(data,"data=====>>>")
            if (data == null){
                res.send({result:"Incorrect meetingID"});
            }
            else {
                res.send({ result:data
            })
            
            }
        });
    });
    router.post('/meetingstarted', async (req, res) => {
        let meetingid =  req.body.meetingID; 
        // console.log(mongoid)
        persondetails.updateOne({"meetingID":meetingid},{$set:{"signin":true}}, function (error, data) {
            console.log(data,"data=====>>>")

            res.send({ result:"success"})
         
        });
    });
    router.post('/schedule', async (req, res) => {
        console.log(req.body)
       let date = req.body.date;
       let time = req.body.time;
       var firstname = req.body.name;
       let meetingID = req.body.meetingid;
       let url = req.body.url;
       let split = date.split("-")
let year = split[0];
let date1 = split[1];
let day = split[2]

let split1 = time.split(":")
let hour = split1[0]
let minute = split1[1];

let totalminutes =Number(hour) *60 + Number(minute)
console.log(totalminutes)
lessten = totalminutes -10;
console.log(lessten)
function time_convert(num)
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  console.log(minutes.toString())
  if(minutes.toString().length ==1){
    minutes = minutes +"0"
  }
  return hours + ":" + minutes;         
}
let final_time = time_convert(lessten)
let split3 = final_time.split(":")
let final_hour = split3[0]
let final_minute = split3[1]
console.log(Number(year))
console.log(Number(day))
console.log(Number(final_hour))
console.log(Number(final_minute))




       var email = "k@mailinator.com"

      
       
           console.log("will execute")
           var data = new Date(Number(year), Number(date1)-1, Number(day), Number(final_hour) ,Number(final_minute), 0);
              console.log(data,"final")
    //   var date = new Date(2020, 4, 5, 13 ,53, 0);
    var j = schedule.scheduleJob(data, function(){
      

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "sanedspsaservices@gmail.com",
                pass: "mnrdmpshtcbndtdj"
            }
          
          });
          var mailOptions = {
            from: 'kavithasek@yahoo.co.in',
            to: "k@mailinator.com",
            subject: 'Advance Directive of ',
            // html:'<button style="font-weight: bold;color:white; font-size:14px;font-family: sans-serif" class="btn" onclick="dashboardCode()">LOG IN </button>' ,
        
            html:'<p>Hello</br>'+firstname+'</p>\n\n<p> please click the link to </p>' ,
         generateTextFromHtml: true,
          }
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    
    
    
        console.log('The world is going to end today.');

    });
    
    res.send({ result:"success"})
    
    })
         
       





}