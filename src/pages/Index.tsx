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

const Index = () => {
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
    </div>
  );
};

export default Index;
