const socket = io();

const send = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");
const messageInput = document.querySelector("#message");
const typingStatus = document.querySelector("#typing-status");

let typingTimer;

function getAvatar(user) {
  const avatars = [
    "/img/avatar1.png",
    "/img/avatar2.png",
    "/img/avatar3.png",
    "/img/avatar4.png",
    "/img/avatar5.png",
  ];

  let sum = 0;

  for (let i = 0; i < user.length; i++) {
    sum += user.charCodeAt(i);
  }

  return avatars[sum % avatars.length];
}

send.addEventListener("click", () => {
  sendMessage();
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

messageInput.addEventListener("input", () => {
  if (messageInput.value.trim() !== "") {
    socket.emit("typing");

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      socket.emit("stopTyping");
    }, 1000);
  } else {
    socket.emit("stopTyping");
  }
});

function sendMessage() {
  const message = messageInput.value.trim();

  if (message === "") return;

  socket.emit("message", message);
  socket.emit("stopTyping");

  messageInput.value = "";
}

socket.on("message", ({ user, message, date }) => {
  const msg = document.createRange().createContextualFragment(`
    <div class="message">
      <div class="image-container">
        <img src="${getAvatar(user)}" alt="${user}" />
      </div>

      <div class="message-body">
        <div class="user-info">
          <span class="username">${user}</span>
          <span class="time">${date}</span>
        </div>

        <p>${message}</p>
      </div>
    </div>
  `);

  allMessages.append(msg);
  allMessages.scrollTop = allMessages.scrollHeight;
});

socket.on("typing", ({ user }) => {
  typingStatus.textContent = `${user} está escribiendo...`;
});

socket.on("stopTyping", () => {
  typingStatus.textContent = "";
});