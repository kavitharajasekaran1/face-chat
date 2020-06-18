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
    router.post('/passwordchange', async (req, res) => {
        console.log(req.body,"passwordchangerequest")
        let emailid= req.body.emailid 
        let newpassword= req.body.newpassword;
        persondetails.updateOne({"email":emailid},{$set:{"password":newpassword}}, function (error, data) {
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
//     router.post('/schedule', async (req, res) => {
//         console.log(req.body)
//        let date = req.body.date;
//        let time = req.body.time;
//        var firstname = req.body.name;
//        let meetingID = req.body.meetingid;
//        let url = req.body.url;
//        let split = date.split("-")
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
//  { 
//   var hours = Math.floor(num / 60);  
//   var minutes = num % 60;
//   console.log(minutes.toString())
//   if(minutes.toString().length ==1){
//     minutes = minutes +"0"
//   }
//   return hours + ":" + minutes;         
// }
// let final_time = time_convert(lessten)
// let split3 = final_time.split(":")
// let final_hour = split3[0]
// let final_minute = split3[1]
// console.log(Number(year))
// console.log(Number(day))
// console.log(Number(final_hour))
// console.log(Number(final_minute))




//        var email = "k@mailinator.com"

      
       
//            console.log("will execute")
//            var data = new Date(Number(year), Number(date1)-1, Number(day), Number(final_hour) ,Number(final_minute), 0);
//               console.log(data,"final")
//     //   var date = new Date(2020, 4, 5, 13 ,53, 0);
//     var j = schedule.scheduleJob(data, function(){
      

//         var transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             auth: {
//                 user: "sanedspsaservices@gmail.com",
//                 pass: "mnrdmpshtcbndtdj"
//             }
          
//           });
//           var mailOptions = {
//             from: 'kavithasek@yahoo.co.in',
//             to: "k@mailinator.com",
//             subject: 'Advance Directive of ',
//             // html:'<button style="font-weight: bold;color:white; font-size:14px;font-family: sans-serif" class="btn" onclick="dashboardCode()">LOG IN </button>' ,
        
//             html:'<p>Hello</br>'+firstname+'</p>\n\n<p> please click the link to </p>' ,
//          generateTextFromHtml: true,
//           }
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('Email sent: ' + info.response);
//             }
//           });
    
    
    
//         console.log('The world is going to end today.');

//     });
    
//     res.send({ result:"success"})
    
//     })

router.post('/schedule', async (req, res) => {

    console.log(req.body)
    let url1 = "https://rapidqube-conference.herokuapp.com/index.html"
           let date = req.body.date;
           let time = req.body.time;
           var firstname = req.body.name;
           let meetingID = req.body.meetingid;
           let url = req.body.url;
           let attendeesemail = req.body.attendeesemail
           let t1 = date+" "+time;
           let meetingstarttime = new Date(t1)
           let meetingendtime = meetingstarttime
           console.log(attendeesemail,"list++++++++++")
           var emailarray =[]
           for(i=0;i<attendeesemail.length;i++){
               let obj ={
                   "email":attendeesemail[i],
                   "responseStatus": "needsAction"
                   
               }
               emailarray.push(obj)

           }

           console.log(emailarray,"emails array++++++")

    const { google } = require('googleapis')

    // Require oAuth2 from our google instance.
    const { OAuth2 } = google.auth
    
    // Create a new instance of oAuth and set our Client ID & Client Secret.
    const oAuth2Client = new OAuth2(
      '355639572642-ajaomum8e4oaplpuihm6h0mapmfpi3cm.apps.googleusercontent.com',
      '1mJQxUpwwTzWGC2TqmzGdbAq'
    )
    
    // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
    oAuth2Client.setCredentials({
      refresh_token: '1//04A_QoMx0op65CgYIARAAGAQSNwF-L9Ir0mKi7g5rJed-IESW6FbEOJP4KdlCmRv_AyaIonwK6LK_b8rztq3a9G_KV4M_zgufWmk',
    })
    
    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    
    // Create a new event start date instance for temp uses in our calendar.
    // const eventStartTime = new Date()
    // eventStartTime.setDate(eventStartTime.getDay()+3)
    // eventStartTime.setMinutes(eventStartTime.getMinutes() + 11)
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var eventStartTime = new Date(indiaTime)
    console.log(eventStartTime)
    eventStartTime.setMinutes(eventStartTime.getMinutes()+11)

    
    // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date(indiaTime)
    eventEndTime.setDate(eventEndTime.getDay() + 4)
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)
    
    // Create a dummy event for temp uses in our calendar
    const event = {
      "summary": `The demo about video conference app, hr bot`,
      "location": `Rapidqube digital solutions pvt. ltd.`,
      "description": 
      `This is the invitation about developer weekly demo`+`join the meeting
      using meeting id ${meetingID} in the url ${url1}`,
      "colorId": 1,

      "start": {
    //    "date":"2020-05-07"
    "dateTime": meetingstarttime,
    "timeZone": 'Asia/Kolkata',



       
      },
      "end": {
        "dateTime": meetingendtime,
        "timeZone": 'Asia/Kolkata',
        // "date":"2020-05-07"
      },
      "organizer":[{"email":"kavitha.rajasekaran@rapidqube.com"}],
      "attendees": 
        // // {
        // //  "email": "kavitha.rajasekaran@rapidqube.com",
        // //  "responseStatus": "needsAction"
        // // },
        // {
        //     "email": "Kavithasek@yahoo.co.in",
        //     "responseStatus": "needsAction"
        //    }
        JSON.parse(JSON.stringify(emailarray))
       ,
       "reminders": {
        "useDefault": false,
        "overrides": [
         {
          "method": "popup",
          "minutes": 10
         }
        ]
    },
    "source":{
        "title":"face-chat meeting url",
        "url":url
    }
    }
    console.log(event,"event+++++++++++++++++")
    
    // Check if we a busy and have an event on our calendar for the same time.
    calendar.freebusy.query(
      {
        resource: {
          timeMin: eventStartTime,
          timeMax: eventEndTime,
          timeZone: 'Asia/Kolkata',
          items: [{ id: 'primary' }],
        },
      },
      (err, res) => {
        // Check for errors in our query and log them if they exist.
        if (err) return console.error('Free Busy Query Error: ', err)
    
        // Create an array of all events on our calendar during that time.
        const eventArr = res.data.calendars.primary.busy
    
        // Check if event array is empty which means we are not busy
        // if (eventArr.length === 0)
          // If we are not busy create a new calendar event.
           calendar.events.insert(
            { calendarId: 'primary',conferenceDataVersion:1, resource: event,sendNotifications:true,
            sendUpdates: 'all',
        },
            err => {
              // Check for errors and log them if they exist.
              if (err) return console.error('Error Creating Calender Event:', err)
              // Else log that the event was created.
              return console.log('Calendar event successfully created.')
            }
          )
    
       // If event array is not empty log that we are busy.
        return console.log(`Sorry I'm busy...`)
       })

        res.send({
            result:"success"
        })




})



    





}