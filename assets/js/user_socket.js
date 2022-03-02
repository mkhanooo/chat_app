import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { token: window.userToken } });
let roomId = window.roomId;

if (roomId) {
  socket.connect();

  let channel = socket.channel(`room:${roomId}`, {});
  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined successfully", resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  channel.on(`room:${roomId}:new_message`, (message) => {
    console.log(message);
    displayMessage(message);
  });
  document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let input = e.target.querySelector("#message-body");
    channel.push("message:add", {
      message: input.value,
    });
    input.value = "";
  });
  const displayMessage = (msg) => {
    let template = `
      <li class="list-group-item"><strong> ${msg.user.username}</strong>:${msg.body}</li>`;
    document.querySelector("#display").innerHTML += template;
  };
}

export default socket;
