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
  const [generatedBios, setGeneratedBios] = useState<string>("");
  const [isGPT4, setIsGPT4] = useState(false);

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 3 ${
    vibe === "Casual" ? "relaxed" : vibe === "Funny" ? "silly" : "Professional"
  } LinkedIn summaries. Each summary should be less than 300 characters, professional for LinkedIn${
    vibe === "Funny" ? ", with a touch of humor" : ""
  }. Use this context: ${bio}${bio.slice(-1) === "." ? "" : "."} 
Format each summary EXACTLY as follows:
[START_SUMMARY_1]
First summary
[END_SUMMARY_1]

[START_SUMMARY_2]
Second summary
[END_SUMMARY_2]

[START_SUMMARY_3]
Third summary
[END_SUMMARY_3]`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: isGPT4 ? "gpt-4-turbo" : "gpt-3.5-turbo",
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Process the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value);
          setGeneratedBios((prev) => prev + text);
        }
      }

      scrollToBios();
    } catch (error) {
      console.error("Error generating bio:", error);
      toast.error("Failed to generate bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          <b>126,657</b> summaries generated so far
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your next LinkedIn summary using AI
        </h1>
        <div className="mt-7">
          <Toggle isGPT={isGPT4} setIsGPT={setIsGPT4} />
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
              Drop in your job{" "}
              <span className="text-slate-500">(or your favorite hobby)</span>.
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"e.g. Software Engineer at Google"}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your vibe.</p>
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
              Generate your summary &rarr;
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
          {generatedBios && generatedBios.length > 0 ? (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Your generated summaries
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {(() => {
                  try {
                    // Log raw text for debugging
                    console.log("Raw text received:", generatedBios);
                    
                    // Extract summaries using the new format with regex
                    const summaryRegex = /\[START_SUMMARY_\d+\]([\s\S]*?)\[END_SUMMARY_\d+\]/g;
                    const summaries: string[] = [];
                    
                    let match;
                    while ((match = summaryRegex.exec(generatedBios)) !== null) {
                      const summaryText = match[1].trim();
                      if (summaryText) {
                        summaries.push(summaryText);
                      }
                    }
                    
                    console.log("Extracted summaries:", summaries);
                    
                    // If we couldn't find any properly formatted summaries, try a more lenient approach
                    if (summaries.length === 0) {
                      console.log("No summaries found with strict regex, trying backup method");
                      
                      // Try looking for just the text between any START and END markers
                      const backupRegex = /\[START[^\]]*\]([\s\S]*?)\[END[^\]]*\]/g;
                      
                      while ((match = backupRegex.exec(generatedBios)) !== null) {
                        const summaryText = match[1].trim();
                        if (summaryText) {
                          summaries.push(summaryText);
                        }
                      }
                      
                      console.log("Backup extraction found:", summaries.length, "summaries");
                    }
                    
                    // If we still couldn't find any summaries, just display the whole text
                    if (summaries.length === 0) {
                      return (
                        <div
                          className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedBios);
                            toast("Summary copied to clipboard", {
                              icon: "✂️",
                            });
                          }}
                        >
                          <p>{generatedBios}</p>
                        </div>
                      );
                    }
                    
                    // Otherwise, display each summary separately (up to 3)
                    return summaries.slice(0, 3).map((summary, i) => (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(summary);
                          toast("Summary copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={i}
                      >
                        <p>{summary}</p>
                      </div>
                    ));
                  } catch (error) {
                    console.error("Error parsing summaries:", error);
                    // Fallback if there's an error in parsing
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBios);
                          toast("Summary copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                      >
                        <p>{generatedBios}</p>
                      </div>
                    );
                  }
                })()}
              </div>
            </>
          ) : (
            <div className="text-gray-500">No summaries generated yet</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
