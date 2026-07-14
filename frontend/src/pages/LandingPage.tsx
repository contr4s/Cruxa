import '../theme/landing.css';

import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Stats } from '../components/landing/Stats';
import { CallToAction } from '../components/landing/CallToAction';
import { Footer } from '../components/landing/Footer';


export default function LandingPage() {

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
