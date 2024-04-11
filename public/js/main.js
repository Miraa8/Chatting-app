var socket = io("http://localhost:3000/");
let msgInput = document.getElementById("msg");
let messages = document.getElementById("messages");
let username = prompt("Please enter your name:");
if (!username) {
  username = "Anonymous";
}
function sendMsg() {
  let msg = msgInput.value;
  socket.emit("sentMsg", { senderName: username, message: msg });
  msgInput.value = "";
}

socket.on("reply", (data) => {
  const { senderName, message } = data;
  const item = document.createElement("li");
   let markup = `
        <h4>${senderName}</h4>
        <p>${message}</p>
    `;
  item.innerHTML = markup;
  if (senderName === username) {
    item.classList.add("own-message");
  } else {
    item.classList.add("other-message");
  }
  messages.append(item);
  window.scrollTo(0, document.body.scrollHeight);
});


msgInput.addEventListener("input", () => {
  socket.emit("typing");
});
msgInput.addEventListener("keyup", () => {
  socket.emit("stoppedTyping");
});
socket.on("userTyping", () => {
  document.getElementById("typing").innerHTML = "Typing...";
});
socket.on("userStoppedTyping", () => {
  setTimeout(() => {
    document.getElementById("typing").innerHTML = "";
  }, 1000);
});
