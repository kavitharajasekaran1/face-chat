const value =[]


// io.on('connection', function (socket) {


//     let count = Object.keys(io.sockets.sockets).length;
//     console.log(count,"real count")
  
   
  
  
  
  
  
//      socket.emit('counter', {count:count});
//      socket.on('disconnect', function() {

//         // if ($ipsConnected.hasOwnProperty($ipAddress)) {
//         let count = Object.keys(io.sockets.sockets).length;
      
      
//           count--;
      
//           socket.emit('counter', {count:count});
      
//         //}
      
      
      
      
//       });
      

// })



const stream = (socket)=>{
    let connections=[]

  

    socket.on('subscribe', (data)=>{
        //subscribe/join a room
        socket.join(data.room);
        socket.join(data.socketId);
        value.push(data.room)
        console.log(socket.adapter.rooms[data.room].length,"socket in streammmmmmmm")


       



        
        

        //Inform other members in the room of new user's arrival
        if(socket.adapter.rooms[data.room].length > 1){
            socket.emit('counter',(data)=>{
                console.log(data,"real count2====>>>")
            })
            socket.to(data.room).emit('new user', {socketId:data.socketId,value:socket.adapter.rooms[data.room].length});
        }

        console.log(socket.rooms);
    });

          



    socket.on('screensharing', (data)=>{
        console.log(data,"screen sharing")

        socket.to(data.to).emit('screensharing', {sender:data.sender});
    });
    


    socket.on('newUserStart', (data)=>{

        socket.to(data.to).emit('newUserStart', {sender:data.sender});
    });


    socket.on('sdp', (data)=>{
        socket.to(data.to).emit('sdp', {description: data.description, sender:data.sender,value:data.value});
    });


    socket.on('ice candidates', (data)=>{
        socket.to(data.to).emit('ice candidates', {candidate:data.candidate, sender:data.sender});
    });


    socket.on('chat', (data)=>{
        console.log(data,"chatdata++++++++++++++")
        // socket.to(data.room).emit('chat', {sender: data.sender, msg: data.msg});
        socket.broadcast.emit('chat',data)

    });
    socket.on('button',(data)=>{
        console.log(data,"button status+++++++++++")
        socket.to(data.room).emit('button',data);
    })
    socket.on('stream',function(image){
        //  console.log(image,"streammmmmmmmmm")
        socket.broadcast.emit('stream',image)
    })
    
   
      
}

module.exports = stream;