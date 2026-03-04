type Props = {
  title?: string
  message?: string
  cardClass?: string
}

export default function BirthdayMessage({ title, message, cardClass }: Props) {
  return (
    <section className="px-6 pb-12">
      <div className="mx-auto max-w-4xl">
        <div className={`rounded-3xl p-8 shadow-xl ${cardClass || "bg-white/85 border"}`}>
          <h2 className="text-2xl font-semibold">{title || "A Message Just For You"}</h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-foreground/80">
            {message || "A meaningful message belongs here."}
          </p>
        </div>
      </div>
    </section>
  )
}
