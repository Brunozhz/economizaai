import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsBar from "@/components/BenefitsBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import InstallAppBanner from "@/components/InstallAppBanner";
import SupportChatWidget from "@/components/SupportChatWidget";
import { useGreeting } from "@/hooks/useGreeting";

const Index = () => {
  useGreeting();
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main>
        <HeroSection />
        <ProductGrid />
        <BenefitsBar />
      </main>
      <Footer />
      <InstallAppBanner />
      <SupportChatWidget />
    </div>
  );
};

export default Index;
