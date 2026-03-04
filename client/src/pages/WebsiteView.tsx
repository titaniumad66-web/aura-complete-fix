import { useParams } from "wouter";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import RomanticTemplate from "@/templates/RomanticTemplate";
import EmotionalTemplate from "@/templates/EmotionalTemplate";
import FunnyTemplate from "@/templates/FunnyTemplate";
import RoyalTemplate from "@/templates/RoyalTemplate";
import MinimalTemplate from "@/templates/MinimalTemplate";
import PastelTemplate from "@/templates/PastelTemplate";

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

type MemoryItem = {
  image: string;
  caption?: string;
  date?: string;
};

type WebsiteContent = {
  name?: string;
  relationship?: string;
  confessionMode?: boolean;
  message?: string;
  theme?: string;
  memories?: MemoryItem[];
  music?: string;
  musicBase64?: string;
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
  let offsetY = y;
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, offsetY);
      line = words[i];
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, offsetY);
  }
  return offsetY;
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 0.25
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 3);
  ctx.bezierCurveTo(x - size / 2, y + size, x, y + size * 1.2, x, y + size * 1.5);
  ctx.bezierCurveTo(x, y + size * 1.2, x + size / 2, y + size, x + size / 2, y + size / 3);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawConfetti(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const colors = ["#f97316", "#f43f5e", "#facc15", "#22c55e", "#38bdf8"];
  for (let i = 0; i < 120; i++) {
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

  for (let i = 0; i < count; i++) {
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

  const tick = (t: number) => {
    const elapsed = t - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;

      // Fade out near the end
      const life = 1 - Math.min(1, elapsed / durationMs);
      const alpha = Math.max(0, life);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    }

    if (elapsed < durationMs) {
      raf = requestAnimationFrame(tick);
    } else {
      cleanup();
    }
  };

  const cleanup = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    canvas.remove();
  };

  raf = requestAnimationFrame(tick);
}

