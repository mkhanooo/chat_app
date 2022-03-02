import { Socket, Presence } from "phoenix";


let socket = new Socket("/socket", { params: { token: window.userToken } });
let roomId = window.roomId;
let presences = {}
const timeout = 3000;
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

  channel.on("presence_state", state => {
    presences = Presence.syncState(presences, state)
    console.log(presences)
    displayUsers(presences)
  })

  channel.on("presence_diff", diff => {
    presences = Presence.syncDiff(presences, diff)
    console.log(presences)
    displayUsers(presences)
  })


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

  const displayUsers = (presences) => {
    let usersOnline = Presence.list(
      presences,
      (_id, { metas: [user, ...rest] }) => {
        return `
        <div id="user-${user.user_id}"><strong class="text-secondary">${user.username}</strong></div>`;
      }
    ).join("")
    document.querySelector("#users-online").innerHTML = usersOnline;
  };
}

export default socket;
