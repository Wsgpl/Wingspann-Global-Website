import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchPublishedNews } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Hardcoded fallback (shown if DB is empty) ─────────────────────────────────
const FALLBACK_NEWS = [
  {
    date: '13TH MAR 2026',
    text: 'Wingspann Global successfully concludes autonomous test flights for the Aquila UAV at the Aerospace Testing Range.',
    image: '/Aquila%20Alpha.jpeg',
    fullText: 'Wingspann Global has officially concluded the third and final phase of autonomous test flights for the Aquila UAV platform at the designated Aerospace Testing Range. These tests verified the performance parameters of the advanced flight envelope, integrating rigorous EMI/EMC environments, RF wireless telemetry endurance, and thermal operational limits. The Aquila UAV demonstrated unprecedented operational reliability.'
  },
  {
    date: '22ND MAR 2026',
    text: 'Flight Test Update: During our latest test with full team members, the drone reached 157 meters in altitude and successfully covered 6+ km distance.',
    image: null,
    video: '/22mar%20update.mov',
    videos: ['/22mar%20update.mov', '/News%20update.mp4'],
    fullText: 'Flight Test Update: During our latest test with full team members, the drone reached 157 meters in altitude and successfully covered 6+ km distance, demonstrating stable performance and extended range capability.'
  },
  {
    date: 'COMING SOON',
    text: 'Big Things Are Launching Soon. Stay Tuned for Updates.',
    image: null,
  },
  {
    date: 'COMING SOON',
    text: 'Big Things Are Launching Soon. Stay Tuned for Updates.',
    image: null,
  }
];

// ── Format date from DB (2026-03-13) → "13TH MAR 2026" ───────────────────────
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

// ── Map DB row to the shape News cards expect ─────────────────────────────────
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
  const imageUrl = resolveUrl(item.image_url);

  return {
    id: item.id,
    date: item.published_at ? formatNewsDate(item.published_at) : 'COMING SOON',
    text: item.summary || item.title,
    fullText: item.content || item.summary || item.title,
    image: imageUrl,
    video: videoUrl,
    videos: videos && videos.length > 1 ? videos : (videoUrl ? [videoUrl] : null),
    source: item.source || null,
    source_url: item.source_url || null,
  };
}

