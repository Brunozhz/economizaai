import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import BenefitsBar from "@/components/BenefitsBar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)]">
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
