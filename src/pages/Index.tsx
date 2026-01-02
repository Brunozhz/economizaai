import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsBar from "@/components/BenefitsBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
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
    </div>
  );
};

export default Index;
