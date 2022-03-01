defmodule ChatAppWeb.RoomChannel do
  use ChatAppWeb, :channel

  def join(channel_name, _params, socket) do
    {:ok, %{channel: channel_name}, socket}
  end

  def handle_in("message:add", %{"message" => body}, socket) do
    broadcast!(socket, "room:general:new_message", %{body: body})
    {:reply, :ok, socket}
  end
end
