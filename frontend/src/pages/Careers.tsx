import { useState, useEffect } from 'react';
import { Zap, BookOpen, Brain, HeartPulse, ShieldCheck, Bot, Clock, Target, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FraudAlertModal from '../components/FraudAlertModal';
import { fetchCareerPositions, submitApplication, type CareerPosition } from '../lib/api';

export default function Careers() {
  const [activeCategory, setActiveCategory] = useState<'technical' | 'business' | null>(null);
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  // ── Form state ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setFileError('File size must be under 10MB');
        setResumeFile(null);
        e.target.value = '';
      } else {
        setFileError('');
        setResumeFile(file);
      }
    }
  };

  // ── Open modal with position pre-filled ────────────────────────────────────
  function openModalWithPosition(title: string, department: string) {
    setFormData(prev => ({ ...prev, position: title, department }));
    setSubmitSuccess(false);
    setSubmitError('');
    setIsResumeModalOpen(true);
  }

  function closeModal() {
    setIsResumeModalOpen(false);
    setResumeFile(null);
    setFileError('');
    setSubmitSuccess(false);
    setSubmitError('');
    setFormData({ name: '', email: '', phone: '', position: '', department: '', coverLetter: '' });
  }

  // ── Submit handler ─────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fileError) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await submitApplication({
        ...formData,
        resume: resumeFile,
      });

      if (res.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Could not connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const cultureItems = [
    {
      title: 'LEARN BY BUILDING',
      icon: <BookOpen className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Get hands-on experience on real aerospace projects from the very beginning – not just support roles.'
    },
    {
      title: 'YOUNG MINDS AROUND',
      icon: <Brain className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Be part of a dynamic team that values energy, ideas, and collaboration.'
    },
    {
      title: 'OPEN WORK CULTURE',
      icon: <HeartPulse className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Your ideas are heard, valued, and implemented — regardless of your experience level.'
    },
    {
      title: 'SKILL DEVELOPMENT SUPPORT',
      icon: <ShieldCheck className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Access to tools, learning resources, and opportunities to continuously upgrade your skills.'
    },
    {
      title: 'EXPOSURE TO ADVANCED TECHNOLOGIES',
      icon: <Bot className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Work with cutting-edge aerospace systems, tools, and evolving technologies.'
    },
    {
      title: 'INNOVATION FOCUSED ENVIRONMENT',
      icon: <Zap className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'We encourage experimentation, problem-solving, and thinking beyond conventional limits.'
    },
    {
      title: 'FLEXIBLE WORK APPROACH',
      icon: <Clock className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Focused on productivity and outcomes while maintaining a positive and flexible work atmosphere.'
    },
    {
      title: 'PURPOSE DRIVEN WORK',
      icon: <Target className="w-12 h-12 text-red-500 mb-6 mx-auto stroke-[1.5]" />,
      desc: 'Be part of building impactful aerospace solutions that contribute to real-world applications.'
    }
  ];

  const carouselItems = [...cultureItems, ...cultureItems, ...cultureItems];

  useEffect(() => {
    fetchCareerPositions()
      .then(setPositions)
      .finally(() => setPositionsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev >= cultureItems.length * 2 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, [cultureItems.length]);

  const nextSlide = () => setSlideIndex((prev) => (prev >= cultureItems.length * 2 ? 0 : prev + 1));
  const prevSlide = () => setSlideIndex((prev) => (prev <= 0 ? cultureItems.length * 2 : prev - 1));

  const technicalJobs = positions.filter(p => p.category === 'technical');
  const businessJobs = positions.filter(p => p.category === 'business');
  const activeJobs = activeCategory === 'technical' ? technicalJobs : activeCategory === 'business' ? businessJobs : [];

  return (
    <>
      <FraudAlertModal />
      <section className="min-h-screen bg-black pb-20">
        <div className="relative w-full mb-16">
          <img src="/career.png" alt="Career at Wingspann" className="w-full h-auto object-contain block" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-start justify-center pt-[10%] sm:pt-[12%]">
            <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center text-center">
              <div className="animate-fade-in space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
                  <span className="text-red-600 drop-shadow-2xl">JOIN OUR</span>
                  <br />
                  <span className="text-white drop-shadow-2xl">TEAM</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
                  We're looking for talented individuals passionate about innovation, autonomous systems, and aerospace technology.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-light text-gray-300 leading-relaxed">
              <span className="text-red-500 font-medium tracking-wide">Wingspann Global</span> is charting the future of<br />
              aerospace innovation. Are you ready to take flight with us?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-20">
            <div className="flex flex-col group">
              <div className="h-56 overflow-hidden rounded-xl mb-6">
                <img src="/tec.png" alt="Technical Career" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-4 font-sans">Technical Career</h3>
                <div className="mt-auto">
                  <button
                    onClick={() => setActiveCategory(activeCategory === 'technical' ? null : 'technical')}
                    className="text-red-500 font-bold text-sm tracking-wider hover:text-red-400 uppercase focus:outline-none transition-colors"
                  >
                    Find open position here
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col group">
              <div className="h-56 overflow-hidden rounded-xl mb-6">
                <img src="/bss.png" alt="Business Career" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-4 font-sans">Business Career</h3>
                <div className="mt-auto">
                  <button
                    onClick={() => setActiveCategory(activeCategory === 'business' ? null : 'business')}
                    className="text-red-500 font-bold text-sm tracking-wider hover:text-red-400 uppercase focus:outline-none transition-colors"
                  >
                    Find open position here
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col text-gray-300">
              <h3 className="text-2xl font-bold text-white mb-6">Join Our Talent Community</h3>
              <div className="space-y-6 text-sm leading-relaxed">
                <p className="text-gray-300">
                  Can't find a role that fits your profile at the moment?<br />
                  <button onClick={() => openModalWithPosition('General Application', 'Open')} className="text-red-500 hover:text-red-400 hover:underline font-medium focus:outline-none">Click here</button> to register your resume for future roles.
                </p>
                <div className="pt-2">
                  <p className="text-gray-500 text-xs mb-1">For career opportunities, write to us at</p>
                  <a href="mailto:hr@wingspannglobal.com" className="text-red-500 text-base font-medium hover:text-red-400 hover:underline break-all">
                    hr@wingspannglobal.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Job listings */}
          {activeCategory && (
            <div className="mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4 capitalize">
                {activeCategory} Positions
              </h2>
              {positionsLoading ? (
                <p className="text-gray-400">Loading positions...</p>
              ) : activeJobs.length === 0 ? (
                <p className="text-gray-400">No positions are listed in this category right now.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {activeJobs.map((position) => {
                    const canApply = !!position.apply_enabled;

                    return (
                      <div
                        key={position.id}
                        className={`group bg-gradient-to-br from-gray-900 to-black border p-8 rounded-lg transition-all duration-300 ${
                          canApply
                            ? 'border-gray-700 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/20'
                            : 'border-gray-800 opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{position.title}</h3>
                            <p className="text-sm text-gray-200">{position.department}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 whitespace-pre-line">{position.description}</p>
                        <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                          <button
                            type="button"
                            disabled={!canApply}
                            onClick={() => canApply && openModalWithPosition(position.title, position.department)}
                            aria-disabled={!canApply}
                            className={`px-4 py-2 font-semibold text-sm rounded transition-all duration-300 ${
                              canApply
                                ? 'bg-red-600 hover:bg-white hover:text-black text-white'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {canApply ? 'Apply Now' : 'Applications Closed'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="bg-black border border-gray-800 rounded-3xl px-4 md:px-12 py-20 mb-16 relative overflow-hidden shadow-2xl group">
            <h2 className="text-4xl md:text-5xl text-center text-white font-bold mb-20 tracking-tighter uppercase font-orbitron">
              What makes working with us <span className="text-red-600">different?</span>
            </h2>
            <div className="relative w-full">
              <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-black/90 border border-red-600/30 hover:border-red-600 rounded-full text-white hover:text-red-500 transition-all shadow-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100">
                <ChevronLeft size={24} className="sm:w-7 sm:h-7" />
              </button>
              <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-black/90 border border-red-600/30 hover:border-red-600 rounded-full text-white hover:text-red-500 transition-all shadow-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100">
                <ChevronRight size={24} className="sm:w-7 sm:h-7" />
              </button>
              <div className="overflow-hidden w-full px-2">
                <div
                  className="flex transition-transform duration-700 ease-in-out [--slide-width:100%] md:[--slide-width:50%] lg:[--slide-width:25%]"
                  style={{ transform: `translateX(calc(-${slideIndex} * var(--slide-width)))` }}
                >
                  {carouselItems.map((item, idx) => (
                    <div key={idx} className="w-[var(--slide-width)] flex-shrink-0 px-4">
                      <div className="h-full bg-black/60 border border-red-600/30 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] group">
                        <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110">{item.icon}</div>
                        <h4 className="text-lg font-bold text-white mb-4 tracking-wider font-orbitron uppercase group-hover:text-red-500 transition-colors">{item.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-rajdhani font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg w-full max-w-md shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-900 bg-[#0a0a0a] sticky top-0">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                Apply <span className="text-red-600">Now</span>
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors" aria-label="Close">
                <X size={24} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h4 className="text-white text-xl font-bold">Application Submitted!</h4>
                <p className="text-gray-400 text-sm">Your application has been sent to our HR team. We'll be in touch soon.</p>
                <button onClick={closeModal} className="mt-4 px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-white hover:text-black transition-all duration-300">
                  Close
                </button>
              </div>
            ) : (
              <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="Your full name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="your@email.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="+91 00000 00000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                  <input required type="text" value={formData.position} onChange={e => setFormData(p => ({ ...p, position: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="Position you're applying for" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter</label>
                  <textarea value={formData.coverLetter} onChange={e => setFormData(p => ({ ...p, coverLetter: e.target.value }))}
                    rows={3} className="w-full bg-gray-900 border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-red-600 transition-colors resize-none" placeholder="Tell us about yourself..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF, DOC, DOCX — Max 10MB)</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md p-2 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 transition-colors cursor-pointer" />
                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                  {resumeFile && <p className="text-green-500 text-sm mt-2">Ready: {resumeFile.name}</p>}
                </div>

                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

                <div className="pt-4 border-t border-gray-900">
                  <button type="submit" disabled={submitting || !!fileError}
                    className="w-full py-4 bg-red-600 text-white font-bold uppercase tracking-wider rounded-md hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
