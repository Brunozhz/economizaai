import { useState, useEffect } from "react";
import { X, Gift, Sparkles, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutModal from "./CheckoutModal";

// Product configurations (same as ProductGrid)
const PRODUCTS = [
  {
    name: "Basic - 100 créditos",
    credits: 100,
    originalPrice: 49.90,
    discountPrice: 29.90,
  },
  {
    name: "Standard - 200 créditos",
    credits: 200,
    originalPrice: 89.90,
    discountPrice: 49.90,
  },
  {
    name: "Advanced - 400 créditos",
    credits: 400,
    originalPrice: 149.90,
    discountPrice: 89.90,
  },
  {
    name: "Premium - 600 créditos",
    credits: 600,
    originalPrice: 199.90,
    discountPrice: 119.90,
  },
];

interface RemarketingData {
  productName: string;
  couponCode: string;
  discount: number;
}

interface RemarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  remarketingData: RemarketingData | null;
}

const RemarketingModal = ({ isOpen, onClose, remarketingData }: RemarketingModalProps) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [hideRemarketingUI, setHideRemarketingUI] = useState(false);

  // Find the product based on remarketing data
  useEffect(() => {
    if (remarketingData?.productName) {
      const product = PRODUCTS.find(p => p.name === remarketingData.productName);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [remarketingData]);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowCheckout(false);
      setHideRemarketingUI(false);
    }
  }, [isOpen]);

  if (!isOpen || !remarketingData || !selectedProduct) return null;

  const discountedPrice = selectedProduct.discountPrice * (1 - remarketingData.discount / 100);
  const savings = selectedProduct.discountPrice - discountedPrice;

  const handleContinueCheckout = () => {
    // Store remarketing offer in localStorage for CheckoutModal to pick up
    localStorage.setItem('remarketing_offer', JSON.stringify({
      code: remarketingData.couponCode,
      discount: remarketingData.discount,
      productName: remarketingData.productName,
    }));
    
    // Clear the remarketing session since user is proceeding
    localStorage.removeItem('remarketing_session');
    
    // Hide remarketing UI but keep modal mounted
    setHideRemarketingUI(true);
    setShowCheckout(true);
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    setHideRemarketingUI(false);
    onClose();
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    setHideRemarketingUI(false);
    onClose();
  };

  return (
    <>
      {/* Remarketing Offer Modal - only show UI if not hidden */}
      {!hideRemarketingUI && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="relative bg-card border-2 border-primary/50 rounded-3xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl shadow-primary/20">
            {/* Festive Header */}
            <div className="relative gradient-primary p-6 text-center overflow-hidden">
              {/* Sparkles decoration */}
              <div className="absolute top-2 left-4 text-yellow-300 animate-pulse">✨</div>
              <div className="absolute top-4 right-6 text-yellow-300 animate-pulse delay-100">✨</div>
              <div className="absolute bottom-2 left-8 text-yellow-300 animate-pulse delay-200">✨</div>
              
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-primary-foreground" />
              </button>

              {/* Gift icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3 animate-bounce">
                <Gift className="h-8 w-8 text-primary-foreground" />
              </div>

              <h2 className="text-2xl font-black text-primary-foreground">
                🎁 OFERTA EXCLUSIVA!
              </h2>
              <p className="text-primary-foreground/90 text-sm mt-1">
                Você tem um cupom especial esperando!
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Product Info */}
              <div className="text-center space-y-2">
                <p className="text-muted-foreground text-sm">Produto selecionado:</p>
                <h3 className="text-xl font-bold text-foreground">{selectedProduct.name}</h3>
              </div>

              {/* Discount Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">{remarketingData.discount}% OFF</span>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Price comparison */}
              <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Preço normal:</span>
                  <span className="line-through text-muted-foreground">
                    R$ {selectedProduct.discountPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Desconto ({remarketingData.discount}%):</span>
                  <span className="text-primary font-medium">
                    -R$ {savings.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Preço final:</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-primary">
                        R$ {discountedPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon code display */}
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/30">
                <span className="text-sm text-muted-foreground">Cupom:</span>
                <code className="font-mono font-bold text-primary text-lg">{remarketingData.couponCode}</code>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleContinueCheckout}
                className="w-full h-14 gradient-primary text-primary-foreground font-bold text-lg rounded-xl animate-pulse hover:animate-none"
              >
                <span>Continuar Compra</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              {/* Urgency message */}
              <p className="text-center text-xs text-muted-foreground">
                ⏰ Esta oferta é válida por tempo limitado
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCheckoutClose}
        product={selectedProduct}
      />
    </>
  );
};

export default RemarketingModal;
