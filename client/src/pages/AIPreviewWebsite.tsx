import { useMemo } from "react";
import { Link } from "wouter";
import DynamicWebsiteTemplate from "@/templates/ai/DynamicWebsiteTemplate";
import { templateConfigMap } from "@/templates/ai/templateConfigs";

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

  return (
    <DynamicWebsiteTemplate
      config={config}
      name={data.name}
      relationship={data.relationship}
      confessionMode={Boolean(data.confessionMode)}
      message={data.message}
      memories={data.memories}
      musicLabel={musicLabel}
      onCelebrate={() => null}
    />
  );
}
