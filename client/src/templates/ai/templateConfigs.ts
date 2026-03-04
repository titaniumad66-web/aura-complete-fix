export type TemplateConfig = {
  id: "romantic" | "emotional" | "funny" | "royal" | "minimal" | "pastel";
  label: string;
  background: string;
  font: string;
  accentColor: string;
  accentSoft: string;
  layoutType: "split" | "stacked" | "centered";
  animationStyle: "float" | "fade" | "bounce";
  cardStyle: string;
};

export const templateConfigs: TemplateConfig[] = [
  {
    id: "romantic",
    label: "Romantic",
    background: "bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50",
    font: "font-serif",
    accentColor: "#fb7185",
    accentSoft: "bg-rose-100/80 text-rose-700",
    layoutType: "split",
    animationStyle: "float",
    cardStyle: "bg-white/80 border border-white/60 shadow-2xl",
  },
  {
    id: "emotional",
    label: "Emotional",
    background: "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50",
    font: "font-serif",
    accentColor: "#f97316",
    accentSoft: "bg-orange-100/80 text-orange-700",
    layoutType: "stacked",
    animationStyle: "fade",
    cardStyle: "bg-white/85 border border-white/70 shadow-xl",
  },
  {
    id: "funny",
    label: "Funny",
    background: "bg-gradient-to-br from-yellow-50 via-lime-50 to-emerald-50",
    font: "font-sans",
    accentColor: "#10b981",
    accentSoft: "bg-emerald-100/80 text-emerald-700",
    layoutType: "centered",
    animationStyle: "bounce",
    cardStyle: "bg-white/90 border-2 border-emerald-200 shadow-[0_20px_40px_rgba(16,185,129,0.2)]",
  },
  {
    id: "royal",
    label: "Royal",
    background: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-amber-50",
    font: "font-serif",
    accentColor: "#fbbf24",
    accentSoft: "bg-amber-200/20 text-amber-100",
    layoutType: "split",
    animationStyle: "float",
    cardStyle: "bg-slate-900/70 border border-amber-200/30 shadow-[0_30px_80px_rgba(251,191,36,0.18)]",
  },
  {
    id: "minimal",
    label: "Minimal",
    background: "bg-white text-slate-900",
    font: "font-sans",
    accentColor: "#0f172a",
    accentSoft: "bg-slate-100 text-slate-600",
    layoutType: "split",
    animationStyle: "fade",
    cardStyle: "bg-white border border-slate-200 shadow-lg",
  },
  {
    id: "pastel",
    label: "Soft Pastel",
    background: "bg-gradient-to-br from-sky-50 via-fuchsia-50 to-rose-50",
    font: "font-serif",
    accentColor: "#a855f7",
    accentSoft: "bg-fuchsia-100/80 text-fuchsia-700",
    layoutType: "stacked",
    animationStyle: "float",
    cardStyle: "bg-white/85 border border-white/70 shadow-2xl",
  },
];

export const templateConfigMap = Object.fromEntries(
  templateConfigs.map((config) => [config.id, config])
) as Record<TemplateConfig["id"], TemplateConfig>;
