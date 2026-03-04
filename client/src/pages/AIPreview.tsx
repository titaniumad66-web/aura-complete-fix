import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
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

type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  va: number;
  color: string;
};

type TeaserStyle = "romantic" | "funny" | "premium";

function pickTeaserStyle(theme?: string): TeaserStyle {
  if (theme === "funny") return "funny";
  if (theme === "romantic" || theme === "pastel" || theme === "emotional") {
    return "romantic";
  }
  return "premium";
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = `${words[i]} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(
    x,
    y,
    x - size / 2,
    y,
    x - size / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x - size / 2,
    y + (size + topCurveHeight) / 2,
    x,
    y + (size + topCurveHeight) / 2,
    x,
    y + size
  );
  ctx.bezierCurveTo(
    x,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + size / 2,
    y,
    x,
    y,
    x,
    y + topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawConfetti(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const colors = ["#f97316", "#f43f5e", "#facc15", "#22c55e", "#38bdf8"];
  for (let i = 0; i < 120; i += 1) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = colors[i % colors.length];
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = 10 + Math.random() * 16;
    const h = 8 + Math.random() * 12;
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 1.5);
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

function launchConfetti(durationMs = 1600) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "60";
  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
    canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };
  resize();

  const colors = ["#fb7185", "#fbbf24", "#a78bfa", "#60a5fa", "#34d399"];
  const particles: ConfettiParticle[] = [];
  const count = 160;

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 80,
      y: window.innerHeight * 0.25 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 9 - 3,
      r: Math.random() * 5 + 3,
      a: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  const gravity = 0.28;
  const start = performance.now();
  let raf = 0;

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of particles) {
      particle.vy += gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.a += particle.va;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.a);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.r, -particle.r, particle.r * 2, particle.r * 2);
      ctx.restore();
    }

    if (performance.now() - start < durationMs) {
      raf = requestAnimationFrame(tick);
      return;
    }

    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    canvas.remove();
  };
  raf = requestAnimationFrame(tick);
}

function decodePreviewPayload(encoded: string): PreviewPayload | null {
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as Partial<PreviewPayload>;
    if (typeof parsed !== "object" || !parsed) return null;
    return parsed as PreviewPayload;
  } catch {
    return null;
  }
}

export default function AIPreview() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");
  const incoming = encoded ? decodePreviewPayload(encoded) : null;

  const [opened, setOpened] = useState(false);
  const [teaserUrl, setTeaserUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const memoriesRef = useRef<HTMLElement | null>(null);

  const data = incoming ?? {
    name: "Avery",
    relationship: "Best Friend",
    confessionMode: false,
    message:
      "Happy Birthday! You make life brighter in every possible way. Here’s to more adventures and more laughs.",
    memories: [],
    theme: "romantic",
    music: "upbeat",
  };

  const themeKey = data.theme && data.theme in templateConfigMap ? data.theme : "romantic";
  const config = templateConfigMap[themeKey as keyof typeof templateConfigMap];
  const shareUrl = window.location.href;

  const musicSrc =
    data.music && typeof data.music === "string"
      ? data.music.startsWith("data:")
        ? data.music
        : `/music/${data.music}.mp3`
      : null;

  const handleOpenSurprise = async () => {
    setOpened(true);
    launchConfetti();
    try {
      if (audioRef.current && musicSrc) {
        audioRef.current.loop = true;
        if (audioRef.current.src !== musicSrc) {
          audioRef.current.src = musicSrc;
        }
        await audioRef.current.play();
      }
    } catch {
      return;
    }
  };

  const handleCelebrateNow = () => {
    if (memoriesRef.current) {
      memoriesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleReplaySurprise = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setOpened(false);
    window.setTimeout(() => {
      handleOpenSurprise();
    }, 120);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      const el = document.createElement("textarea");
      el.value = shareUrl;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      el.style.top = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      } finally {
        document.body.removeChild(el);
      }
    }
  };

  const handleGenerateTeaser = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setTeaserUrl(null);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    const style = pickTeaserStyle(data?.theme);
    const name = data?.name || "Someone special";
    const headline = "A dynamic birthday surprise awaits";
    const subtext = `An AI-crafted experience is ready for ${name}.`;
    const linkLabel = "Open the surprise:";
    const linkText = shareUrl;

    if (style === "romantic") {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#fde2e7");
      gradient.addColorStop(0.5, "#fbcfe8");
      gradient.addColorStop(1, "#fef3c7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 18; i += 1) {
        drawHeart(
          ctx,
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.9,
          40 + Math.random() * 80,
          "#fb7185",
          0.2
        );
      }
    }

    if (style === "funny") {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#fef08a");
      gradient.addColorStop(0.5, "#fca5a5");
      gradient.addColorStop(1, "#a7f3d0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawConfetti(ctx, canvas.width, canvas.height);
    }

    if (style === "premium") {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.6, "#1f2937");
      gradient.addColorStop(1, "#111827");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#fbbf24";
      for (let i = 0; i < 6; i += 1) {
        ctx.fillRect(80 + i * 160, 120, 8, canvas.height - 240);
      }
      ctx.restore();
    }

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#1f2937";
    ctx.font = "700 80px 'Playfair Display', serif";
    wrapText(ctx, headline, 120, 140, canvas.width - 240, 92);

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#1f2937";
    ctx.font = "500 44px 'Inter', sans-serif";
    const subtextY = wrapText(ctx, subtext, 120, 1040, canvas.width - 240, 58) + 50;

    ctx.fillStyle = style === "premium" ? "#fbbf24" : "#111827";
    ctx.font = "600 36px 'Inter', sans-serif";
    ctx.fillText(linkLabel, 120, subtextY);

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#0f172a";
    ctx.font = "700 34px 'Inter', sans-serif";
    wrapText(ctx, linkText, 120, subtextY + 56, canvas.width - 240, 46);

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#334155";
    ctx.font = "500 30px 'Inter', sans-serif";
    ctx.fillText("Made with Aura ✨", 120, canvas.height - 90);

    const memoryImage = data?.memories?.[0]?.image;
    if (memoryImage) {
      try {
        const img = await loadImage(memoryImage);
        const imgWidth = 760;
        const imgHeight = 920;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = 280;
        const radius = 40;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(imgX + radius, imgY);
        ctx.lineTo(imgX + imgWidth - radius, imgY);
        ctx.quadraticCurveTo(imgX + imgWidth, imgY, imgX + imgWidth, imgY + radius);
        ctx.lineTo(imgX + imgWidth, imgY + imgHeight - radius);
        ctx.quadraticCurveTo(
          imgX + imgWidth,
          imgY + imgHeight,
          imgX + imgWidth - radius,
          imgY + imgHeight
        );
        ctx.lineTo(imgX + radius, imgY + imgHeight);
        ctx.quadraticCurveTo(imgX, imgY + imgHeight, imgX, imgY + imgHeight - radius);
        ctx.lineTo(imgX, imgY + radius);
        ctx.quadraticCurveTo(imgX, imgY, imgX + radius, imgY);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();
      } catch {
        return;
      }
    }

    const url = canvas.toDataURL("image/png");
    setTeaserUrl(url);
    setIsGenerating(false);
  };

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

  const actions = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateTeaser}
          disabled={isGenerating}
          className="bg-white text-black px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/10 disabled:opacity-60"
        >
          {isGenerating ? "Generating..." : "Generate Instagram Teaser"}
        </button>
        {teaserUrl && (
          <a
            href={teaserUrl}
            download="ai-teaser.png"
            className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Download Instagram Story
          </a>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyLink}
          className="bg-white text-black px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/10"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button
          type="button"
          onClick={handleReplaySurprise}
          className="bg-black text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Replay Surprise 🎁
        </button>
      </div>
    </div>
  );

  const qrNode = shareUrl ? (
    <div className="flex flex-col items-start gap-3">
      <div className="rounded-2xl bg-white/80 p-4 shadow-lg border border-white/60">
        <QRCodeCanvas value={shareUrl} size={160} includeMargin />
      </div>
      <p className="text-sm text-gray-600">Scan to open this AI surprise</p>
    </div>
  ) : null;

  useEffect(() => {
    if (!opened && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [opened]);

  return (
    <div className={`min-h-screen ${config.background} ${opened ? "overflow-auto" : "overflow-hidden"}`}>
      {!opened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="relative w-full max-w-xl text-center text-white">
            <div className="text-sm font-semibold tracking-wide text-white/70">
              Dynamic AI Surprise
            </div>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Tap to Open Your Surprise
            </h1>
            <p className="mt-4 text-white/70">
              A premium experience generated just for this moment.
            </p>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleOpenSurprise}
                className="bg-white text-black px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                Tap to Open Your Surprise
              </button>
            </div>
          </div>
        </div>
      )}

      {opened && (
        <DynamicWebsiteTemplate
          config={config}
          name={data.name}
          relationship={data.relationship}
          confessionMode={Boolean(data.confessionMode)}
          message={data.message}
          memories={data.memories}
          musicLabel={musicLabel}
          actions={actions}
          qr={qrNode}
          memoryRef={memoriesRef}
          onCelebrate={handleCelebrateNow}
        />
      )}

      {musicSrc && <audio ref={audioRef} preload="auto" src={musicSrc} />}
    </div>
  );
}
