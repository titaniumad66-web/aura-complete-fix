import { useMemo } from "react";
import { Link } from "wouter";
import { templateConfigMap } from "@/templates/ai/templateConfigs";
import RomanticLayout from "@/templates/ai/layouts/RomanticLayout";
import MinimalLayout from "@/templates/ai/layouts/MinimalLayout";
import PremiumLayout from "@/templates/ai/layouts/PremiumLayout";
import FunLayout from "@/templates/ai/layouts/FunLayout";

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type PreviewPayload = {
  name?: string;
  relationship?: string;
  confessionMode?: boolean;
  message?: string;
  memories?: MemoryItem[];
  theme?: keyof typeof templateConfigMap;
  music?: string;
};

function readPreviewPayload(): PreviewPayload | null {
  try {
    const stored = sessionStorage.getItem("ai_preview_payload");
    if (!stored) return null;
    return JSON.parse(stored) as PreviewPayload;
  } catch {
    return null;
  }
}

export default function AIPreviewWebsite() {
  const data = useMemo(() => readPreviewPayload(), []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">No preview data found</h1>
          <p className="text-muted-foreground">
            No preview data found. Please generate a website first.
          </p>
          <Link href="/ai-websites">
            <button
              type="button"
              className="rounded-full bg-foreground px-6 py-3 text-background font-medium"
            >
              Go to Dynamic AI Websites
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const themeKey =
    data.theme && data.theme in templateConfigMap ? data.theme : "romantic";
  const config = templateConfigMap[themeKey as keyof typeof templateConfigMap];
  const musicLabels: Record<string, string> = {
    piano: "Soft Piano Melody",
    lofi: "Lofi Chill Vibes",
    acoustic: "Acoustic Sunset",
    upbeat: "Upbeat Pop",
  };
  const musicLabel =
    typeof data.music === "string"
      ? data.music.startsWith("data:")
        ? "Custom Upload"
        : musicLabels[data.music] ?? data.music
      : undefined;

  const theme = themeKey as string;
  const musicSrc = typeof data.music === "string" && data.music.startsWith("data:") ? data.music : undefined;

  if (theme === "romantic" || theme === "pastel" || theme === "emotional") {
    return (
      <RomanticLayout
        name={data.name}
        relationship={data.relationship}
        message={data.message}
        memories={data.memories}
        musicSrc={musicSrc}
        musicLabel={musicLabel}
      />
    );
  }
  if (theme === "minimal") {
    return (
      <MinimalLayout
        name={data.name}
        relationship={data.relationship}
        message={data.message}
        memories={data.memories}
        musicSrc={musicSrc}
        musicLabel={musicLabel}
      />
    );
  }
  if (theme === "royal") {
    return (
      <PremiumLayout
        name={data.name}
        relationship={data.relationship}
        message={data.message}
        memories={data.memories}
        musicSrc={musicSrc}
        musicLabel={musicLabel}
      />
    );
  }
  return (
    <FunLayout
      name={data.name}
      relationship={data.relationship}
      message={data.message}
      memories={data.memories}
      musicSrc={musicSrc}
      musicLabel={musicLabel}
    />
  );
}
