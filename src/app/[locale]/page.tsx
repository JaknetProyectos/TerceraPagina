import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExperiencesStore from "@/components/ExperiencesStore";
import ContactAventura from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ArmaAventuraSection from "@/components/ArmaAventuraSection";
import CotizacionSection from "@/components/CotizacionSection";
import MisionSection from "@/components/MisionSection";
import { CartProvider } from "@/context/CartContext";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ArmaAventuraSection />
      <CotizacionSection />
      <ContactAventura />
      <Footer />
    </main>
  );
}
