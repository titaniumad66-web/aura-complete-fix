type Props = {
  src?: string
  label?: string
}

export default function MusicPlayer({ src, label }: Props) {
  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border bg-white/80 p-6 shadow-lg">
          <div className="text-sm font-semibold text-muted-foreground">Background Music</div>
          <div className="mt-2 text-lg font-medium">{label || "No track selected"}</div>
          <div className="mt-4">
            {src ? (
              <audio controls className="w-full">
                <source src={src} />
              </audio>
            ) : (
              <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                No audio provided
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
