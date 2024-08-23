const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname , 'build', 'index.html'))
})

const userSocketMap = {}

const getAllClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    })
}

io.on('connection', (socket) => {
    socket.on("join", ({ username, roomId }) => {
        const room = io.sockets.adapter.rooms[roomId];
        userSocketMap[socket.id] = username
        socket.join(roomId)
        const clients = getAllClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id,
            })

        })
    })

    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete (userSocketMap[socket.id]);
    })

    socket.on("content-changes", ({e, roomId}) => {
        socket.in(roomId).emit('content-changes', {e});
    })
    socket.on("sync-code", ({socketId, code}) => {
        
        if(code !== null){
            io.to(socketId).emit('content-changes', {e : code});
        }
        

    })

});







server.listen(3000, () => {
    console.log("Server Started");
});
