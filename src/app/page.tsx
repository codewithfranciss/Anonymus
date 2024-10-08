"use client";
import { alphabets } from "@/lib/constant";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LuClipboard } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import Typed from "typed.js";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const el = useRef<HTMLParagraphElement | null>(null);
  
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Welcome To Anonymous"],
      typeSpeed: 50,
    });

    return () => typed.destroy();
  }, []);

  const generateLink = async () => {
    if (roomName.trim() === "") return;

    try {
      setIsLoading(true);
      const id = Math.random().toString(36).substring(7);

      await createClient().from("room").insert({ id, name: roomName });

      const link = `https://anonymus-chi.vercel.app/chatroom/${id}`;
      setGeneratedLink(link);

      const name = []

      for(let i = 0; i < 5; i++){
        const randomLetter = alphabets[Math.floor(Math.random() * alphabets.length)]
        name.push(randomLetter)
      }

      const username = name.join("")
      const { error } = await createClient()
      .from("user_t")
      .insert({ username });
      if (error) {
        console.error("Error renaming room:", error.message);
      }
    localStorage.setItem("username", username);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink!);
    setIsCopied(true);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <p className="text-3xl lg:text-5xl xl:text-7xl font-bold" ref={el} />
      <p className="text-2xl">Chatting in secret</p>
      <button
        className="btn mt-6 bg-primary hover:bg-accent text-white "
        onClick={() => setIsModalOpen(true)}
      >
        Create a chatroom
      </button>
      <>
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box bg-secondary space-y-4 transition">
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
                  maxLength={50}
                  
                />
                <button
                  className="btn mt-6 bg-primary w-full hover:bg-accent text-white"
                  onClick={generateLink}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-md" />
                  ) : (
                    "Generate Link"
                  )}
                </button>

                {!isLoading && generatedLink ? (
                  <div className="mt-6 flex items-center gap-2 justify-self-end h-full">
                    <Link href={generatedLink} target="_blank" className="h-10 border rounded-md flex items-center justify-center px-2 w-full font-semibold max-sm:text-xs">
                      {generatedLink}
                    </Link>

                    <p  onClick={copyToClipboard}>
                    {isCopied ? <LuClipboardCheck size={25} /> : <LuClipboard size={25} />}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
