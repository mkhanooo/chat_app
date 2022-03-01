import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { token: window.userToken } });

socket.connect();

let channel = socket.channel("room:general", {});
channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

  channel.on("room:general:new_message", (message) => {
    console.log(message);
  });
  document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let input = e.target.querySelector("#message-body");
    channel.push("message:add", {
      message: input.value,
    });
    input.value = "";
  });
// channel.on("room:general:new_message", (message) => {
//   console.log(message);
// });

// document.querySelector("#message-form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   let input = e.target.querySelector("#message-body");

//   channel.push("message:add", { message: input.value });
//   input.value = "";
// });
export default socket;
