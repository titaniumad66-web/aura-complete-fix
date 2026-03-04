import { motion } from "framer-motion";
import { ReactNode, Ref } from "react";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type MinimalTemplateProps = {
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

function getMinimalSubtitle(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Partner") {
    return confessionMode ? "A simple confession, softly delivered." : "A clean, honest celebration.";
  }
  if (relationship === "Best Friend") {
    return "Minimal design, maximum friendship.";
  }
  if (relationship === "Family") {
    return "Warm notes, clean lines.";
  }
  if (relationship === "Crush") {
    return confessionMode ? "Quiet words, loud feelings." : "A small surprise with big meaning.";
  }
  return "A modern, quiet celebration.";
}

export default function MinimalTemplate({
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
}: MinimalTemplateProps) {
  const subtitle = getMinimalSubtitle(relationship, confessionMode);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="px-6 pb-14 pt-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Minimal Vibe
              </div>
              <h1 className="mt-4 text-5xl font-semibold md:text-6xl">
                Happy Birthday {name || "Friend"}
              </h1>
              <p className="mt-3 text-lg text-slate-500">{subtitle}</p>
              <button
                type="button"
                onClick={onCelebrate}
                className="mt-8 rounded-full border border-slate-900 px-8 py-3 text-sm font-medium transition-colors hover:bg-slate-900 hover:text-white"
              >
                Celebrate Now
              </button>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
                {themeLabel && <span className="rounded-full border border-slate-200 px-3 py-1">Vibe: {themeLabel}</span>}
                {musicLabel && <span className="rounded-full border border-slate-200 px-3 py-1">Soundtrack: {musicLabel}</span>}
              </div>
              {actions && <div className="mt-6 space-y-3">{actions}</div>}
              {qr && <div className="mt-6">{qr}</div>}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-medium">
                Message for {name || "you"} {relationship ? `(${relationship})` : ""}
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-600">
                {message || "A clear message lands here."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={memoryRef} className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">Memory Cards</h2>
            <p className="mt-2 text-sm text-slate-500">Clean layouts, timeless moments.</p>
          </div>
          {memories.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={`${memory.image}-${index}`}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-sm font-medium">{memory.caption}</div>
                    <div className="text-xs text-slate-500">{memory.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
