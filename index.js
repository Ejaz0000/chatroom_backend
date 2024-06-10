const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server,{
    cors:{origin: '*', methods: '*',     allowedHeaders: ['Content-Type', 'Authorization'],     credentials: true,   } 
});

const PORT = process.env.PORT || 5000;
const cors = require('cors');
const FormateMsg = require('./FormateMsg');
const {userJoin, getCurrentUser,userLeave,getRoomUsers} = require('./users');
const { emit } = require('process');









server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection',(socket)=>{
    console.log("A new user connected");

    socket.on('joinRoom', ({user,room}) => {
        const u = userJoin(socket.id,user,room);
        console.log(u);
        socket.join(u.room);

        socket.broadcast.to(u.room).emit('message',FormateMsg("server",`${u.user} entered the chat`))

        io.to(u.room).emit('roomUser',{room:u.room , users:getRoomUsers(u.room)})
    });

    socket.on('chatMessage', msg => {
        const u = getCurrentUser(socket.id);

        socket.broadcast.to(u.room).emit('message',msg)
        console.log(msg);

    });

    
    socket.on('disconnect', () => {
        const u = userLeave(socket.id);

        io.to(u?.room).emit('message',FormateMsg("server",`${u?.user} left the chat`))
        io.to(u?.room).emit('roomUser',{room:u.room , users:getRoomUsers(u.room)})

    });

    
})






app.get('/', (req,res)=>{
    res.json("how is the server")
})

