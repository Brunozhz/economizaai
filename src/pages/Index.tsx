import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsBar from "@/components/BenefitsBar";
import ProductGrid from "@/components/ProductGrid";
import PriceComparison from "@/components/PriceComparison";
import Footer from "@/components/Footer";
import InstallAppBanner from "@/components/InstallAppBanner";
import SupportChatWidget from "@/components/SupportChatWidget";
import RemarketingModal from "@/components/RemarketingModal";

interface RemarketingData {
  productName: string;
  couponCode: string;
  discount: number;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [remarketingData, setRemarketingData] = useState<RemarketingData | null>(null);
  const [showRemarketingModal, setShowRemarketingModal] = useState(false);

  // Check for remarketing parameters on mount OR localStorage
  useEffect(() => {
    const isRemarketing = searchParams.get('remarketing') === 'true';
    const produto = searchParams.get('produto');
    const cupom = searchParams.get('cupom');
    const desconto = searchParams.get('desconto');

    if (isRemarketing && produto && cupom && desconto) {
      const data: RemarketingData = {
        productName: produto,
        couponCode: cupom,
        discount: parseInt(desconto, 10),
      };
      
      // Persist to localStorage to survive page refreshes
      localStorage.setItem('remarketing_session', JSON.stringify(data));
      
      setRemarketingData(data);
      setShowRemarketingModal(true);

      // Clear URL params after capturing (cleaner URL)
      setSearchParams({});
    } else {
      // Check localStorage for persisted remarketing session
      const savedSession = localStorage.getItem('remarketing_session');
      if (savedSession) {
        try {
          const data = JSON.parse(savedSession) as RemarketingData;
          setRemarketingData(data);
          setShowRemarketingModal(true);
        } catch (e) {
          console.error('Error parsing remarketing session:', e);
          localStorage.removeItem('remarketing_session');
        }
      }
    }
  }, [searchParams, setSearchParams]);

  const handleCloseRemarketingModal = () => {
    setShowRemarketingModal(false);
    setRemarketingData(null);
    // Clear persisted session when user closes
    localStorage.removeItem('remarketing_session');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main>
        <HeroSection />
        <ProductGrid />
        <BenefitsBar />
        <PriceComparison />
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
