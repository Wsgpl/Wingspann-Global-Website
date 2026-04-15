import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Loader from "./components/Loader";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import TechnologyPage from "./pages/Technology";
import Solutions from "./pages/Solutions";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Publications from "./pages/Publications";
import Apps from "./pages/Apps";
import ContactPage from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import UasPage from "./pages/UasPage";
import AquilaUAVPage from "./pages/AquilaUAV";
import ProductDetailPage from "./pages/ProductDetail";
import SpaceSystemsPage from "./pages/SpaceSystems";
import AerospaceComponentsPage from "./pages/AerospaceComponents";
import OpticalSystemsPage from "./pages/OpticalSystems";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" onComplete={() => setLoading(false)} />
      ) : (
        <BrowserRouter>
          {/* Page fade-in synced with shutter reveal */}
          <motion.div
            key="main-app"
            className="min-h-screen bg-black overflow-x-hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          >
            <Navigation />
            <main className="pt-20 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about/mission" element={<About />} />
                <Route path="/about/vision" element={<About />} />
                <Route path="/technology" element={<TechnologyPage />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/technology/uas" element={<UasPage />} />
                <Route path="/technology/aquila-uav" element={<AquilaUAVPage />} />
                <Route path="/technology/space" element={<SpaceSystemsPage />} />
                <Route path="/technology/aerospace" element={<AerospaceComponentsPage />} />
                <Route path="/technology/optical" element={<OpticalSystemsPage />} />
                <Route path="/technology/:slug" element={<ProductDetailPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </motion.div>
        </BrowserRouter>
      )}
    </AnimatePresence>
  );
}

export default App;
