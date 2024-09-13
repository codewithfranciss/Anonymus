'use client'

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { BiPencil, BiSend, BiTrash } from "react-icons/bi";
import { TbLink } from "react-icons/tb";


function Room({ name }: { name: string }) {

    const [username, setUsername] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true);
  
    const [isLoading, setIsLoading] = useState(false);
  
    const generatedUsername = async () => {
      if (username.trim() === "") return;
  
      try {
        setIsLoading(true);
  
        const { error } = await createClient()
          .from("user_t")
          .insert({ username });
          localStorage.setItem("username", username)
  
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
  return (
    <>
      <div className="chat-container p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h2 className="p-2 font-black text-lg">{ name }</h2>
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
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              Obi-Wan Kenobi
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble bg-secondary">
              You were the Chosen One!
            </div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>

          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              Anakin
              <time className="text-xs opacity-50">12:46</time>
            </div>
            <div className="chat-bubble bg-accent">I hate you!</div>
            <div className="chat-footer opacity-50">Seen at 12:46</div>
          </div>
        </div>
      </div>
      <div className="flex items-center border-t border-gray-300 pt-4 px-2 absolute bottom-2 w-full">
        <input
          type="text"
          placeholder="Type your message here"
          className="input input-bordered flex-grow bg-secondary focus:outline-none"
        />
        <button className="btn bg-primary ml-2 hover:bg-accent text-white">
          <BiSend />
        </button>
      </div>

      <>
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box bg-secondary space-y-4 h-[300px]">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">
                  Create a new chatroom
                </h3>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                />
                <button
                  className="btn mt-6 bg-primary w-full hover:bg-accent text-white"
                  onClick={generatedUsername}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-md" />
                  ) : (
                    "Enter Chat Room"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  )
}

export default Room