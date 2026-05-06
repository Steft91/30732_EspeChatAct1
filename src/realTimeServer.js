module.exports = (httpServer) => {
    const {Server, Socket} = require('socket.io');
    const io = new Server(httpServer);
    io.on('connection', socket => {
        console.log(socket.id)
        
    })
};
