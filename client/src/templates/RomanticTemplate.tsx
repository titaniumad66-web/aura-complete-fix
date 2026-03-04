import { motion } from "framer-motion";
import { ReactNode, Ref } from "react";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type RomanticTemplateProps = {
  name?: string;
  relationship?: string;
  confessionMode?: boolean;
  message?: string;
  memories?: MemoryItem[];
  themeLabel?: string;
  musicLabel?: string;
  actions?: ReactNode;
  qr?: ReactNode;
  memoryRef?: Ref<HTMLElement>;
  onCelebrate: () => void;
};

function getRomanticHeadline(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Partner") {
    return confessionMode ? "A love note, softly revealed" : "To my favorite person";
  }
  if (relationship === "Best Friend") {
    return "Best friend energy, forever glowing";
  }
  if (relationship === "Family") {
    return "Home is in every memory with you";
  }
  if (relationship === "Crush") {
    return confessionMode ? "A shy little secret just for you" : "A sweet surprise for you";
  }
  return "A little romance, wrapped in memories";
}

export default function RomanticTemplate({
  name,
  relationship,
  confessionMode,
  message,
  memories = [],
  themeLabel,
  musicLabel,
  actions,
  qr,
  memoryRef,
  onCelebrate,
}: RomanticTemplateProps) {
  const headline = getRomanticHeadline(relationship, confessionMode);
  const hasMemories = memories.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 text-rose-950">
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <motion.div
          className="absolute -top-10 left-10 h-32 w-32 rounded-full bg-rose-200/60 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-pink-200/60 blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
              Birthday Romance
            </div>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight md:text-6xl">
              Happy Birthday {name || "Birthday Star"}
            </h1>
            <p className="mt-4 text-lg text-rose-700/90">{headline}</p>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur-md"
            >
              <h2 className="font-serif text-2xl">
                A message for {name || "you"}{" "}
                {relationship ? `(${relationship})` : ""}
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-rose-900/80">
                {message || "A beautiful message waits here."}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-rose-700/80">
                {themeLabel && <span className="rounded-full bg-rose-100 px-3 py-1">Vibe: {themeLabel}</span>}
                {musicLabel && <span className="rounded-full bg-rose-100 px-3 py-1">Soundtrack: {musicLabel}</span>}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-between gap-6"
            >
              <button
                type="button"
                onClick={onCelebrate}
                className="rounded-full bg-rose-600 px-8 py-4 text-white shadow-lg transition-transform hover:scale-105"
              >
                Celebrate Now
              </button>
              {actions && <div className="space-y-3">{actions}</div>}
              {qr}
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={memoryRef} className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="font-serif text-3xl">Memory Bouquet</h2>
            <p className="mt-2 text-sm text-rose-700/80">
              Soft moments, floating like petals.
            </p>
          </div>
          {hasMemories ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={`${memory.image}-${index}`}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-white/80 p-4 shadow-xl"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-medium text-rose-900">{memory.caption}</div>
                    <div className="text-xs text-rose-700/70">{memory.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-rose-100 bg-white/70 p-10 text-center text-sm text-rose-700/80">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