export default function WebsiteView() {
  const { id } = useParams();
  const [data, setData] = useState<WebsiteContent | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const [teaserUrl, setTeaserUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const memoriesRef = useRef<HTMLElement | null>(null);

  const publishedJustNow =
    new URLSearchParams(window.location.search).get("published") === "1";

  const sharePath = id ? `/w/${id}` : "";
  const shareUrl = id ? `${window.location.origin}${sharePath}` : "";

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
      return;
    } catch {
      // Fallback for older browsers / insecure contexts.
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

  const musicSrc =
    data?.musicBase64 && typeof data.musicBase64 === "string"
      ? data.musicBase64
      : data?.music
        ? typeof data.music === "string" && data.music.startsWith("data:")
          ? data.music
          : `/music/${data.music}.mp3`
        : null;

  useEffect(() => {
    setLoadError(false);
    fetch(`/api/websites/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res?.content || typeof res.content !== "string") {
          setData(null);
          setLoadError(true);
          return;
        }
        try {
          setData(JSON.parse(res.content));
        } catch {
          setData(null);
          setLoadError(true);
        }
      })
      .catch(() => {
        setData(null);
        setLoadError(true);
      });
  }, [id]);

  const handleOpenSurprise = async () => {
    setOpened(true);
    launchConfetti();

    try {
      if (audioRef.current && musicSrc) {
        audioRef.current.loop = true;
        // Ensure src is set before playing (important on iOS).
        if (audioRef.current.src !== musicSrc) {
          audioRef.current.src = musicSrc;
        }
        await audioRef.current.play();
      }
    } catch (err) {
      // Autoplay can still be blocked in some contexts; don't fail the reveal.
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

  const handleGenerateTeaser = async () => {
    if (!data || !id || isGenerating) return;
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
    const headline = "Something special is waiting...";
    const subtext = `A birthday surprise has been created for ${name} 🎉`;
    const linkLabel = "Open your surprise:";
    const linkText = `/w/${id}`;

    if (style === "romantic") {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#fde2e7");
      gradient.addColorStop(0.5, "#fbcfe8");
      gradient.addColorStop(1, "#fef3c7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 18; i++) {
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
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(80 + i * 160, 120, 8, canvas.height - 240);
      }
      ctx.restore();
    }

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
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(160, 360, canvas.width - 320, 760);
        ctx.restore();
      }
    }

    ctx.fillStyle = style === "premium" ? "#fbbf24" : "#111827";
    ctx.font = "700 80px 'Playfair Display', serif";
    wrapText(ctx, headline, 120, 140, canvas.width - 240, 92);

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#1f2937";
    ctx.font = "500 44px 'Inter', sans-serif";
    const subtextY = wrapText(ctx, subtext, 120, 1040, canvas.width - 240, 58) + 50;

    ctx.fillStyle = style === "premium" ? "#fbbf24" : "#111827";
    ctx.font = "600 36px 'Inter', sans-serif";
    ctx.fillText(linkLabel, 120, subtextY);

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#0f172a";
    ctx.font = "700 42px 'Inter', sans-serif";
    ctx.fillText(linkText, 120, subtextY + 56);

    ctx.fillStyle = style === "premium" ? "#f8fafc" : "#334155";
    ctx.font = "500 30px 'Inter', sans-serif";
    ctx.fillText("Made with Aura ✨", 120, canvas.height - 90);

    const url = canvas.toDataURL("image/png");
    setTeaserUrl(url);
    setIsGenerating(false);
  };

  const shareMessage = "Check this birthday surprise 🎉";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `${shareMessage} ${shareUrl}`
  )}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareMessage
  )}&url=${encodeURIComponent(shareUrl)}`;
  const content = data;
  const themeKey = content?.theme ?? "romantic";
  const templates = {
    romantic: RomanticTemplate,
    emotional: EmotionalTemplate,
    funny: FunnyTemplate,
    royal: RoyalTemplate,
    minimal: MinimalTemplate,
    pastel: PastelTemplate,
  } as const;
  const TemplateComponent =
    templates[themeKey as keyof typeof templates] ?? RomanticTemplate;
  const themeLabels: Record<string, string> = {
    romantic: "Romantic",
    emotional: "Emotional",
    funny: "Funny",
    royal: "Royal",
    minimal: "Minimal",
    pastel: "Soft Pastel",
  };
  const musicLabels: Record<string, string> = {
    piano: "Soft Piano Melody",
    lofi: "Lofi Chill Vibes",
    acoustic: "Acoustic Sunset",
    upbeat: "Upbeat Pop",
  };
  const musicValue = content?.musicBase64 || content?.music;
  const musicLabel =
    typeof musicValue === "string"
      ? musicValue.startsWith("data:")
        ? "Custom Upload"
        : musicLabels[musicValue] ?? musicValue
      : undefined;
  const themeLabel = content?.theme ? themeLabels[content.theme] ?? content.theme : undefined;
  const actions = content ? (
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
            download={`birthday-teaser-${id}.png`}
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
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="bg-white text-black px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/10"
        >
          Share on WhatsApp
        </a>
        <a
          href={twitterHref}
          target="_blank"
          rel="noreferrer"
          className="bg-white text-black px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/10"
        >
          Share on Twitter (X)
        </a>
        <button
          type="button"
          onClick={handleReplaySurprise}
          className="bg-black text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Replay Surprise 🎁
        </button>
      </div>
    </div>
  ) : null;
  const qrNode = shareUrl ? (
    <div className="flex flex-col items-start gap-3">
      <div className="rounded-2xl bg-white/80 p-4 shadow-lg border border-white/60">
        <QRCodeCanvas value={shareUrl} size={160} includeMargin />
      </div>
      <p className="text-sm text-gray-600">Scan to open this birthday surprise</p>
    </div>
  ) : null;

  return (
    <div
      className={`min-h-screen bg-[#f5f2ef] text-gray-800 ${
        opened ? "overflow-auto" : "overflow-hidden"
      }`}
    >
      {/* Surprise gate */}
      {!opened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100" />
          <div className="absolute top-20 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-orange-200 rounded-full blur-3xl opacity-40" />

          <div className="relative w-full max-w-xl text-center">
            <div className="text-sm font-semibold tracking-wide text-gray-600">
              Birthday Surprise
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-serif leading-tight break-words">
              Tap to Open Your Surprise
            </h1>
            <p className="mt-4 text-gray-600">
              A little moment made just for you.
            </p>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleOpenSurprise}
                className="bg-black text-white px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform min-h-12 w-full sm:w-auto"
              >
                Tap to Open Your Surprise
              </button>
            </div>
          </div>
        </div>
      )}

      {opened && publishedJustNow && id && (
        <div className="fixed left-1/2 top-6 z-50 w-[min(720px,calc(100%-2rem))] -translate-x-1/2">
          <div className="rounded-3xl border border-white/50 bg-white/70 p-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-semibold">Website Published</div>
                <div className="mt-1 truncate text-sm text-gray-600">
                  <span className="font-mono">{sharePath}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyLink}
                  type="button"
                  className="bg-black text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only reveal site after opening */}
      {opened && (
        <>
          {!content && !loadError ? (
            <div className="h-screen flex items-center justify-center text-xl">
              Loading...
            </div>
          ) : loadError ? (
            <div className="h-screen flex items-center justify-center text-xl">
              This birthday surprise is unavailable right now.
            </div>
          ) : (
            content && (
              <TemplateComponent
                name={content.name}
                relationship={content.relationship}
                confessionMode={Boolean(content.confessionMode)}
                message={content.message}
                memories={content.memories}
                themeLabel={themeLabel}
                musicLabel={musicLabel}
                actions={actions}
                qr={qrNode}
                memoryRef={memoriesRef}
                onCelebrate={handleCelebrateNow}
              />
            )
          )}
        </>
      )}

      {/* Audio is prepared immediately, but only played on user tap */}
      {musicSrc && (
        <audio ref={audioRef} preload="auto" src={musicSrc} />
      )}

    </div>
  );
}
