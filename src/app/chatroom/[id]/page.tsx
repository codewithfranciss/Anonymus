import { BiPencil, BiSend, BiTrash } from "react-icons/bi";
import { TbLink } from "react-icons/tb";

export default function Chatroom() {
  return (
    <div className="relative max-w-2xl mx-auto h-[100dvh]">
      <div className="chat-container p-4 flex flex-col justify-between">
  
        <div className="flex justify-between items-center mb-4">
          <h2 className="p-2 font-black text-lg">Coding Group</h2>
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
                <a><TbLink/>Share</a>
              </li>
              <li>
                <a><BiPencil/>Rename</a>
              </li>
              <li>
                <a><BiTrash/>Delete</a>
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
            <div className="chat-bubble bg-secondary">You were the Chosen One!</div>
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
          <BiSend/>
            </button>
          </div>
    </div>
  );
}
