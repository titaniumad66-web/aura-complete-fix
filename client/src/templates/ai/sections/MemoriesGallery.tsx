type MemoryItem = {
  image: string
  caption?: string
  date?: string
}

type Props = {
  memories?: MemoryItem[]
  cardClass?: string
}

export default function MemoriesGallery({ memories = [], cardClass }: Props) {
  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold">Memories</h2>
          <p className="mt-2 text-sm text-muted-foreground">Snapshots that bring back a smile</p>
        </div>
        {memories.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((m, i) => (
              <div key={`${m.image}-${i}`} className={`rounded-3xl p-4 shadow-lg ${cardClass || "bg-white/90"}`}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={m.image} alt={m.caption || "Memory"} className="h-full w-full object-cover" />
                </div>
                {(m.caption || m.date) && (
                  <div className="mt-3 space-y-1">
                    {m.caption && <div className="text-sm font-medium">{m.caption}</div>}
                    {m.date && <div className="text-xs text-muted-foreground">{m.date}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-white/70 p-10 text-center text-sm text-muted-foreground">
            No memories added yet.
          </div>
        )}
      </div>
    </section>
  )
}
