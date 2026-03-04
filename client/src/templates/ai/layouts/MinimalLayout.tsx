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

export default function MinimalLayout({
  name,
  relationship,
  message,
  memories,
  musicSrc,
  musicLabel,
}: Props) {
  const subtitle = relationship ? `For ${relationship.toLowerCase()}` : undefined
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection name={name} subtitle={subtitle} />
      <BirthdayMessage
        title="A message"
        message={message}
        cardClass="bg-white border border-slate-200 shadow-lg"
      />
      <MemoriesGallery memories={memories} cardClass="bg-white" />
      <MusicPlayer src={musicSrc} label={musicLabel} />
      <Footer />
    </div>
  )
}
