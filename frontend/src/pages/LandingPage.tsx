import { useScrollReveal } from '../hooks/useScrollReveal';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Stats } from '../components/landing/Stats';
import { CallToAction } from '../components/landing/CallToAction';
import { Footer } from '../components/landing/Footer';


export function LandingPage() {
  useScrollReveal();

  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <CallToAction />
      <Footer />
    </div>
  );
}
