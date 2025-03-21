"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Toggle from "../components/Toggle";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [isLlama, setIsLlama] = useState(false);

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 3 ${
    vibe === "Casual" ? "relaxed" : vibe === "Funny" ? "silly" : "Professional"
  } twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else. ${
    vibe === "Funny" ? "Make the biographies humerous" : ""
  }Answer in german.Make sure each generated biography is less than 300 characters, has short sentences that are found in Twitter bios, and feel free to use this context as well: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    
    try {
      const response = await fetch("/api/together", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: isLlama
            ? "gpt-4"
            : "gpt-3.5-turbo",
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value);
          setGeneratedBios((prev) => prev + text);
        }
      } catch (error) {
        console.error("Fehler beim Lesen des Streams:", error);
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Fehler bei der Generierung:", error);
      toast.error("Fehler bei der Generierung. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
      scrollToBios();
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          Beta Version
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generiere deine LinkedIn Bio mit KI
        </h1>
        <div className="mt-7">
          <Toggle isGPT={isLlama} setIsGPT={setIsLlama} />
        </div>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Gib deinen Job ein{" "}
              <span className="text-slate-500">(oder dein Lieblingshobby)</span>.
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"z.B. Marketing Manager"}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="2 icon" />
            <p className="text-left font-medium">Wähle deinen Stil.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          {loading ? (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          ) : (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generiere deine Beschreibung &rarr;
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Deine generierten Beschreibungen
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast("Beschreibung in die Zwischenablage kopiert", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
