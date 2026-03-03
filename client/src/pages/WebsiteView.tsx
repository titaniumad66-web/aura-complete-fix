import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WebsiteView() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/websites/${id}`)
      .then(res => res.json())
      .then(res => { try { setData(JSON.parse(res.content)); } catch(e){ console.error('Invalid JSON', e); } });
  }, [id]);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ef] text-gray-800 overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-orange-200 rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-6xl w-full grid md:grid-cols-2 items-center gap-10">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
              Happy <br /> Birthday {data.name}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-md">
              {data.message}
            </p>

            <button className="bg-black text-white px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform">
              Celebrate Now
            </button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <img
              src={data.memories && data.memories.length > 0 ? data.memories[0].image : "https://images.unsplash.com/photo-1563805042-7684c019e1cb"}
              className="w-96 rounded-3xl shadow-2xl"
            />
          </motion.div>

        </div>
      </section>

      {/* MEMORY SECTION */}
      {data.memories?.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <h2 className="text-4xl font-serif text-center mb-16">
            Our Beautiful Memories
          </h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {data.memories.map((memory: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#f9f7f4] p-6 rounded-3xl shadow-xl"
              >
                <img
                  src={memory.image}
                  className="w-full h-72 object-cover rounded-2xl mb-6"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {memory.caption}
                </h3>
                <p className="text-gray-500 text-sm">
                  {memory.date}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}


      {data.music && (
        <audio autoPlay loop>
          <source src={`/music/${data.music}.mp3`} type="audio/mpeg" />
        </audio>
      )}

      {/* FOOTER */}
      <footer className="py-10 text-center bg-[#f3eee9] text-gray-600">
        Made with ❤️ using Aura
      </footer>

    </div>
  );
}