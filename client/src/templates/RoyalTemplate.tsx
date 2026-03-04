import { motion } from "framer-motion";
import { ReactNode, Ref } from "react";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type RoyalTemplateProps = {
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

function getRoyalTagline(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Partner") {
    return confessionMode ? "A secret oath beneath golden light" : "An elegant tribute to my forever";
  }
  if (relationship === "Family") {
    return "A regal salute to the ones who raised me";
  }
  if (relationship === "Best Friend") {
    return "A royal roast for the court jester";
  }
  if (relationship === "Crush") {
    return confessionMode ? "A velvet confession, softly spoken" : "A royal wink from afar";
  }
  return "A gilded celebration for a shining soul";
}

export default function RoyalTemplate({
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
}: RoyalTemplateProps) {
  const tagline = getRoyalTagline(relationship, confessionMode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-amber-50">
      <section className="relative px-6 pb-16 pt-24">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="rounded-[2.5rem] border border-amber-400/40 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(251,191,36,0.2)]"
          >
            <div className="inline-flex items-center rounded-full border border-amber-300/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
              Royal Vibe
            </div>
            <h1 className="mt-5 font-serif text-5xl md:text-6xl">
              Happy Birthday {name || "Royal Star"}
            </h1>
            <p className="mt-3 text-lg text-amber-100/80">{tagline}</p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-amber-200/20 bg-slate-900/70 p-6">
                <h2 className="font-serif text-2xl">
                  Dearest {name || "you"} {relationship ? `(${relationship})` : ""}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-amber-100/80">
                  {message || "A regal message belongs here."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-amber-200/80">
                  {themeLabel && <span className="rounded-full border border-amber-200/40 px-3 py-1">Vibe: {themeLabel}</span>}
                  {musicLabel && <span className="rounded-full border border-amber-200/40 px-3 py-1">Soundtrack: {musicLabel}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={onCelebrate}
                  className="rounded-full bg-amber-400 px-8 py-4 text-slate-900 shadow-lg transition-transform hover:scale-105"
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
            <h2 className="font-serif text-3xl text-amber-100">Royal Gallery</h2>
            <p className="mt-2 text-sm text-amber-200/70">Moments fit for the crown.</p>
          </div>
          {memories.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={`${memory.image}-${index}`}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-amber-200/30 bg-slate-900/70 p-4 shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-amber-200/20">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-medium text-amber-100">{memory.caption}</div>
                    <div className="text-xs text-amber-200/70">{memory.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200/30 bg-slate-900/60 p-10 text-center text-sm text-amber-200/70">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