export default function News() {
  const [newsItems, setNewsItems] = useState(FALLBACK_NEWS as any[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    fetchPublishedNews().then((data) => {
      if (data && data.length > 0) {
        const mapped = data.map(mapDbNews);
        // Always keep at least one "COMING SOON" placeholder at the end
        setNewsItems([...mapped, { date: 'COMING SOON', text: 'Big Things Are Launching Soon. Stay Tuned for Updates.', image: null }]);
      }
    });
  }, []);

  const nextSlide = () => {
    if (currentIndex < newsItems.length - 1) setCurrentIndex(prev => prev + 1);
  };
  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <section className="py-24 bg-[#050505] border-t border-b border-gray-900 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white tracking-widest uppercase">
            News & <span className="text-red-600">Updates</span>
          </h2>
          <div className="flex items-center gap-4">
            {/* View All button */}
            <Link
              to="/press"
              className="text-sm font-bold tracking-widest text-red-500 border border-red-600/30 px-5 py-2 hover:bg-red-600 hover:text-white transition-all duration-300 uppercase"
            >
              View All
            </Link>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full border transition-all duration-300 shadow-xl flex items-center justify-center ${currentIndex === 0 ? 'border-gray-800 text-gray-800 cursor-not-allowed' : 'border-gray-600 text-gray-300 hover:border-red-600 hover:text-white hover:bg-red-600/10'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === newsItems.length - 1}
              className={`p-2 rounded-full border transition-all duration-300 shadow-xl flex items-center justify-center ${currentIndex === newsItems.length - 1 ? 'border-gray-800 text-gray-800 cursor-not-allowed' : 'border-gray-600 text-gray-300 hover:border-red-600 hover:text-white hover:bg-red-600/10'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="flex gap-6 overflow-hidden pb-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {newsItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (item.date !== 'COMING SOON') {
                  setSelectedNews(item);
                  setActiveMediaIndex(0);
                }
              }}
              className={`w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] shrink-0 h-[380px] relative group overflow-hidden border border-gray-800 bg-[#0a0a0a] shadow-[0_0_25px_rgba(0,0,0,0.5)] ${item.date !== 'COMING SOON' ? 'cursor-pointer hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]' : ''}`}
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))`,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease'
              }}
            >
              {item.video ? (
                <>
                  <div className="absolute inset-0 overflow-hidden">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover transform scale-105 opacity-40 group-hover:opacity-60 transition-opacity duration-700" src={item.video} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0a0a0a]/30" />
                </>
              ) : item.image ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0a0a0a]/30" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-[#0a0a0a]/90 to-black pointer-events-none" />
                </>
              )}

              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-center">
                <div className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase mb-5">{item.date}</div>
                <p className="text-white text-lg md:text-xl font-light leading-relaxed group-hover:-translate-y-1 transition-transform duration-500">
                  {item.text}
                </p>
                {item.source && (
                  <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest">{item.source}</p>
                )}
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg w-full max-w-5xl shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-900 bg-[#0a0a0a]">
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                News & <span className="text-red-600">Updates</span>
              </h3>
              <button onClick={() => setSelectedNews(null)} className="text-gray-500 hover:text-white transition-colors" aria-label="Close">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col w-full max-h-[85vh] overflow-y-auto">
              {selectedNews.videos && selectedNews.videos.length > 0 ? (
                <div className="w-full relative bg-black flex justify-center border-y border-gray-900 group overflow-hidden">
                  <div className="relative w-full flex justify-center overflow-hidden z-10 shadow-2xl">
                    <video key={selectedNews.videos[activeMediaIndex]} autoPlay loop muted playsInline src={selectedNews.videos[activeMediaIndex]} className="w-full h-auto max-h-[55vh] object-contain animate-in fade-in duration-500" />
                  </div>
                  {selectedNews.videos.length > 1 && (
                    <>
                      <button onClick={() => setActiveMediaIndex(prev => prev > 0 ? prev - 1 : selectedNews.videos.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 scale-90 hover:scale-100 backdrop-blur-sm z-20"><ChevronLeft size={24} /></button>
                      <button onClick={() => setActiveMediaIndex(prev => prev < selectedNews.videos.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 scale-90 hover:scale-100 backdrop-blur-sm z-20"><ChevronRight size={24} /></button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {selectedNews.videos.map((_: any, i: number) => (
                          <button key={i} onClick={() => setActiveMediaIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === activeMediaIndex ? 'bg-red-600' : 'bg-white/40 hover:bg-white/80'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : selectedNews.video ? (
                <div className="w-full relative bg-black flex justify-center border-y border-gray-900 overflow-hidden">
                  <video autoPlay loop muted playsInline src={selectedNews.video} className="w-full h-auto max-h-[55vh] object-contain" />
                </div>
              ) : selectedNews.image ? (
                <div className="w-full relative bg-black flex justify-center border-y border-gray-900 overflow-hidden">
                  <img src={selectedNews.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none" />
                  <div className="relative w-full flex justify-center z-10 shadow-2xl">
                    <img src={selectedNews.image} alt={selectedNews.date} className="w-full h-auto max-h-[55vh] object-contain" />
                  </div>
                </div>
              ) : null}

              <div className="p-6 md:p-10 flex flex-col justify-center">
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
                <div className="mt-2 flex justify-end">
                  <button onClick={() => setSelectedNews(null)} className="bg-red-600 hover:bg-white text-black font-semibold text-sm uppercase tracking-widest px-8 py-3 transition-colors duration-300">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
