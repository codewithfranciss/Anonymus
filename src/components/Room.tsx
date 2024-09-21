"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { BiPencil, BiSend, BiTrash } from "react-icons/bi";
import { TbLink } from "react-icons/tb";

function Room({ name, id }: { name: string; id: string }) {
  // State management
  const [username, setUsername] = useState(() => {
    const name = localStorage.getItem("username");
    return name || "";
  });

  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(true); // Username modal
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // Rename modal
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newRoomName, setNewRoomName] = useState(name);

  const fetchMessages = async () => {
    const { data, error } = await createClient()
      .from("messages")
      .select("*")
      .eq("room_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
    } else {
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    function realtimeChats() {
      createClient()
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          async (payload) => {
            console.log(payload);
            await fetchMessages();
          }
        )
        .subscribe();
    }
    realtimeChats();
  }, []);

  const generatedUsername = async () => {
    if (username.trim() === "") return;

    try {
      setIsLoading(true);

      const { error } = await createClient()
        .from("user_t")
        .insert({ username });
      localStorage.setItem("username", username);

      if (error) {
        console.log(error.message);
      }
      setIsUsernameModalOpen(false); // Close username modal after saving
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const { error } = await createClient()
      .from("messages")
      .insert([{ content: newMessage, sender_name: username, room_id: id }]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setNewMessage("");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room link copied to clipboard!");
  };

  const handleRename = async () => {
    if (newRoomName.trim() === "" || newRoomName === name) return;

    try {
      const { error } = await createClient()
        .from("room")
        .update({ name: newRoomName })
        .eq("id", id);

      if (error) {
        console.error("Error renaming room:", error.message);
      } else {
        alert("Room name updated successfully!");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-4">
        <h2 className="p-2 font-black text-2xl">{name}</h2>
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-circle btn-ghost hover:bg-secondary-focus"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 12h.01M12 12h.01M18 12h.01M6 6h.01M12 6h.01M18 6h.01M6 18h.01M12 18h.01M18 18h.01"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-10 menu p-2 shadow-md bg-secondary rounded-box w-52"
          >
            <li>
              <a onClick={handleShare}>
                <TbLink />
                Share
              </a>
            </li>
            <li>
              <a onClick={() => setIsRenameModalOpen(true)}>
                <BiPencil />
                Rename
              </a>
            </li>
            <li>
              <a>
                <BiTrash />
                Delete
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-12 p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.sender_name === username ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header">
              {msg.sender_name}
              <time className="text-xs opacity-50">
                {new Date(msg.created_at).toLocaleTimeString()}
              </time>
            </div>
            <div
              className={`chat-bubble ${msg.sender_name === username ? "bg-primary" : "bg-secondary"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center pt-4 px-4 fixed bottom-0 w-full max-w-3xl mx-auto z-50 left-0 right-0">
        <input
          type="text"
          placeholder="Type your message here"
          className="input input-bordered mb-1 flex-grow bg-secondary focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="btn bg-primary ml-2 hover:bg-accent text-white"
          onClick={sendMessage}
        >
          <BiSend />
        </button>
      </div>

      {/* Username Modal */}
      {isUsernameModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-secondary space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Enter your username</h3>
              <button
                className="btn btn-sm btn-circle flex bg-secondary hover:bg-accent text-white"
                onClick={() => setIsUsernameModalOpen(false)}
              >
                x
              </button>
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered w-full bg-secondary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="btn mt-6 bg-primary w-full hover:bg-accent text-white"
                onClick={generatedUsername}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md" />
                ) : (
                  "Save Username"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-secondary space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Rename Room</h3>
              <button
                className="btn btn-sm btn-circle flex bg-secondary hover:bg-accent text-white"
                onClick={() => setIsRenameModalOpen(false)}
              >
                x
              </button>
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Enter new room name"
                className="input input-bordered w-full bg-secondary"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <button
                className="btn mt-6 bg-primary w-full hover:bg-accent text-white"
                onClick={handleRename}
              >
                Rename Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;
