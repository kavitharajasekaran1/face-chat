
import h from './helpers.js';

window.addEventListener('load', ()=>{
    const room = h.getQString(location.href, 'room');
    const room1 = sessionStorage.getItem("room")
    const username = sessionStorage.getItem('username');
    // socket.emit('username1',sessionStorage.getItem('username'))

    var click =""
    emiting()
    $('#enter-room').click(function(e){
        e.preventDefault();
        document.querySelector('#toview').attributes.removeNamedItem('hidden');

        document.querySelector('#username-set').style.display ="none";
        var user = $("#username").val()
        // alert(user)
        sessionStorage.setItem("username",user)
         socket.emit('username1',user)
        emiting()
      
    
        
    
      
    
    
    
    })
    
    console.log(click,"==============={{{{{{")

    // alert(sessionStorage.getItem("meetingid"))
    // alert($('#enter-room').data('clicked'))
    
    // if(room){
    //     alert("hi from room")
    //     document.querySelector('#room-create').attributes.removeNamedItem('hidden');
    // }

    // else if(username){
    //     alert("hi from username")
    //     document.querySelector('#username-set').attributes.removeNamedItem('hidden');
    // }
    console.log($("#username").val(),sessionStorage.getItem("username1"),"OOOOOOOOOOOOOOO")
     console.log(room1,"room1======>>>>")
     function emiting(){
        // alert("notindie")
   if(room1 !=null || sessionStorage.getItem("username") || sessionStorage.getItem("meetingid") !=null){
    document.querySelector('#toview1').attributes.removeNamedItem('hidden');

            // alert("wonderful")
        
        // alert("woner")
        let commElem = document.getElementsByClassName('room-comm');

        for(let i = 0; i < commElem.length; i++){
            commElem[i].attributes.removeNamedItem('hidden');
        }

        var pc = [];

        let socket = io('/stream');

        var socketId = '';
        var myStream = '';

        socket.on('connect', ()=>{
            //set socketId
            socketId = socket.io.engine.id;

            console.log(socketId,"socket+++++++++++++++++++++")
               
             


            socket.emit('subscribe', {
                room: room,
                socketId: socketId
            });

            var value =0
            socket.on('new user', (data)=>{
                console.log(data.value,"new userrrrrrrrrrrrr")
                socket.emit('newUserStart', {to:data.socketId, sender:socketId,value:data.value});
                pc.push(data.socketId);
                value = value ++;
                console.log(value)
                var partner1 = data.socketId;
                init(true, data.socketId,data.value);
                // document.getElementById("counter") = data.value
            });
            

            socket.on('newUserStart', (data)=>{
                console.log(data,"new user start")
                pc.push(data.sender);
                init(false, data.sender);
            });
            socket.on('button',(data)=>{
                console.log(data,"avanthika=====>>>")
                 document.getElementById('start').disabled = data.status
                // document.getElementById('stopsharing').disabled = true
                // window.href ="./index1.html"
            })
            socket.on('stopbutton',(data)=>{
                console.log(data,"avanthika=stop====>>>")
                document.getElementById('startsharing').disabled = false
                document.getElementById('stopsharing').disabled = false
                // document.getElementById("chat").style.display="block"

                // $("#chat").show()
            })
            socket.on('chat', (data)=>{
                console.log(data,"chatdata++++++++++++++++++")
                var t1 =  $("#counter-chat").is(":hidden")
                console.log(t1,"t1")
                

                if ( $("#counter-chat").is(":hidden")){
                    console.log("entering+++________________")
                    document.getElementById("counter-chat").style.display ="block"
                    document.getElementById("counter-chat").innerHTML=1;
                    h.addChat(data, 'remote');
                    }
                    else if( !$("#counter-chat").is(":hidden")){
                        h.addChat(data, 'remote'); 
                    }
               


            
          })
          //=================================user count=================================================//
        //   socket.on('counter', function (data) {
        //       alert("counter")
        //     console.log(data.count,"counter====>>>")
        //    count = data.count
        
        //     document.getElementById("counter").innerHTML=data.count;          
          
        //   });
          //=================================================================================================//


            socket.on('ice candidates', async (data)=>{
                data.candidate ? await pc[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate)) : '';
            });


            socket.on('sdp', async (data)=>{
                if(data.description.type === 'offer'){
                    data.description ? await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description)) : '';
                        
                    h.getUserMedia().then(async (stream)=>{
                        if(!document.getElementById('local').srcObject){
                            document.getElementById('local').srcObject = stream;
                        }

                        //save my stream
                        myStream = stream;
                        console.log(myStream,"inside============>>>")

                        stream.getTracks().forEach((track)=>{
                            pc[data.sender].addTrack(track, stream);
                        });

                        let answer = await pc[data.sender].createAnswer();
                        
                        await pc[data.sender].setLocalDescription(answer);

                        socket.emit('sdp', {description:pc[data.sender].localDescription, to:data.sender, sender:socketId});
                    }).catch((e)=>{
                        console.error(e);
                    });
                }

                else if(data.description.type === 'answer'){
                    await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description));
                }
            });


           
        });
        socket.on("stream",(image)=>{
            // console.log(image,"imagedata+++++++++++++++++")
           var img = document.getElementById("play") 
           img.src = image;
        //    document.getElementById("chat").style.display="none"

           
          
         })
         
         document.getElementById('chat-input').addEventListener('keypress', (e)=>{
            if(e.which === 13 && (e.target.value.trim())){
                e.preventDefault();
                // alert(e.target.value)
                
                sendMsg(e.target.value);
        
                setTimeout(()=>{
                    e.target.value = '';
                }, 50);
            }
        });
        
        
        function sendMsg(msg){
            if(sessionStorage.getItem("usernames") !=null){
            var data = {
                room: room,
                msg: msg,
                sender: sessionStorage.getItem("usernames")
            };
        }
        else{
            var data = {
                room: room,
                msg: msg,
                sender: sessionStorage.getItem("username")
            };

        }
        
            //emit chat message
            socket.emit('chat', data);
        
        
            //add localchat
            h.addChat(data, 'local');
        }
        
        
        


        


        function init(createOffer, partnerName,value){
            console.log("initfunction")
            pc[partnerName] = new RTCPeerConnection(h.getIceServer());
            // console.log(document.getElementById('start').disabled)

            

            
            h.getUserMedia().then((stream)=>{
                //save my stream
                myStream = stream;

                stream.getTracks().forEach((track)=>{
                    pc[partnerName].addTrack(track, stream);//should trigger negotiationneeded event
                });

                document.getElementById('local').srcObject = stream;
            }).catch((e)=>{
                console.error(`stream error: ${e}`);
            });



            //create offer
            if(createOffer){
                document.getElementById('counter').innerHTML = value

                pc[partnerName].onnegotiationneeded = async ()=>{
                    let offer = await pc[partnerName].createOffer();
                    
                    await pc[partnerName].setLocalDescription(offer);

                    socket.emit('sdp', {description:pc[partnerName].localDescription, to:partnerName, sender:socketId,value :"clicked"});
                };
            }



            //send ice candidate to partnerNames
            pc[partnerName].onicecandidate = ({candidate})=>{
                socket.emit('ice candidates', {candidate: candidate, to:partnerName, sender:socketId});
            };



            //add
            pc[partnerName].ontrack = (e)=>{
                let str = e.streams[0];
                if(document.getElementById(`${partnerName}-video`)){
                    document.getElementById(`${partnerName}-video`).srcObject = str;
                }

              else{
                    //video elem
                    let newVid = document.createElement('video');
                    newVid.id = `${partnerName}-video`; 
                    newVid.width ="200";
                    newVid.height ="200"           
                    newVid.srcObject = str;
                    newVid.autoplay = true;
                    newVid.className = 'remote-video';
                    
                    //create a new div for card
                    let cardDiv = document.createElement('div');
                    cardDiv.className = 'card mb-3';
                    cardDiv.appendChild(newVid);
                    
                    //create a new div for everything
                    let div = document.createElement('div');
                    div.className = 'col-sm-12 col-md-6';
                    div.id = partnerName;
                   
           
                    
                    div.appendChild(cardDiv);
                    
                    //put div in videos elem
                    document.getElementById('videos').appendChild(div);
                }
            };



            pc[partnerName].onconnectionstatechange = (d)=>{
                switch(pc[partnerName].iceConnectionState){
                    case 'disconnected':
                    case 'failed':
                        document.getElementById('counter').innerHTML = value-1
  
                        h.closeVideo(partnerName);
                        break;
                        
                    case 'closed':
                        document.getElementById('counter').innerHTML = value-1

                        h.closeVideo(partnerName);
                        break;
                }
            };



            pc[partnerName].onsignalingstatechange = (d)=>{
                switch(pc[partnerName].signalingState){
                    case 'closed':

                        console.log("Signalling state is 'closed'");
                        document.getElementById('counter').innerHTML = value-1

                        h.closeVideo(partnerName);
                        break;
                }
            };
        }

        var canvas = document.getElementById("preview")
        var context = canvas.getContext("2d")
        canvas.width =1000;
    canvas.height =10000;
    context.width = canvas.width;
    var video = document.getElementById("video")
    function loadCam(stream){
    // context.drawImage()
    video.srcObject =stream
    document.getElementById("chat").style.display="none"
    }
    
    var displayMediaOptions = {
      video: {
        cursor: "always"
      },
      audio: false
    };
    
    function viewVideo(video,context){
        let videoA = document.getElementById("video")
    
    // context.drawImage(videoA,0,0,context.width,context.height)
    
    const videoV = $("#video").get(0)
    var canvas = document.createElement("canvas")
    canvas.width = videoV.videoWidth * 1;
    canvas.height = videoV.videoHeight * 1
    canvas.getContext("2d").drawImage(videoV,0,0,canvas.width,canvas.height)
    let src = canvas.toDataURL()
    // console.log(src,"src++++++++++")
    socket.emit('stream',src)
    //socket.emit('stream',Math.random())
    
    }
    
    const startElem = document.getElementById("start");
    var displayMediaOptions = {
        video: {
          cursor: "always"
        },
        audio: false
      };
    
    startElem.addEventListener("click", async function(evt) {
        // alert("hiii")
        document.getElementById("chat").style.display ="none"
        document.getElementById("startsharing").style.display = "none"
    
        document.getElementById("stopsharing").style.display = "block"
    
        var data1 ={
                        room : room,
                        status:true,
                        sender:username,
                    }
    var value =await navigator.mediaDevices.getDisplayMedia({displayMediaOptions})
    loadCam(value)
    //  viewVideo(video,context)
    
    setInterval(function(){
    viewVideo(video,context)
    
    },2000)
    socket.emit("button",data1)
    
    })
    var stoptElem = document.getElementById('stopsharing')
    
    stoptElem.addEventListener("click", async function(evt) {

        document.getElementById("startsharing").style.display = "block"
    
        document.getElementById("stopsharing").style.display = "none"
    
        var data1 ={
                        room : room,
                        status:true,
                        sender:username,
                    }
                    let tracks = video.srcObject.getTracks();
        
                    tracks.forEach(track => track.stop());
                    video.srcObject = null; 
                    document.getElementById("chat").style.display ="block"
   
    
    socket.emit("stopbutton",data1)
    
    })

    //=================================================stop and start video=========================================//
    var videohide = document.getElementById("videohide")
    var videohide1 = document.getElementById("videodisplay")
    var d =document.getElementById("local")

   videohide.addEventListener("click", async function(e) {
    e.preventDefault();
    console.log(myStream,"testing=========>>>")
    document.getElementById("videodisplay").style.display ="block"
    document.getElementById("videohide").style.display ="none"

   console.log(myStream)
   var v = document.getElementById("local").srcObject
   console.log(v,"v")
   v.getVideoTracks()[0].enabled = false;
//    h.closeVideo("local")
  
     
        try{
        //   myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
        }
         catch{
           
                  myStream.getVideoTracks()[0].stop()
                

        }
        // let tracks = d.srcObject.getTracks();
        
        //             tracks.forEach(track => track.stop());

    })
    videohide1.addEventListener("click", async function(e) {
        e.preventDefault();
        // console.log(myStream,"testing=========>>>")
    
        document.getElementById("videodisplay").style.display ="none"
        document.getElementById("videohide").style.display ="block"

        var v = document.getElementById("local").srcObject
        console.log(v,"v")
        v.getVideoTracks()[0].enabled = true;

        // h.getUserMedia().then(async (stream)=>{
            
        //         document.getElementById('local').srcObject = stream;
            
        // })
       
    
    
            //  myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
    
        })

   var mute = document.getElementById("mute")
   var unmute = document.getElementById("unmute")
    mute.addEventListener("click", async function(e) {
        console.log("muted++++++++++++++++++")
            e.preventDefault();
            document.getElementById("mute").style.display ="none"
            document.getElementById("unmute").style.display ="block"
            var v = document.getElementById("local").srcObject
   console.log(v,"v")
   v.getAudioTracks()[0].enabled = false;
            // myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);

    })
    unmute.addEventListener("click", async function(e) {
        console.log("muted++un++++++++++++++++")
            e.preventDefault();
            document.getElementById("unmute").style.display ="none"
            document.getElementById("mute").style.display ="block"
            // myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
            var v = document.getElementById("local").srcObject
            console.log(v,"v")
            v.getAudioTracks()[0].enabled = true;

    })

    
    
    
    
    
    
    
        


       



    
       
    
           
    
         
                    
    



    }
    

    }
    
    // let socket = io('/stream');

    // var socketId = '';
    // var myStream = '';

       


