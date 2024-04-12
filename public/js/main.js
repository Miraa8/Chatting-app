const socket = io("http://localhost:3000/");
const msgInput = document.getElementById("msg");
const messages = document.getElementById("messages");

Swal.fire({
  title: "Enter your name:",
  input: "text",
  inputPlaceholder: "Your name",
  showCancelButton: true,
  confirmButtonText: "Submit",
  customClass: {
    container: "my-swal-container",
    title: "my-swal-title",
    input: "my-swal-input",
    confirmButton: "my-swal-confirm-button",
    cancelButton: "my-swal-cancel-button",
  },
}).then((result) => {
  const username = result.value || "Anonymous";
  initializeChat(username);
});

function initializeChat(username) {
  function sendMsg() {
    const msg = msgInput.value;
    socket.emit("sentMsg", { senderName: username, message: msg });
    msgInput.value = "";
  }
  document.getElementById("submit").addEventListener("click", sendMsg);
  socket.on("reply", (data) => {
    const { senderName, message } = data;
    const item = document.createElement("li");
    const markup = `
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
    debouncedStopTyping();
  });

  socket.on("userTyping", () => {
    document.getElementById("typing").innerHTML = "Typing...";
  });

  socket.on("userStoppedTyping", () => {
    setTimeout(() => {
      document.getElementById("typing").innerHTML = "";
    }, 1000);
  });
}
// debounce technique
function debounce(func, delay) {
  let currentTimeOut;
  return function () {
    clearTimeout(currentTimeOut);
    currentTimeOut = setTimeout(() => {
      func();
    }, delay);
  };
}
function stoppedTyping() {
  socket.emit("stoppedTyping");
}
const debouncedStopTyping = debounce(stoppedTyping, 500);
