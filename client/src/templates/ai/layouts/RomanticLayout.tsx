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

export default function RomanticLayout({
  name,
  relationship,
  message,
  memories,
  musicSrc,
  musicLabel,
}: Props) {
  const subtitle = relationship ? `For my ${relationship.toLowerCase()}` : undefined
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      <HeroSection name={name} subtitle={subtitle} backgroundClass="text-foreground" />
      <BirthdayMessage
        title="A little note from the heart"
        message={message}
        cardClass="bg-white/80 border border-white/60 shadow-2xl"
      />
      <MemoriesGallery memories={memories} cardClass="bg-white/90" />
      <MusicPlayer src={musicSrc} label={musicLabel} />
      <Footer />
    </div>
  )
}
