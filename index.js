import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
// var cors = require('cors')

const app = express();
// app.use(cors())
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"//配置跨域
    }
});
// app.get("/",(req,res)=>{
//     res.setHeader("Access-Control-Allow-Origin","*")
// })
io.on("connection", sock => {
    console.log('服务端连接成功')
    //像客户端发送连接成功
    sock.emit('conectSuccess')
    //监听加入房间事件
    sock.on('joinRoom', (roomID) => {
        sock.join(roomID)//加入房间
        // console.log('joinRoom', roomID)
    })
    //监听 发起视频
    sock.on('callRemote', roomID => {
        //广播
        io.to(roomID).emit('callRemote1')
        // console.log('callRemote1', roomID)

    })
    //同意邀请
    sock.on('acceptCall', (roomID) => {
        //触发前端acceptCall事件  给相同房间号的发送事件
        io.to(roomID).emit('acceptCall1')
        // console.log('acceptCall1', roomID)
    })
    //交换offer SDP媒体信息
    sock.on('sendOffer', ({ offer, roomID }) => {
        io.to(roomID).emit('sendOffer1', offer)
    })
    sock.on('sendAnswer', ({ answer, roomID }) => {
        io.to(roomID).emit('sendAnswer1', answer)

    })
    sock.on('sendCandidate', ({ roomID, candidate }) => {
        io.to(roomID).emit('sendCandidate1', candidate)
    })
    sock.on('hangup', (roomID) => {
        io.to(roomID).emit('hangup1')
    })

})
server.listen(3000, () => {
    console.log('服务器启动成功')
})