import { motion } from "framer-motion";
import { ReactNode, Ref } from "react";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type EmotionalTemplateProps = {
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

function getEmotionalLead(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Family") {
    return "A warm thank-you for every gentle moment.";
  }
  if (relationship === "Best Friend") {
    return "Every laugh, every late-night story, all cherished.";
  }
  if (relationship === "Partner") {
    return confessionMode ? "A tender truth, spoken softly." : "A quiet love, spoken clearly.";
  }
  if (relationship === "Crush") {
    return confessionMode ? "A shy note that finally found its way." : "A kind thought, sent with a smile.";
  }
  return "A heartfelt celebration in soft focus.";
}

export default function EmotionalTemplate({
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
}: EmotionalTemplateProps) {
  const lead = getEmotionalLead(relationship, confessionMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-white text-slate-800">
      <section className="px-6 pb-16 pt-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-amber-700">
              Emotional Vibe
            </div>
            <h1 className="mt-5 font-serif text-5xl font-medium md:text-6xl">
              Happy Birthday {name || "Lovely Soul"}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{lead}</p>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl bg-white/85 p-7 shadow-xl"
            >
              <h2 className="font-serif text-2xl">
                Dear {name || "you"} {relationship ? `(${relationship})` : ""}
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                {message || "A gentle message belongs here."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
                {themeLabel && <span className="rounded-full bg-slate-100 px-3 py-1">Vibe: {themeLabel}</span>}
                {musicLabel && <span className="rounded-full bg-slate-100 px-3 py-1">Soundtrack: {musicLabel}</span>}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-5"
            >
              <button
                type="button"
                onClick={onCelebrate}
                className="rounded-full bg-slate-900 px-8 py-4 text-white shadow-lg transition-transform hover:scale-105"
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
          <div className="mb-6 flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl">Memory Journal</h2>
            <p className="mt-2 text-sm text-slate-500">
              Gentle scenes, softly unfolding.
            </p>
          </div>
          {memories.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.article
                  key={`${memory.image}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-1 p-5">
                    <div className="font-medium">{memory.caption}</div>
                    <div className="text-xs text-slate-500">{memory.date}</div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-sm text-slate-500">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
