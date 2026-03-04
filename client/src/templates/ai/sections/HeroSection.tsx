import { motion } from "framer-motion"

type Props = {
  name?: string
  subtitle?: string
  backgroundClass?: string
}

export default function HeroSection({ name, subtitle, backgroundClass }: Props) {
  return (
    <section className={`relative px-6 pt-20 pb-16 ${backgroundClass || ""}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl text-center">
        <div className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold text-foreground">
          Crafted with Aura
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-5 text-4xl font-serif font-semibold md:text-6xl break-words"
        >
          Happy Birthday {name || "Birthday Star"}
        </motion.h1>
        {subtitle ? (
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{subtitle}</p>
        ) : null}
      </div>
    </section>
  )
}
