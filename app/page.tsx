"use client";
import { useEffect, useState } from "react";

interface LinkItem {
  no: string;
  title: string;
  link: string;
  image?: string;
  category?: string;
}

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = () => {
      fetch("/api/links")
        .then((res) => res.json())
        .then(setLinks);
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = links.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main
      className="min-h-screen text-white p-6 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpeg')" }}
    >
      {/* Soft pastel overlay */}
      <div className="fixed inset-0 bg-pink-300/20 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Cute Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl mb-4">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
              🌸 Spall Spill 🌸
            </h1>
          </div>
          <p className="text-white/90 text-sm font-medium drop-shadow-md">
            💕 Link-link gemes pilihan hati 💕
          </p>
        </div>

        {/* Cute Search Input */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Cari link..."
            className="w-full p-4 pl-12 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-white/50 text-gray-800 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300/50 focus:border-pink-400 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            🔎
          </span>
        </div>

        {/* Links Grid */}
        <div className="flex flex-col gap-4">
          {filtered.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:bg-white/60 transition-all duration-300 hover:-translate-y-1"
            >
              {item.no && (
                <div className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold shadow-md">
                  {item.no}
                </div>
              )}
              {item.image && (
                <div className="overflow-hidden rounded-2xl mb-3 aspect-square w-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </div>
                <span className="text-xl group-hover:rotate-12 transition-transform">
                  💕
                </span>
              </div>

              {item.category && (
                <span className="inline-block mt-2 text-xs font-semibold bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1.5 rounded-full shadow-sm">
                  {item.category}
                </span>
              )}

              <div className="text-sm text-gray-600 truncate mt-2">
                {item.link}
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center mt-12 p-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40">
            <p className="text-4xl mb-2">🥺</p>
            <p className="text-white/80 font-medium">
              Link tidak ditemukan
            </p>
          </div>
        )}

        {/* Cute Footer */}
        <div className="text-center mt-10 pb-6">
          <p className="text-white/70 text-xs">
            Made with 💖 for Ibuk Elzein
          </p>
        </div>
      </div>
    </main>
  );
}

