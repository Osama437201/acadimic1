import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustedBy from "../components/TrustedBy";
import AboutUs from "../components/AboutUs";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Stats from "../components/Stats";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBy />
      <AboutUs />
      <Features />
      <Pricing />
      <Stats />
      <FAQ />
      <Footer />
    </>
  );
}