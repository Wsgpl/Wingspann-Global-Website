import {
  Mail,
  MapPin,
  Phone,
  Paperclip,
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    inquiryType: "",
    message: "",
    file: null as File | null,
  });

  const [isSending, setIsSending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("org", formData.organization);
      form.append("subject", formData.subject);
      form.append("inquiryType", formData.inquiryType);
      form.append("message", formData.message);
      if (formData.file) {
        form.append("attachment", formData.file);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your message has been sent.");
        setFormData({
          name: "",
          email: "",
          organization: "",
          subject: "",
          inquiryType: "",
          message: "",
          file: null,
        });
      } else {
        alert(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Top Banner Section with Unblocked Drone Image */}
      <section className="relative w-full h-[55vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ filter: 'brightness(0.85) contrast(1.1)' }}
            className="w-full h-full object-cover opacity-70 mix-blend-screen transform scale-105 transition-transform duration-[10s] ease-out hover:scale-100"
          >
            <source src="/contact.mp4" type="video/mp4" />
          </video>
          {/* Aesthetic Gradients & Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/30 z-10"></div>
          <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay z-10"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-background opacity-20 z-0 pointer-events-none"></div>

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 tracking-tight leading-none">
            <span className="text-white drop-shadow-2xl">GET IN </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 drop-shadow-xl">
              TOUCH
            </span>
          </h1>
          <div className="h-1 w-24 bg-red-600 mx-auto mt-6 mb-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm -scale-x-100 hidden">
            We're ready to discuss partnerships, projects, or opportunities.
          </p>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-semibold drop-shadow-md">
            We're ready to discuss partnerships, projects, or opportunities. <br /> Reach out to our team today to help shape the future of autonomous systems.
          </p>
        </div>
      </section>

      {/* Main Content Section (Form & Info Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-12 mb-20">
        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
          <div className="absolute -inset-10 bg-black blur-xl z-[-1] opacity-80"></div>
          <div className="group bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:border-red-600 p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
            <div className="inline-block p-4 bg-red-600/10 border border-red-600/30 mb-6 rounded">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">HEADQUARTERS</h3>
            <p className="text-gray-500">
              Plot 2 & 3, Gut No. 53, Shajapur, MIDC Waluj, Chh. Sambhajinagar - 431136, Maharashtra
            </p>
            <p className="text-gray-200 text-sm mt-2">INDIA</p>
          </div>

          <div className="group bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:border-red-600 p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
            <div className="inline-block p-4 bg-red-600/10 border border-red-600/30 mb-6 rounded">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">EMAIL</h3>
            <a href="mailto:info@wingspannglobal.com" className="text-gray-200 hover:text-red-600 transition-colors">
              info@wingspannglobal.com
            </a>
          </div>

          <div className="group bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:border-red-600 p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
            <div className="inline-block p-4 bg-red-600/10 border border-red-600/30 mb-6 rounded">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">PHONE</h3>
            <p className="text-gray-500">Available 24/7</p>
            <p className="text-gray-300 text-sm mt-2">+91 91757 78119</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="FULL NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-black border border-gray-700 px-6 py-4 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black border border-gray-700 px-6 py-4 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="ORGANIZATION"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="bg-black border border-gray-700 px-6 py-4 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
            />
            <select
              value={formData.inquiryType}
              onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
              className="bg-black border border-gray-700 px-6 py-4 text-white focus:border-red-600 focus:outline-none"
              required
            >
              <option value="">INQUIRY TYPE</option>
              <option>General</option>
              <option>Sales</option>
              <option>Partnership & MoU</option>
              <option>Careers</option>
              <option>Vendor</option>
              <option>Technical</option>
              <option>Newsroom</option>
              <option>After Sales & Support</option>
            </select>
            <input
              type="text"
              placeholder="SUBJECT"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-black border border-gray-700 px-6 py-4 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
              required
            />
            <div className="relative border border-gray-700 p-4 flex items-center justify-between bg-black rounded">
              <label className="text-gray-500 text-sm">Attach File (optional)</label>
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} className="text-gray-300" />
              <Paperclip className="absolute right-4 text-red-600" />
            </div>
            <textarea
              placeholder="MESSAGE"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="sm:col-span-2 bg-black border border-gray-700 px-6 py-4 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none resize-none"
              required
            ></textarea>
            <button
              type="submit"
              disabled={isSending}
              className={`sm:col-span-2 py-4 font-bold tracking-widest transition-all duration-300 ${isSending
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-white hover:text-red-600"
                }`}
            >
              {isSending ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>

        {/* Removed Social Links */}

        {/* HQ Map Embed Section */}
        <div className="mt-20 mb-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-white tracking-widest uppercase">
              Global <span className="text-red-600">Presence</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-red-600/50 to-transparent ml-8"></div>
          </div>

          <div className="relative w-full h-[500px] p-1 bg-gradient-to-b from-gray-800 to-black group rounded-sm shadow-2xl shadow-red-900/10">
            {/* Tech decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-600 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-600 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-600 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 pointer-events-none"></div>

            <div className="w-full h-full bg-black overflow-hidden relative">
              {/* Inner overlay edge blend */}
              <div className="absolute inset-0 border-[6px] border-black pointer-events-none z-10"></div>

              <iframe
                title="Wingspann Global Headquarters"
                src="https://maps.google.com/maps?q=19.8640409,75.221675&t=&z=18&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                className="border-0 w-full h-full filter invert-[90%] hue-rotate-[180deg] grayscale-[20%] contrast-[120%] opacity-70 group-hover:opacity-100 group-hover:invert-0 group-hover:hue-rotate-0 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-[1000ms]"
              ></iframe>

              {/* Clickable map overlay */}
              <a
                href="https://www.google.com/maps/place/WINGSPANN+GLOBAL+PVT+LTD/@19.8640447,75.2215808,54m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3bdb9b00692c06cd:0x945bbb9b79958c51!2sWINGSPANN+GLOBAL+PVT+LTD!8m2!3d19.8640409!4d75.221675!16s%2Fg%2F11z1pm8yrl!3m5!1s0x3bdb9b00692c06cd:0x945bbb9b79958c51!8m2!3d19.8640409!4d75.221675!16s%2Fg%2F11z1pm8yrl"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 cursor-pointer"
                title="Open Location in Google Maps"
              >
                <span className="sr-only">Open Wingspann Global location in Google Maps</span>
              </a>

              {/* Interactive overlay card that appears on hover */}
              <div className="absolute bottom-8 left-8 bg-black/90 backdrop-blur-md border border-red-600/50 p-4 rounded-sm z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <p className="text-white text-xs sm:text-sm font-bold tracking-widest uppercase">Live Tracking: HQ 📍</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
