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

export default function FunLayout({
  name,
  relationship,
  message,
  memories,
  musicSrc,
  musicLabel,
}: Props) {
  const subtitle = relationship ? `For ${relationship.toLowerCase()}` : undefined
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-emerald-50 text-foreground">
      <HeroSection name={name} subtitle={subtitle} />
      <BirthdayMessage
        title="Let the fun begin"
        message={message}
        cardClass="bg-white/90 border-2 border-emerald-200 shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
      />
      <MemoriesGallery memories={memories} cardClass="bg-white/90" />
      <MusicPlayer src={musicSrc} label={musicLabel} />
      <Footer />
    </div>
  )
}
