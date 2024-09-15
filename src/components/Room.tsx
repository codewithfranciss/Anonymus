"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { BiPencil, BiSend, BiTrash } from "react-icons/bi";
import { TbLink } from "react-icons/tb";

function Room({ name, id }: { name: string; id: string }) {
  const [username, setUsername] = useState(() => {
    const name = localStorage.getItem("username")
    if(name){
      return name
    } else {
      return ""
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(() => {
    const existingUser = localStorage.getItem("username");
    console.log(existingUser);
    if (!existingUser) {
      return true;
    } else {
      return false;
    }
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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
    fetchMessages()
  }, [])

  useEffect(() => { 
    function realtimeChats() {
      createClient().channel("messages").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, async (payload) => {
        console.log(payload)
        await fetchMessages()
      }).subscribe()
    }
    realtimeChats()
    }, [])
  

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
      setIsModalOpen(false);
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
  return (
    <div className="h-screen">
      <div className="chat-container p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h2 className="p-2 font-black text-lg">{name}</h2>
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
                <a>
                  <TbLink />
                  Share
                </a>
              </li>
              <li>
                <a>
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

        {/* Chat messages */}
        <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.sender_name === username ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header">
                {msg.sender_name}
                <time className="text-xs opacity-50">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  msg.sender_name === username ? "bg-primary" : "bg-secondary"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center border-t border-gray-300 pt-4 px-2 absolute bottom-2 w-full">
        <input
          type="text"
          placeholder="Type your message here"
          className="input input-bordered flex-grow bg-secondary focus:outline-none"
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

      {/* Modal for username input */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-secondary space-y-4 h-[300px]">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Enter your username</h3>
              <button
                className="btn btn-sm btn-circle flex bg-secondary hover:bg-accent text-white"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </button>
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered w-full bg-secondary"
                value={username} // Show the current username if there is one
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
    </div>
  );
}

export default Room;
