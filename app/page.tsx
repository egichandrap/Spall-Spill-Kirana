"use client";
import { useEffect, useState } from "react";

interface LinkItem {
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
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">🔥 Spall Spill Link 🔥</h1>
          <p className="text-gray-400 text-sm">By Ibuk Elzein</p>
        </div>

        <input
          type="text"
          placeholder="Cari link..."
          className="w-full p-3 mb-6 rounded-xl bg-gray-800 border border-gray-700"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col gap-4">
          {filtered.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              className="p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 transition shadow-lg hover:scale-[1.02]"
            >
              {item.image && (
              <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-xl mb-2"
                />
              )}

              <div className="font-semibold text-lg">{item.title}</div>

              {item.category && (
                <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                  {item.category}
                </span>
              )}

              <div className="text-sm text-gray-400 truncate">
                {item.link}
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Link tidak ditemukan
          </p>
        )}
      </div>
    </main>
  );
}