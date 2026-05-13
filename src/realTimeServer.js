module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    const cookie = socket.request.headers.cookie;

    let user = "Usuario";

    if (cookie) {
      const usernameCookie = cookie
        .split(";")
        .find((c) => c.trim().startsWith("username="));

      if (usernameCookie) {
        user = decodeURIComponent(usernameCookie.split("=")[1]);
      }
    }

    socket.on("message", (message) => {
      if (message.trim() === "") return;

      io.emit("message", {
        user,
        message,
        date: new Date().toLocaleTimeString(),
      });
    });

    socket.on("typing", () => {
      socket.broadcast.emit("typing", { user });
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("stopTyping", { user });
    });
  });
};