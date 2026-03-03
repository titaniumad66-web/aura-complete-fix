import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Image as ImageIcon, Type, Layout, Wand2, Heart, Download, Music, Shield, CloudLightning, PlayCircle, CheckCircle2, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Images
import heroBg from "@/assets/images/hero-bg.png";
import story1 from "@/assets/images/story-1.png";
import story2 from "@/assets/images/story-2.png";
import gift1 from "@/assets/images/gift-1.png";
import gift2 from "@/assets/images/gift-2.png";
import mockupImg from "@/assets/images/website-mockup.png";

export default function Home() {
  const [activeTab, setActiveTab] = useState("romantic");

  const wishes = {
    romantic: [
      "Every moment with you is a beautiful dream. Happy Birthday, my love. Let's make today as unforgettable as you are.",
      "To the one who holds my heart: Happy Birthday. You are the poetry I never knew I could write.",
    ],
    friend: [
      "Happy birthday to my partner in crime! Here's to more late-night talks, endless laughter, and memories we'll never forget.",
      "You're not just a friend; you're family. Happy birthday to the one who knows me best!",
    ],
    funny: [
      "Happy Birthday! I'm so glad we're going to grow old together, and that you have a head start.",
      "You're older today than yesterday but younger than tomorrow. Happy Birthday!",
    ],
    emotional: [
      "On your special day, I just want you to know how much light you bring into this world. Happy Birthday.",
      "Your kindness is a gift to everyone who meets you. Wishing you a birthday as beautiful as your soul.",
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Animated Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroBg} 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-sm font-medium mb-8 text-foreground/80 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The Next Generation of Digital Gifting</span>
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight mb-6 text-foreground tracking-tight">
              Craft Unforgettable <br/><span className="text-primary italic">Digital Experiences</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto font-sans leading-relaxed">
              Upload photos, select an aesthetic, and let our AI generate a stunning, music-infused, interactive birthday website in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/create">
                <button className="h-16 px-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all font-medium text-lg flex items-center gap-3 shadow-2xl hover:shadow-xl hover:-translate-y-1">
                  Start Creating <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="h-16 px-10 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-foreground hover:bg-white/60 transition-all font-medium text-lg flex items-center gap-3">
                <PlayCircle className="w-5 h-5" /> View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Startup Features Grid */}
      <section className="py-32 bg-background relative z-20 -mt-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">More Than Just a Webpage</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Aura combines design, music, and AI to create an emotional journey your loved ones will never forget.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CloudLightning, title: "Emotion-Based Themes", desc: "Select from Romantic, Funny, Royal, Minimal, or Soft Pastel to instantly change the vibe, fonts, and colors." },
              { icon: Layout, title: "Storytelling Timelines", desc: "Our engine automatically structures your uploaded photos into a beautiful scrolling timeline of memories." },
              { icon: Music, title: "Immersive Audio", desc: "Add preset cinematic tracks or upload their favorite song to auto-play when they open the site." },
              { icon: Wand2, title: "AI Website Stylist", desc: "Stuck on words? Our AI enhances your message to be more poetic, emotional, or humorous based on context." },
              { icon: Shield, title: "Confession Mode", desc: "A special subtle mode that uses deep aesthetic tones and soft animations to convey your feelings delicately." },
              { icon: Gift, title: "Smart Gift Engine", desc: "Get curated physical gift recommendations perfectly matched to the recipient's personality and the website's tone." }
            ].map((feature, i) => (
              <div key={i} className="bg-secondary/20 rounded-3xl p-8 hover:bg-secondary/40 transition-colors border border-border/50 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Website Mockup Feature */}
      <section className="py-32 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Zero Coding Required</span>
              </div>
              <h2 className="text-5xl font-serif font-medium leading-tight">
                From memory to masterpiece in minutes.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experience a smooth, premium workflow. Upload your content, preview the magic, and instantly get a beautiful, deployable website package ready to share.
              </p>
              
              <div className="pt-8">
                <Link href="/create">
                  <button className="text-foreground font-medium text-lg hover:text-primary transition-colors flex items-center gap-2 group">
                    Experience the Workflow <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white"
               >
                  <div className="h-12 bg-secondary/50 border-b flex items-center px-4 gap-2 backdrop-blur-md">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                    </div>
                    <div className="mx-auto text-sm text-muted-foreground font-medium bg-white px-6 py-1.5 rounded-md shadow-sm">
                      ishwaris-birthday.aura.site
                    </div>
                  </div>
                  <img src={mockupImg} alt="Website Mockup" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="bg-white/90 backdrop-blur-xl w-full p-6 rounded-2xl flex items-center justify-between shadow-xl">
                       <div>
                         <p className="text-foreground font-semibold text-lg">Ready to deploy</p>
                         <p className="text-muted-foreground text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Mobile Responsive</p>
                       </div>
                       <button className="bg-foreground text-background px-6 py-3 rounded-xl text-sm font-medium shadow-md hover:bg-foreground/90 transition-colors">
                         Publish Now
                       </button>
                    </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Ideas & Templates */}
      <section id="stories" className="py-32 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">Social Teasers</h2>
              <p className="text-muted-foreground text-xl max-w-xl">Beautiful templates to tease their special day on Instagram.</p>
            </div>
            <button className="text-lg font-medium hover:text-primary transition-colors mt-6 md:mt-0 flex items-center gap-2 border-b-2 border-primary/30 pb-1">
              View all templates <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { img: story1, title: "Polaroid Memories" },
              { img: story2, title: "Minimal Sparkle" },
              { img: story1, title: "Vintage Film" },
              { img: story2, title: "Soft Gradient" }
            ].map((story, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[9/16] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                <img src={story.img} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-end text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Download className="w-8 h-8 text-white mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                  <p className="text-white font-medium text-lg">{story.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-foreground text-background text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">Make them smile today.</h2>
          <p className="text-background/70 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">Create a beautiful, personalized, musical birthday experience in minutes.</p>
          <Link href="/create">
            <button className="h-16 px-12 rounded-full bg-background text-foreground hover:bg-primary hover:text-white transition-all font-medium text-xl flex items-center gap-3 shadow-2xl mx-auto hover:scale-105">
              Launch Aura Studio <Wand2 className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}