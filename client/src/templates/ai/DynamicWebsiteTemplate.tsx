import { motion, type MotionProps } from "framer-motion";
import { ReactNode, Ref } from "react";
import type { TemplateConfig } from "./templateConfigs";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type DynamicWebsiteTemplateProps = {
  config: TemplateConfig;
  name?: string;
  relationship?: string;
  confessionMode?: boolean;
  message?: string;
  memories?: MemoryItem[];
  musicLabel?: string;
  onCelebrate: () => void;
  actions?: ReactNode;
  qr?: ReactNode;
  memoryRef?: Ref<HTMLElement>;
};

function getRelationshipCopy(relationship?: string, confessionMode?: boolean) {
  if (relationship === "Partner") {
    return confessionMode
      ? { title: "A secret I held close", note: "You make every day feel like home.", icon: "💗" }
      : { title: "To my favorite person", note: "Every moment with you is magic.", icon: "💞" };
  }
  if (relationship === "Best Friend") {
    return { title: "Best friend energy forever", note: "Chaos, laughs, and all the best memories.", icon: "✨" };
  }
  if (relationship === "Family") {
    return { title: "Family warmth, always", note: "Thank you for the love that never fades.", icon: "🏡" };
  }
  if (relationship === "Crush") {
    return confessionMode
      ? { title: "A shy little confession", note: "I hope this brings a smile.", icon: "🌙" }
      : { title: "A sweet surprise for you", note: "Just a little moment, just for you.", icon: "🌸" };
  }
  return { title: "A birthday made for you", note: "A story in color and light.", icon: "🎁" };
}

function getMotionStyle(animationStyle: TemplateConfig["animationStyle"]): MotionProps {
  if (animationStyle === "bounce") {
    return {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { type: "spring", stiffness: 120 },
    };
  }
  if (animationStyle === "float") {
    return {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.9 },
    };
  }
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  };
}

export default function DynamicWebsiteTemplate({
  config,
  name,
  relationship,
  confessionMode,
  message,
  memories = [],
  musicLabel,
  onCelebrate,
  actions,
  qr,
  memoryRef,
}: DynamicWebsiteTemplateProps) {
  const copy = getRelationshipCopy(relationship, confessionMode);
  const motionStyle = getMotionStyle(config.animationStyle);
  const heroLayout =
    config.layoutType === "centered"
      ? "flex flex-col items-center text-center"
      : config.layoutType === "stacked"
        ? "grid gap-8 lg:grid-cols-1"
        : "grid gap-10 lg:grid-cols-[1.1fr_0.9fr]";

  return (
    <div className={`min-h-screen ${config.background}`}>
      <section className="px-6 pb-16 pt-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...motionStyle} className={`${config.cardStyle} rounded-[2.5rem] p-8 ${config.font}`}>
            <div className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${config.accentSoft}`}>
              Dynamic AI Website · {config.label}
            </div>
            <div className={`mt-6 ${heroLayout}`}>
              <div>
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl break-words">
                  Happy Birthday {name || "Birthday Star"}
                </h1>
                <div className="mt-3 flex items-center gap-2 text-base text-slate-600">
                  <span>{copy.icon}</span>
                  <span className="font-medium">{copy.title}</span>
                </div>
                <p className="mt-3 text-lg text-slate-600">{copy.note}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
                  {relationship && <span className="rounded-full border border-white/70 px-3 py-1">Relationship: {relationship}</span>}
                  {musicLabel && <span className="rounded-full border border-white/70 px-3 py-1">Soundtrack: {musicLabel}</span>}
                </div>
                <button
                  type="button"
                  onClick={onCelebrate}
                  className="mt-8 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 min-h-11 w-full sm:w-auto"
                  style={{ backgroundColor: config.accentColor }}
                >
                  Celebrate Now
                </button>
                {actions && <div className="mt-6 space-y-3">{actions}</div>}
                {qr && <div className="mt-6">{qr}</div>}
              </div>

              <div className="rounded-3xl bg-white/80 p-6 shadow-xl">
                <h2 className="text-2xl font-semibold">
                  Message for {name || "you"} {relationship ? `(${relationship})` : ""}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                  {message || "A meaningful message belongs here."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={memoryRef} className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className={`text-3xl font-semibold ${config.font}`}>Memory Capsules</h2>
            <p className="mt-2 text-sm text-slate-500">Snapshots curated by your vibe.</p>
          </div>
          {memories.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {memories.map((memory, index) => (
                <motion.div
                  key={`${memory.image}-${index}`}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-white/90 p-4 shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <img src={memory.image} alt={memory.caption || "Memory"} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-sm font-semibold">{memory.caption}</div>
                    <div className="text-xs text-slate-500">{memory.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/70 bg-white/70 p-10 text-center text-sm text-slate-500">
              No memories added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
