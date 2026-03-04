import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Heart,
  Sparkles,
  Wand2,
  Upload,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Music,
  Crown,
  Cloud,
  Smile,
} from "lucide-react";
import { templateConfigs } from "@/templates/ai/templateConfigs";

type StepId = "intro" | "recipient" | "relationship" | "vibe" | "memories" | "message" | "music" | "review";

type MemoryItem = {
  id: string;
  image: string;
  caption?: string;
  date?: string;
};

type Track = {
  id: string;
  name: string;
  desc: string;
};

const tracks: Track[] = [
  { id: "piano", name: "Soft Piano Melody", desc: "Emotional & cinematic" },
  { id: "lofi", name: "Lofi Chill Vibes", desc: "Relaxed & modern" },
  { id: "acoustic", name: "Acoustic Sunset", desc: "Warm & intimate" },
  { id: "upbeat", name: "Upbeat Pop", desc: "Happy & energetic" },
];

const relationships = ["Partner", "Best Friend", "Family", "Crush"] as const;

const vibeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  romantic: Heart,
  emotional: Cloud,
  funny: Smile,
  royal: Crown,
  minimal: Sparkles,
  pastel: Wand2,
};

function encodePreviewPayload(payload: unknown) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function AIDynamicWebsites() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<StepId>("intro");
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<string>("");
  const [confessionMode, setConfessionMode] = useState(false);
  const [theme, setTheme] = useState("romantic");
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [message, setMessage] = useState("");
  const [music, setMusic] = useState("piano");
  const [uploadedMusicBase64, setUploadedMusicBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const context = {
      name,
      relationship,
      theme,
      confessionMode,
      memoriesCount: memories.length,
      message,
    };
    sessionStorage.setItem("aura_ai_context", JSON.stringify(context));
    window.dispatchEvent(new Event("aura-ai-context"));
  }, [name, relationship, theme, confessionMode, memories.length, message]);

  const currentConfig = useMemo(
    () => templateConfigs.find((config) => config.id === theme),
    [theme]
  );

  const nextStep = (target: StepId) => setStep(target);
  const prevStep = (target: StepId) => setStep(target);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const newMemories = await Promise.all(
      files.map(
        (file) =>
          new Promise<MemoryItem>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                id: `${Date.now()}-${Math.random()}`,
                image: String(reader.result),
                caption: "",
                date: "",
              });
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          })
      )
    );
    setMemories((prev) => [...prev, ...newMemories]);
    event.target.value = "";
  };

  const updateMemory = (id: string, field: "caption" | "date", value: string) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleMusicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedMusicBase64(String(reader.result));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleGenerate = async () => {
    let finalMessage = message;
    let finalMemories = memories.slice();
    try {
      const tone =
        theme === "funny"
          ? "funny"
          : theme === "minimal"
          ? "minimal"
          : theme === "romantic" || theme === "pastel" || theme === "emotional"
          ? "romantic"
          : "premium";

      const res = await fetch("/api/ai/generate-birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          relationship,
          theme,
          tone,
          memories: memories.map((m) => ({ image: m.image, caption: m.caption || null })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!finalMessage || finalMessage.length < 40) {
          finalMessage = typeof data?.message === "string" ? data.message : finalMessage;
        }
        const captions: string[] = Array.isArray(data?.captions) ? data.captions : [];
        if (captions.length) {
          finalMemories = finalMemories.map((m, i) => ({
            ...m,
            caption: m.caption && m.caption.length > 0 ? m.caption : captions[i] || m.caption,
          }));
        }
      }
    } catch {
    }
    const payload = {
      name,
      relationship,
      confessionMode,
      memories: finalMemories,
      message: finalMessage,
      theme,
      music: uploadedMusicBase64 ?? music,
    };
    sessionStorage.setItem("ai_preview_payload", JSON.stringify(payload));
    setLocation("/ai-preview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Dynamic AI Websites
          </div>
          <h1 className="text-4xl font-semibold md:text-6xl break-words">
            Build a cinematic birthday surprise with AI.
          </h1>
          <p className="max-w-2xl text-white/70">
            This advanced builder crafts a premium experience based on relationship, vibe, and your story.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white/80">Guided Steps</div>
            <div className="mt-6 space-y-3 text-sm">
              {[
                { id: "intro", label: "Welcome" },
                { id: "recipient", label: "Recipient" },
                { id: "relationship", label: "Relationship" },
                { id: "vibe", label: "Aesthetic Vibe" },
                { id: "memories", label: "Memories" },
                { id: "message", label: "Message" },
                { id: "music", label: "Music" },
                { id: "review", label: "Generate" },
              ].map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                    step === item.id ? "bg-white/15 text-white" : "text-white/60"
                  }`}
                >
                  <span className="h-7 w-7 rounded-full bg-white/15 text-center text-xs leading-7">
                    {index + 1}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
            <AnimatePresence mode="wait">
              {step === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-6">
                    <h2 className="text-2xl font-semibold">Your story, elevated.</h2>
                    <p className="mt-2 text-white/70">
                      Move through a guided flow to build a premium, dynamic website in minutes.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      "AI-guided vibe selection",
                      "Dynamic layouts based on relationship",
                      "Cinematic reveal effects",
                      "Premium teaser generator",
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                        {item}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => nextStep("recipient")}
                    className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 min-h-11 w-full sm:w-auto"
                  >
                    Begin the AI Flow
                  </button>
                </motion.div>
              )}

              {step === "recipient" && (
                <motion.div
                  key="recipient"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Who is this for?</h2>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Recipient name"
                    className="h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-white placeholder:text-white/40"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => prevStep("intro")}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm min-h-11 w-full sm:w-auto"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep("relationship")}
                      disabled={!name}
                      className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 disabled:opacity-40 min-h-11 w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "relationship" && (
                <motion.div
                  key="relationship"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Choose your relationship</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {relationships.map((rel) => (
                      <button
                        type="button"
                        key={rel}
                        onClick={() => setRelationship(rel)}
                        className={`rounded-2xl border px-4 py-3 text-left ${
                          relationship === rel
                            ? "border-white/60 bg-white/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm text-white/80">Confession Mode</span>
                    <input
                      type="checkbox"
                      checked={confessionMode}
                      onChange={(event) => setConfessionMode(event.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => prevStep("recipient")}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep("vibe")}
                      disabled={!relationship}
                      className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "vibe" && (
                <motion.div
                  key="vibe"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Select the aesthetic vibe</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {templateConfigs.map((config) => {
                      const Icon = vibeIcons[config.id];
                      return (
                        <button
                          type="button"
                          key={config.id}
                          onClick={() => setTheme(config.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            theme === config.id
                              ? "border-white/60 bg-white/15"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-semibold">{config.label}</div>
                              <div className="text-xs text-white/60">
                                {config.layoutType} layout · {config.animationStyle} motion
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => prevStep("relationship")}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm min-h-11 w-full sm:w-auto"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep("memories")}
                      className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 min-h-11 w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "memories" && (
                <motion.div
                  key="memories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Add memories</h2>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm min-h-11 w-full sm:w-auto"
                    >
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Upload
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {memories.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center text-white/60"
                    >
                      <ImageIcon className="h-8 w-8" />
                      <p className="mt-3 text-sm">Upload your favorite moments</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {memories.map((memory) => (
                        <div key={memory.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <img src={memory.image} className="h-40 w-full rounded-2xl object-cover" />
                          <input
                            value={memory.caption ?? ""}
                            onChange={(event) => updateMemory(memory.id, "caption", event.target.value)}
                            placeholder="Caption"
                            className="mt-3 h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-white/40"
                          />
                          <input
                            value={memory.date ?? ""}
                            onChange={(event) => updateMemory(memory.id, "date", event.target.value)}
                            type="date"
                            className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => prevStep("vibe")}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm min-h-11 w-full sm:w-auto"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep("message")}
                      className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 min-h-11 w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "message" && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Write the birthday message</h2>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Write a heartfelt message..."
                    className="min-h-[200px] w-full rounded-3xl border border-white/10 bg-white/10 p-4 text-white placeholder:text-white/40"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => prevStep("memories")}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm min-h-11 w-full sm:w-auto"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep("music")}
                      className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 min-h-11 w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "music" && (
                <motion.div
                  key="music"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Select the music mood</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {tracks.map((track) => (
                      <button
                        type="button"
                        key={track.id}
                        onClick={() => setMusic(track.id)}
                        className={`rounded-2xl border p-4 text-left ${
                          music === track.id ? "border-white/60 bg-white/15" : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Music className="h-4 w-4" />
                          <div>
                            <div className="font-semibold">{track.name}</div>
                            <div className="text-xs text-white/60">{track.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => musicInputRef.current?.click()}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm min-h-11 w-full sm:w-auto"
                  >
                    Upload MP3
                  </button>
                  <input
                    ref={musicInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleMusicUpload}
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => prevStep("message")}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm min-h-11 w-full sm:w-auto"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep("review")}
                      className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 min-h-11 w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Generate your dynamic AI website</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/60">Recipient</div>
                      <div className="mt-2 text-lg font-semibold">{name || "Not set"}</div>
                      <div className="mt-2 text-sm text-white/60">
                        {relationship || "Relationship not set"} · {confessionMode ? "Confession Mode" : "Standard"}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/60">Vibe</div>
                      <div className="mt-2 text-lg font-semibold">
                        {currentConfig?.label ?? "Romantic"}
                      </div>
                      <div className="mt-2 text-sm text-white/60">
                        {memories.length} memories · {uploadedMusicBase64 ? "Custom music" : music}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 min-h-11 w-full sm:w-auto"
                  >
                    Generate Website
                  </button>
                  <button
                    type="button"
                    onClick={() => prevStep("music")}
                    className="rounded-full border border-white/20 px-6 py-2 text-sm min-h-11 w-full sm:w-auto"
                  >
                    Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
