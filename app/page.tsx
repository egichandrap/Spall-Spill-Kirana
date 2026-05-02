"use client";
import { useEffect, useState } from "react";

interface LinkItem {
  no: string;
  title: string;
  link: string;
  image?: string;
  category?: string;
}

interface PaginationInfo {
  totalLinks: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const limit = 10;

  const loadLinks = async (page: number, category: string = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/links?page=${page}&limit=${limit}&category=${encodeURIComponent(category)}`);
      const json = await res.json();
      setLinks(json.data);
      setPagination(json.pagination);
      setCategories(json.categories || []);
    } catch (error) {
      console.error("Error loading links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks(currentPage, selectedCategory);
    const interval = setInterval(() => loadLinks(currentPage, selectedCategory), 10000);
    return () => clearInterval(interval);
  }, [currentPage, selectedCategory]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    loadLinks(1, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    loadLinks(1, category);
  };

  const filtered = links.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
            <h1 className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap">
              🌸 Spall Spill By Ibuk El 🌸
            </h1>
          </div>
          <p className="text-white/90 text-sm font-medium drop-shadow-md">
            💕 Link-link gemes pilihan hati 💕
          </p>
        </div>

        {/* Cute Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Cari link..."
            className="w-full p-4 pl-12 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-white/50 text-gray-800 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300/50 focus:border-pink-400 transition-all"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            🔎
          </span>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-white/50 text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300/50 focus:border-pink-400 transition-all cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Links Grid */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center p-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40">
              <p className="text-4xl mb-2">⏳</p>
              <p className="text-white/80 font-medium">Memuat link...</p>
            </div>
          ) : (
            filtered.map((item, i) => (
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
            ))
          )}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center mt-12 p-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40">
            <p className="text-4xl mb-2">🥺</p>
            <p className="text-white/80 font-medium">
              Link tidak ditemukan
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-white/50 text-gray-800 font-semibold shadow-lg hover:bg-white/60 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/40"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= pagination.totalPages}
              className="px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-white/50 text-gray-800 font-semibold shadow-lg hover:bg-white/60 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/40"
            >
              Berikutnya →
            </button>
          </div>
        )}

        {/* Page Indicator - Below buttons */}
        {pagination && (
          <div className="text-center mt-4">
            <span className="inline-block px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-gray-800 text-sm font-semibold">
              Halaman {pagination.currentPage} dari {pagination.totalPages} ({pagination.totalLinks} link)
            </span>
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
