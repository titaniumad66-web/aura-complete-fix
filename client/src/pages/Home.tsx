import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Music,
  Heart,
  Download,
  Share2,
  QrCode,
  RefreshCcw,
  Gift,
  PlayCircle,
} from "lucide-react";

import heroBg from "@/assets/images/hero-bg.png";
import story1 from "@/assets/images/story-1.png";
import story2 from "@/assets/images/story-2.png";
import gift1 from "@/assets/images/gift-1.png";
import gift2 from "@/assets/images/gift-2.png";

type TemplateItem = { id: string; title: string; imageUrl: string };

type HeroSectionProps = {
  onPrimaryHref: string;
  onSecondaryHref: string;
};

function HeroSection({ onPrimaryHref, onSecondaryHref }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#fef6f8] via-[#f9f7ff] to-[#eef7ff]">
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          src={heroBg}
          alt="Aura background"
          className="w-full h-full object-cover"
        />
      </div>
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl"
      />
      <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-5 py-2 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-primary" />
            The premium way to gift a birthday surprise
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-semibold leading-tight tracking-tight">
            Create Magical Birthday Surprise Websites
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed">
            Design unforgettable birthday experiences with memories, music, and surprise reveals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={onPrimaryHref}>
              <button
                type="button"
                className="h-14 w-full sm:w-auto px-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Create Your Surprise <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href={onSecondaryHref}>
              <button
                type="button"
                className="h-14 w-full sm:w-auto px-10 rounded-full bg-white/70 border border-white/50 text-foreground hover:bg-white transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg"
              >
                Explore Templates
              </button>
            </Link>
          </div>
          <Link href="/preview">
            <button
              type="button"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Watch the demo experience
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

type StepItem = { title: string; description: string; icon: ComponentType<{ className?: string }> };

function HowItWorksSection({ steps }: { steps: StepItem[] }) {
  return (
    <section className="min-h-screen flex items-center bg-background">
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-4">
            How Aura Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4">
            Three steps to a breathtaking surprise
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Move from idea to shared experience in minutes, with every detail feeling premium and intentional.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur-md hover:-translate-y-1 transition-transform"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-serif font-medium mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureItem = { title: string; description: string; icon: ComponentType<{ className?: string }> };

function FeaturesSection({ features }: { features: FeatureItem[] }) {
  return (
    <section className="min-h-screen flex items-center bg-secondary/30">
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-3">
              Features
            </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4">
              Premium moments, crafted automatically
            </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
              Every feature is designed to make sharing the birthday surprise feel effortless and unforgettable.
            </p>
          </div>
          <Link href="/create">
            <button
              type="button"
              className="h-12 w-full sm:w-auto px-8 rounded-full bg-foreground text-background font-medium shadow-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2"
            >
              Start creating <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </motion.div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="rounded-3xl border border-border/50 bg-white/70 p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ShowcaseItem = { title: string; image: string };

function TemplatesSection({ showcase }: { showcase: ShowcaseItem[] }) {
  return (
    <section className="min-h-screen flex items-center bg-background">
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-3">
            Template Showcase
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4">
            A birthday website aesthetic for every vibe
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Choose from premium layouts that feel handcrafted for the moment.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {showcase.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-3xl overflow-hidden border border-white/50 bg-white/70 shadow-xl hover:-translate-y-1 transition-transform"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="p-4 space-y-3 text-center">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/templates">
                    <button
                      type="button"
                      className="rounded-full border border-border px-4 py-1 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-10"
                    >
                      View
                    </button>
                  </Link>
                  <a
                    href={item.image}
                    download
                    className="rounded-full bg-foreground px-4 py-1 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors min-h-10 inline-flex items-center justify-center"
                  >
                    Download
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialTeasersSection({
  templates,
  templatesError,
}: {
  templates: TemplateItem[];
  templatesError: boolean;
}) {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-3">
              Social Teasers
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4">
              Tease the surprise in style
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
              Download Instagram-ready templates and share the excitement.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-base sm:text-lg font-medium hover:text-primary transition-colors flex flex-wrap items-center gap-2 border-b-2 border-primary/30 pb-1"
          >
            View all templates <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {templatesError ? (
          <div className="text-muted-foreground text-lg">
            Templates are unavailable right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {templates.slice(0, 4).map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative rounded-2xl overflow-hidden aspect-[9/16] shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={story.imageUrl}
                  alt={story.title || `Template ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-end text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <a
                    href={story.imageUrl}
                    download
                    className="flex flex-col items-center text-white"
                  >
                    <Download className="w-8 h-8 text-white mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                    <span className="text-sm font-medium">Download</span>
                  </a>
                  <p className="text-white font-medium text-lg">
                    {story.title || `Template ${index + 1}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="min-h-screen flex items-center bg-background">
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-primary/70">
              Aura AI
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold">
              Meet Aura AI
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              A smart assistant that helps you design the perfect birthday surprise with
              theme guidance, message polish, and creative ideas.
            </p>
            <Link href="/create">
              <button
                type="button"
                className="h-12 w-full sm:w-auto px-8 rounded-full bg-foreground text-background font-medium shadow-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2"
              >
                Try Aura AI <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9 }}
            className="rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-white/70 via-white/50 to-white/80 p-4 sm:p-6 shadow-2xl"
          >
            <div className="rounded-3xl bg-white/80 p-5 shadow-lg">
              <div className="text-sm font-semibold">Aura AI ✨</div>
              <p className="text-xs text-muted-foreground">Your design assistant</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm">
                  Which vibe suits a romantic surprise?
                </div>
                <div className="rounded-2xl bg-foreground text-background px-4 py-2 text-sm">
                  Try Romantic or Pastel. Keep the message soft and heartfelt.
                </div>
                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm">
                  Can you improve my birthday message?
                </div>
                <div className="rounded-2xl bg-foreground text-background px-4 py-2 text-sm">
                  Absolutely. I’ll craft a more emotional version for you.
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-2 text-xs text-muted-foreground">
                Type your question...
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type TeamMember = { name: string; role: string };

function FounderSection({ founder, cofounders }: { founder: TeamMember; cofounders: TeamMember[] }) {
  return (
    <section className="min-h-screen flex items-center bg-secondary/30">
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-3">
            Built With Passion
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4">
            Built With Passion
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            A small team crafting the most magical birthday experiences online.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-4">
              Founder
            </p>
            <div className="rounded-3xl bg-white/90 p-6 shadow-lg hover:-translate-y-1 transition-transform">
              <h3 className="text-2xl font-semibold">{founder.name}</h3>
              <p className="text-muted-foreground">{founder.role}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-4">
              Cofounders
            </p>
            <div className="grid gap-4">
              {cofounders.map((person) => (
                <div
                  key={person.name}
                  className="rounded-3xl bg-white/90 p-5 shadow-lg hover:-translate-y-1 transition-transform"
                >
                  <h4 className="text-lg font-semibold">{person.name}</h4>
                  <p className="text-muted-foreground text-sm">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-24 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-semibold">
            Ready to create the perfect birthday surprise?
          </h2>
          <p className="text-white/70 text-base sm:text-lg md:text-xl">
            Start crafting a personalized experience that feels like a premium gift.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create">
              <button
                type="button"
                className="h-14 w-full sm:w-auto px-10 rounded-full bg-white text-gray-900 font-medium text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Create Your Surprise
              </button>
            </Link>
            <Link href="/templates">
              <button
                type="button"
                className="h-14 w-full sm:w-auto px-10 rounded-full border border-white/30 text-white font-medium text-lg hover:bg-white/10 transition-all"
              >
                Explore Templates
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [templatesError, setTemplatesError] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) {
          setTemplatesError(true);
          return;
        }
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
      } catch {
        setTemplatesError(true);
      }
    };
    loadTemplates();
  }, []);

  const steps: StepItem[] = [
    {
      title: "Create Your Surprise",
      description: "Add memories, message, and music.",
      icon: Wand2,
    },
    {
      title: "Generate the Magic",
      description: "Aura builds a beautiful surprise website.",
      icon: Sparkles,
    },
    {
      title: "Share the Moment",
      description: "Send the link or Instagram teaser.",
      icon: Share2,
    },
  ];

  const features: FeatureItem[] = [
    {
      title: "Surprise Reveal Experience",
      description: "A dramatic gate that opens into the birthday moment.",
      icon: Gift,
    },
    {
      title: "Memory Photo Gallery",
      description: "Layer photos into a beautifully curated timeline.",
      icon: Heart,
    },
    {
      title: "Music Background",
      description: "Set the mood with emotional soundtrack playback.",
      icon: Music,
    },
    {
      title: "Instagram Teaser Generator",
      description: "Export ready-to-post story images in one click.",
      icon: Download,
    },
    {
      title: "QR Code Sharing",
      description: "Let anyone scan and open instantly.",
      icon: QrCode,
    },
    {
      title: "Replay Surprise Animation",
      description: "Reopen the moment whenever they want.",
      icon: RefreshCcw,
    },
    {
      title: "Dynamic AI Websites",
      description: "Adaptive layouts driven by vibe and relationship.",
      icon: Sparkles,
    },
    {
      title: "Aura AI Assistant",
      description: "Get guidance on themes, messages, and design choices.",
      icon: Wand2,
    },
  ];

  const showcase: ShowcaseItem[] = [
    { title: "Romantic Elegance", image: story1 },
    { title: "Soft Pastel Glow", image: story2 },
    { title: "Golden Luxe", image: gift1 },
    { title: "Minimal Chic", image: gift2 },
  ];

  const founder = { name: "Anuj Dhavane", role: "Head of Project / Founder" };
  const cofounders = [
    { name: "Amit", role: "Cofounder" },
    { name: "Krishna", role: "Cofounder" },
    { name: "Sahil", role: "Cofounder" },
    { name: "Kartik", role: "Cofounder" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection onPrimaryHref="/create" onSecondaryHref="/templates" />
      <HowItWorksSection steps={steps} />
      <FeaturesSection features={features} />
      <TemplatesSection showcase={showcase} />
      <SocialTeasersSection templates={templates} templatesError={templatesError} />
      <AISection />
      <FounderSection founder={founder} cofounders={cofounders} />
      <CTASection />
    </div>
  );
}
