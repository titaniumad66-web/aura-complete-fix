import HeroSection from "../sections/HeroSection"
import BirthdayMessage from "../sections/BirthdayMessage"
import MemoriesGallery from "../sections/MemoriesGallery"
import MusicPlayer from "../sections/MusicPlayer"
import Footer from "../sections/Footer"

type MemoryItem = { image: string; caption?: string; date?: string }

type Props = {
  name?: string
  relationship?: string
  message?: string
  memories?: MemoryItem[]
  musicSrc?: string
  musicLabel?: string
}

export default function PremiumLayout({
  name,
  relationship,
  message,
  memories,
  musicSrc,
  musicLabel,
}: Props) {
  const subtitle = relationship ? `For my ${relationship.toLowerCase()}` : undefined
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-amber-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <HeroSection name={name} subtitle={subtitle} backgroundClass="text-amber-50" />
      <BirthdayMessage
        title="A golden note"
        message={message}
        cardClass="bg-slate-900/70 border border-amber-200/30 shadow-[0_30px_80px_rgba(251,191,36,0.18)] text-amber-50"
      />
      <MemoriesGallery memories={memories} cardClass="bg-slate-900/70 text-amber-50" />
      <MusicPlayer src={musicSrc} label={musicLabel} />
      <Footer />
    </div>
  )
}
