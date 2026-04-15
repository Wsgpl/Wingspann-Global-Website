import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Newspaper, Megaphone, Mail, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPublishedNews } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Same date formatter as News.tsx ───────────────────────────────────────────
function formatNewsDate(dateStr: string): string {
  if (!dateStr) return 'COMING SOON';
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31 ? 'ST' :
    day === 2 || day === 22 ? 'ND' :
    day === 3 || day === 23 ? 'RD' : 'TH';
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${day}${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function resolveUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
  return url;
}

function mapDbNews(item: any) {
  let videos: string[] | null = null;
  try {
    const raw = item.extra_videos
      ? (typeof item.extra_videos === 'string' ? JSON.parse(item.extra_videos) : item.extra_videos)
      : null;
    if (Array.isArray(raw) && raw.length > 0) {
      videos = raw.map(resolveUrl).filter(Boolean) as string[];
    }
  } catch {
    videos = null;
  }

  const videoUrl = resolveUrl(item.video_url);

  return {
    id: item.id,
    date: item.published_at ? formatNewsDate(item.published_at) : 'COMING SOON',
    text: item.summary || item.title,
    fullText: item.content || item.summary || item.title,
    image: resolveUrl(item.image_url),
    video: videoUrl,
    videos: videos && videos.length > 0 ? videos : (videoUrl ? [videoUrl] : null),
    source: item.source || null,
    source_url: item.source_url || null,
  };
}

export default function Press() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    fetchPublishedNews().then((data) => {
      if (data && data.length > 0) {
        setNewsItems(data.map(mapDbNews));
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full bg-black min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900/40 via-black to-black"></div>
        <div className="absolute inset-0 grid-background opacity-20 z-0 pointer-events-none"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 md:w-16 h-[2px] bg-red-600"></div>
            <span className="text-red-600 font-medium text-lg md:text-xl tracking-wider uppercase">Latest Updates</span>
            <div className="w-8 md:w-16 h-[2px] bg-red-600"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none uppercase">
            <span className="text-white drop-shadow-2xl">PRESS & </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 drop-shadow-xl">MEDIA</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
            The official source for Wingspann Global news, announcements, and media resources.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 relative z-10 -mt-16 pb-32">

        {/* ── News Articles ─────────────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-600 text-sm uppercase tracking-widest animate-pulse">Loading updates...</div>
          </div>
        ) : newsItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedNews(item);
                    setActiveMediaIndex(0);
                  }}
                  className="group relative h-[320px] overflow-hidden border border-gray-800 bg-[#0a0a0a] cursor-pointer hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-500 rounded-xl"
                >
                  {item.video ? (
                    <>
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105" src={item.video} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0a0a0a]/30 rounded-xl" />
                    </>
                  ) : item.image ? (
                    <>
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105 rounded-xl" style={{ backgroundImage: `url(${item.image})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0a0a0a]/30 rounded-xl" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-10 rounded-xl" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-[#0a0a0a]/90 to-black rounded-xl" />
                    </>
                  )}

                  <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                    <div className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase mb-4">{item.date}</div>
                    <p className="text-white text-lg font-light leading-relaxed group-hover:-translate-y-1 transition-transform duration-500 mb-4">
                      {item.text}
                    </p>
                    {item.source && (
                      <p className="text-gray-500 text-xs uppercase tracking-widest">{item.source}</p>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 group-hover:w-full transition-all duration-700 ease-out rounded-bl-xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── Coming Soon (shown when no articles in DB) ─────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900 to-[#0a0a0a] border border-gray-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group mb-12"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-red-900/20 transition-colors duration-1000"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-red-600/5 border border-red-600/30 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-red-600/10 rounded-full animate-ping opacity-75"></div>
                <Newspaper className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-widest">
                Big Things Are <span className="text-red-600">Launching Soon</span>
              </h2>
              <div className="w-16 h-1 bg-red-600 mx-auto mb-8"></div>
              <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-10">
                We are currently preparing our official press releases, media kits, and company announcements. As a rapidly growing aerospace startup, we have exciting developments in the pipeline. Check back soon for our latest news and technological breakthroughs.
              </p>
              <div className="inline-flex items-center gap-3 text-gray-500 uppercase tracking-widest text-sm font-bold border border-gray-800 px-8 py-4 rounded bg-black/50 group-hover:border-red-600/30 transition-colors duration-500 shadow-inner">
                <Megaphone className="w-5 h-5 text-red-600" />
                <span>Stay Tuned for Updates</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Media Inquiries Card ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-[1fr_auto] gap-8 items-center bg-[#0a0a0a] border border-gray-800 p-8 md:p-12 rounded-xl hover:border-red-600/30 transition-colors duration-500 shadow-xl"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">Media Inquiries</h3>
            <div className="w-12 h-[2px] bg-red-600 mb-5"></div>
            <p className="text-gray-200 font-light leading-relaxed text-sm md:text-base max-w-xl">
              Are you a journalist or media representative? For press inquiries, interview requests, or early access to our media kits, please reach out to our communications team.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <Link to="/contact" className="group flex items-center justify-center gap-3 bg-red-600 text-white font-bold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-red-600 transition-all duration-300 w-full shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <Mail className="w-5 h-5 group-hover:-translate-y-[2px] transition-transform" />
              Contact Team
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Article Modal ─────────────────────────────────────────────────────── */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg w-full max-w-3xl shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-900 bg-[#0a0a0a]">
              <h3 className="text-xl font-bold text-white tracking-widest uppercase">
                News & <span className="text-red-600">Updates</span>
              </h3>
              <button onClick={() => setSelectedNews(null)} className="text-gray-500 hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col max-h-[80vh] overflow-y-auto">
              {selectedNews.videos && selectedNews.videos.length > 0 ? (
                <div className="w-full relative bg-black flex justify-center border-b border-gray-900 overflow-hidden group">
                  <video key={selectedNews.videos[activeMediaIndex]} autoPlay loop muted playsInline src={selectedNews.videos[activeMediaIndex]} className="relative z-10 w-full h-auto max-h-[45vh] object-contain" />
                  {selectedNews.videos.length > 1 && (
                    <>
                      <button onClick={() => setActiveMediaIndex(prev => prev > 0 ? prev - 1 : selectedNews.videos.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 z-20">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={() => setActiveMediaIndex(prev => prev < selectedNews.videos.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 z-20">
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
              ) : selectedNews.image && (
                <div className="w-full relative bg-black flex justify-center border-b border-gray-900 overflow-hidden">
                  <img src={selectedNews.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none" />
                  <img src={selectedNews.image} alt={selectedNews.date} className="relative z-10 w-full h-auto max-h-[45vh] object-contain" />
                </div>
              )}
              <div className="p-8">
                <div className="text-sm font-bold tracking-[0.2em] text-red-500 uppercase mb-5 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-red-600 inline-block"></span>
                  {selectedNews.date}
                </div>
                <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed mb-6">
                  {selectedNews.fullText || selectedNews.text}
                </p>
                {selectedNews.source_url && (
                  <a href={selectedNews.source_url} target="_blank" rel="noopener noreferrer" className="text-red-500 text-sm hover:underline mb-6 inline-block">
                    Read full article → {selectedNews.source}
                  </a>
                )}
                <div className="flex justify-end">
                  <button onClick={() => setSelectedNews(null)} className="bg-red-600 hover:bg-white text-black font-semibold text-sm uppercase tracking-widest px-8 py-3 transition-colors duration-300">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
