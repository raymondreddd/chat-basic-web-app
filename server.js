const express = require("express")
const path=require('path')
const http=require('http')
const socketio = require('socket.io')
const formatMessage=require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')
const Qs=require('qs') 

const app = express();
const server = http.createServer(app)
const io = socketio(server)

//middlewares
app.use(express.static(path.join(__dirname, 'public')))

const botName='admin'

//run when client connectss
io.on('connection', socket => {
    console.log("new connection successfull");
    

    //joining room
    socket.on('joinRoom',({username,room}) => {
        const user = userJoin(socket.id, username, room)

        // console.log(username,room);
        // console.log(user.username,user.room);

        socket.join(user.room)


        //welcome only to the user
        socket.emit('message',formatMessage(botName,'welcome to chatcord'))

        //when [everybody minus user] connects
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined he cant seee this message`));

    })
    

    //listen 4 chatMessage
    socket.on('chatMessage', (msg) => {
        console.log(msg);

        //for the username handle
        const user = getCurrentUser(socket.id)
        io.emit('message',formatMessage(user.username,msg));
    })


    //when disconnects
    socket.on('disconnect', () => {

        //first get which user left
        const user=userLeave(socket.id);

        if(user){
            io.to(user.room).emit(formatMessage(botName,`${user.username} has left chat`))
        }

        
    });
})
//env variables
const PORT = 3000|| process.env.PORT;

//its not app.listen
server.listen(PORT,() => console.log(`server running on ${PORT}`));