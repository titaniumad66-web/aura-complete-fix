import { motion } from "framer-motion";
import { ReactNode, Ref } from "react";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type PastelTemplateProps = {
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

function getPastelMessage(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Partner") {
    return confessionMode ? "Pastel dreams and soft confessions." : "Sweet pastel skies for my love.";
  }
  if (relationship === "Best Friend") {
    return "Bubbly memories with my favorite person.";
  }
  if (relationship === "Family") {
    return "A soft hug wrapped in color.";
  }
  if (relationship === "Crush") {
    return confessionMode ? "A tiny pastel whisper from afar." : "A gentle surprise just for you.";
  }
  return "Dreamy gradients and gentle wishes.";
}

export default function PastelTemplate({
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
}: PastelTemplateProps) {
  const pastelLine = getPastelMessage(relationship, confessionMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-fuchsia-50 to-rose-50 text-slate-800">
      <section className="relative px-6 pb-16 pt-20">
        <motion.div
          className="absolute left-10 top-10 h-32 w-32 rounded-full bg-sky-200/60 blur-3xl"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-6 bottom-12 h-36 w-36 rounded-full bg-fuchsia-200/60 blur-3xl"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-fuchsia-700">
              Soft Pastel Vibe
            </div>
            <h1 className="mt-5 font-serif text-5xl font-semibold md:text-6xl">
              Happy Birthday {name || "Sweetheart"}
            </h1>
            <p className="mt-3 text-lg text-slate-600">{pastelLine}</p>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-[2.5rem] bg-white/80 p-7 shadow-2xl"
            >
              <h2 className="font-serif text-2xl">
                A note for {name || "you"} {relationship ? `(${relationship})` : ""}
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                {message || "Soft words and gentle wishes belong here."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
                {themeLabel && <span className="rounded-full bg-slate-100 px-3 py-1">Vibe: {themeLabel}</span>}
                {musicLabel && <span className="rounded-full bg-slate-100 px-3 py-1">Soundtrack: {musicLabel}</span>}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-5"
            >
              <button
                type="button"
                onClick={onCelebrate}
                className="rounded-full bg-fuchsia-500 px-8 py-4 text-white shadow-lg transition-transform hover:scale-105"
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
            <h2 className="font-serif text-3xl">Dreamy Gallery</h2>
            <p className="mt-2 text-sm text-slate-500">Floating memories in pastel light.</p>
          </div>
          {memories.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={`${memory.image}-${index}`}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-white/85 p-4 shadow-xl"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-medium text-slate-700">{memory.caption}</div>
                    <div className="text-xs text-slate-500">{memory.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-sm text-slate-500">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
