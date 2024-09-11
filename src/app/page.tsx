'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const fullText = "Welcome to Anonymous";
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[currentIndex]);
      currentIndex++;

      if (currentIndex === fullText.length) {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const generateLink = () => {
    const link = `https://chatroom.example.com/${Math.random().toString(36).substring(7)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); 
    });
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <p className="text-4xl font-bold">{displayedText}</p>

      {isTypingComplete && (
        <>
          <button
            className="btn mt-6 bg-primary hover:bg-accent text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Create a chatroom
          </button>
          {isModalOpen && (
            <div className="modal modal-open">
              <div className="modal-box bg-secondary h-96">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Create a new chatroom</h3>
                  <button
                    className="btn btn-sm btn-circle flex bg-secondary hover:bg-accent text-white"
                    onClick={() => setIsModalOpen(false)}
                  >
                    x
                  </button>
                </div>
                <form action="" className="mt-4 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Enter chat room name"
                    className="input input-bordered w-full max-w-xs bg-secondary"
                  />
                  <button
                    type="button"
                    className="btn mt-6 bg-primary w-52 hover:bg-accent text-white"
                    onClick={generateLink}
                  >
                    Generate Link
                  </button>
                {generatedLink && (
                  <div className="mt-6 flex items-center">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="input input-bordered w-full max-w-xs bg-secondary"
                    />
                    <button
                      className="btn ml-2 bg-accent hover:bg-primary text-white"
                      onClick={copyToClipboard}
                    >
                      Copy
                    </button>
                    
                    {isCopied && (
                      <span className="ml-2 text-green-500">Copied!</span>
                    )}
                  </div>
                )}
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
