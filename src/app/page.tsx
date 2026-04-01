import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExperiencesStore from "@/components/ExperiencesStore";
import ContactAventura from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ArmaAventuraSection from "@/components/ArmaAventuraSection";
import ConocenosSection from "@/components/ConocenosSection";
import MisionSection from "@/components/MisionSection";
import { CartProvider } from "@/components/CartContext";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ArmaAventuraSection />
      <ConocenosSection />
      <ContactAventura />
      <Footer />
    </main>
  );
}
