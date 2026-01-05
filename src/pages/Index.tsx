import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsBar from "@/components/BenefitsBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import InstallAppBanner from "@/components/InstallAppBanner";
import SupportChatWidget from "@/components/SupportChatWidget";
import RemarketingModal from "@/components/RemarketingModal";
import { useGreeting } from "@/hooks/useGreeting";

interface RemarketingData {
  productName: string;
  couponCode: string;
  discount: number;
}

const Index = () => {
  useGreeting();
  const [searchParams, setSearchParams] = useSearchParams();
  const [remarketingData, setRemarketingData] = useState<RemarketingData | null>(null);
  const [showRemarketingModal, setShowRemarketingModal] = useState(false);

  // Check for remarketing parameters on mount
  useEffect(() => {
    const isRemarketing = searchParams.get('remarketing') === 'true';
    const produto = searchParams.get('produto');
    const cupom = searchParams.get('cupom');
    const desconto = searchParams.get('desconto');

    if (isRemarketing && produto && cupom && desconto) {
      setRemarketingData({
        productName: produto,
        couponCode: cupom,
        discount: parseInt(desconto, 10),
      });
      setShowRemarketingModal(true);

      // Clear URL params after capturing (cleaner URL)
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCloseRemarketingModal = () => {
    setShowRemarketingModal(false);
    setRemarketingData(null);
  };
  
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

      {/* Remarketing Modal - appears when user clicks recovery link */}
      <RemarketingModal
        isOpen={showRemarketingModal}
        onClose={handleCloseRemarketingModal}
        remarketingData={remarketingData}
      />
    </div>
  );
};

export default Index;
