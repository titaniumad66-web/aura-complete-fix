import { motion } from "framer-motion";
import { ReactNode, Ref } from "react";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type FunnyTemplateProps = {
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

function getFunnyHeadline(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Best Friend") {
    return "The ultimate chaos duo celebration";
  }
  if (relationship === "Family") {
    return "Family fun, maximum sparkle levels";
  }
  if (relationship === "Partner") {
    return confessionMode ? "Plot twist: I adore you" : "Birthday shenanigans for my favorite human";
  }
  if (relationship === "Crush") {
    return confessionMode ? "Emergency: confession alert" : "Birthday giggles incoming";
  }
  return "Giggles, glitter, and good vibes";
}

export default function FunnyTemplate({
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
}: FunnyTemplateProps) {
  const headline = getFunnyHeadline(relationship, confessionMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-emerald-50 text-slate-900">
      <section className="px-6 pb-16 pt-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[2.5rem] border-4 border-dashed border-emerald-400 bg-white/90 p-8 shadow-[0_20px_40px_rgba(16,185,129,0.25)]"
          >
            <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              Funny Mode
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Happy Birthday {name || "Legend"}
            </h1>
            <p className="mt-3 text-lg font-semibold text-emerald-700">
              {headline}
            </p>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-yellow-100 p-6 shadow-inner">
                <h2 className="text-xl font-bold">
                  Message for {name || "you"} {relationship ? `(${relationship})` : ""}
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-base text-slate-800">
                  {message || "Insert epic birthday message here."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                  {themeLabel && <span className="rounded-full bg-white px-3 py-1">Vibe: {themeLabel}</span>}
                  {musicLabel && <span className="rounded-full bg-white px-3 py-1">Soundtrack: {musicLabel}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={onCelebrate}
                  className="rounded-full bg-emerald-600 px-8 py-4 text-white shadow-lg transition-transform hover:-translate-y-1"
                >
                  Celebrate Now
                </button>
                {actions && <div className="space-y-3">{actions}</div>}
                {qr}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={memoryRef} className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black">Memory Stickers</h2>
            <p className="mt-2 text-sm text-emerald-700">Tap into the best bloopers.</p>
          </div>
          {memories.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={`${memory.image}-${index}`}
                  whileHover={{ rotate: -1, scale: 1.02 }}
                  className="rounded-3xl border-2 border-emerald-300 bg-white p-4 shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border-2 border-emerald-200">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3">
                    <div className="text-base font-bold">{memory.caption}</div>
                    <div className="text-xs text-emerald-700">{memory.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-emerald-300 bg-white/70 p-10 text-center text-sm text-emerald-700">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
