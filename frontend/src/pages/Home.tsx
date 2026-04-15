import Hero from '../components/Hero';
import Vision from '../components/Vision';
import Technology from '../components/Technology';
import Stats from '../components/Stats';
import News from '../components/News';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <Vision />
      <Technology />
      <Stats />
      <News />
      <Contact />
    </div>
  );
}
