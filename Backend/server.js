const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./Routes/userRoutes')
const cookieParser = require('cookie-parser')
const extraRoute =require('./Routes/extraRoute')
const messageRoute = require('./Routes/messageRoute')
const chatRoute = require('./Routes/chatRoute')
const path = require('path')
const app = express()

require('dotenv').config()

const PORT = 8080
app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true,origin:"http://localhost:3000"}))
app.use('/auth',userRoutes)
app.use('/user',extraRoute)
app.use('/chat',chatRoute)
app.use('/message',messageRoute)

// app.use((req, res, next) => {
//     const error = new Error('Not Found');
//     error.status = 404;
//     next(error);
//   });
  
  
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500).json({
//       error: {
//         message: err.message || 'Internal Server Error',
//       },
//     });
//   });


const __dirname1 = path.resolve()
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1,'/Frontend/x/build')))
  app.get("*",(req,resp)=>{
    resp.sendFile(path.resolve(__dirname1,"frontend","built","index.html"));
  });
}else{
  app.get('/',(req,resp)=>{
    resp.send('Api is running successfuly')
  })
}






const serverStart = app.listen(PORT,()=>{
    console.log('====================================');
    console.log(`Backend is running and mongo connected ...`);
    console.log('====================================');
})


mongoose.connect(process.env.MONGO_URI).then(()=>{
    serverStart
}).catch((err)=>{
    console.log(err);
})

const io = require('socket.io')(serverStart, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000"
    },
  });
  
  io.on("connection", (socket) => {
    console.log('connected to socket.io');
  
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
    });
  
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('typing',(chatId)=>socket.in(chatId).emit("typing"))
    socket.on('stop typing',(chatId)=>socket.in(chatId).emit("stop typing"))
  
    socket.on('new message', (newMsg) => {
      var chat = newMsg.chat;
      if (!chat.users) return console.log('chat.users not defined');
  
      chat.users.forEach(user => {
        if (user=== newMsg.sender._id) return;
        // io.to(user._id).emit("message received", newMsg);
        socket.to(user).emit("message recieved",newMsg)
      });
    });

    socket.off('setup',()=>{
        socket.leave(userData._id)
    })



  });