//     var canvas = document.getElementById("preview")
//     var context = canvas.getContext("2d")
//     canvas.width =1000;
// canvas.height =10000;
// context.width = canvas.width;
// var video = document.getElementById("video")
// function loadCam(stream){
// // context.drawImage()
// video.srcObject =stream
// document.getElementById("chat").style.display="none"
// }

// var displayMediaOptions = {
//   video: {
//     cursor: "always"
//   },
//   audio: false
// };

// function viewVideo(video,context){
//     let videoA = document.getElementById("video")

// // context.drawImage(videoA,0,0,context.width,context.height)

// const videoV = $("#video").get(0)
// var canvas = document.createElement("canvas")
// canvas.width = videoV.videoWidth * 1;
// canvas.height = videoV.videoHeight * 1
// canvas.getContext("2d").drawImage(videoV,0,0,canvas.width,canvas.height)
// let src = canvas.toDataURL()
// // console.log(src,"src++++++++++")
// socket.emit('stream',src)
// //socket.emit('stream',Math.random())

// }

// const startElem = document.getElementById("startsharing");
// var displayMediaOptions = {
//     video: {
//       cursor: "always"
//     },
//     audio: false
//   };

// startElem.addEventListener("click", async function(evt) {
//     alert("hiii")
//     document.getElementById("startsharing").style.display = "none"

//     document.getElementById("stopsharing").style.display = "block"

//     var data1 ={
//                     room : room,
//                     status:true,
//                     sender:username,
//                 }
// var value =await navigator.mediaDevices.getDisplayMedia({displayMediaOptions})
// loadCam(value)
// //  viewVideo(video,context)

// setInterval(function(){
// viewVideo(video,context)

// },2000)
// socket.emit("button",data1)

// })
// var stoptElem = document.getElementById('stopsharing')

// stoptElem.addEventListener("click", async function(evt) {
//     document.getElementById("startsharing").style.display = "block"

//     document.getElementById("stopsharing").style.display = "none"

//     var data1 ={
//                     room : room,
//                     status:true,
//                     sender:username,
//                 }
//                 let tracks = video.srcObject.getTracks();
    
//                 tracks.forEach(track => track.stop());
//                 video.srcObject = null;    

// socket.emit("stopbutton",data1)

// })







    })






//});