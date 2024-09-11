"use client";
import { useEffect, useRef, useState } from "react";
import { LuClipboard } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import Typed from "typed.js";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const el = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Welcome to Anonymous"],
      typeSpeed: 50,
    });

    return () => typed.destroy();
  }, []);

  const generateLink = () => {
    if (roomName.trim() === "") return;
    const link = `https://chatroom.example.com/${Math.random()
      .toString(36)
      .substring(7)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <p className="text-4xl font-bold" ref={el} />

      <button
        className="btn mt-6 bg-primary hover:bg-accent text-white "
        onClick={() => setIsModalOpen(true)}
      >
        Create a chatroom
      </button>
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
                  placeholder="Enter chat room name"
                  className="input input-bordered w-full bg-secondary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRoomName(e.target.value)
                  }
                />
                <button
                  className="btn mt-6 bg-primary w-full hover:bg-accent text-white"
                  onClick={generateLink}
                >
                  Generate Link
                </button>

                {generatedLink && (
                  <div className="mt-6 flex items-center justify-self-end h-full">
                    <p className="h-12 border rounded-md flex items-center justify-center px-2 w-full font-semibold">
                      {generatedLink}
                    </p>
                    <button
                      className="btn ml-2 bg-accent hover:bg-primary text-white"
                      onClick={copyToClipboard}
                    >
                      {isCopied ? <LuClipboardCheck /> : <LuClipboard />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
