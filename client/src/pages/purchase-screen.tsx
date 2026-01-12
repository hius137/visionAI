import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Star,
  Check,
  Loader2,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: string;
  priceValue: number;
  isPopular?: boolean;
  bonus?: string;
}

const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for trying out",
    credits: 50,
    price: "$4.99",
    priceValue: 4.99,
  },
  {
    id: "basic",
    name: "Basic",
    description: "For regular users",
    credits: 150,
    price: "$9.99",
    priceValue: 9.99,
    bonus: "+20 Bonus",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best value for power users",
    credits: 500,
    price: "$24.99",
    priceValue: 24.99,
    isPopular: true,
    bonus: "+100 Bonus",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For businesses & teams",
    credits: 1500,
    price: "$59.99",
    priceValue: 59.99,
    bonus: "+400 Bonus",
  },
];

export default function PurchaseScreen() {
  const { toast } = useToast();
  const [currentCredits, setCurrentCredits] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const storedCredits = localStorage.getItem("credits");
    if (storedCredits) setCurrentCredits(parseInt(storedCredits));
  }, []);

  const handlePurchase = async (pkg: Package) => {
    setPurchasingId(pkg.id);
    await new Promise((r) => setTimeout(r, 2000));
    
    const bonusCredits = pkg.bonus ? parseInt(pkg.bonus.replace(/[^0-9]/g, "")) : 0;
    const newCredits = currentCredits + pkg.credits + bonusCredits;
    localStorage.setItem("credits", newCredits.toString());
    setCurrentCredits(newCredits);
    
    setPurchasingId(null);
    toast({
      title: "Purchase Successful! 🎉",
      description: `${pkg.credits + bonusCredits} credits have been added to your account`,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      <header className="sticky top-0 z-50 glass px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Button
              data-testid="button-back"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">Buy Credits</h1>
            <p className="text-xs text-muted-foreground">Power your AI creations</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-white/10"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-sm">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold gradient-text">{currentCredits}</span>
            <span className="text-muted-foreground">credits</span>
          </div>
        </motion.div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Choose a Package</h2>
          <div className="space-y-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div
                  data-testid={`card-package-${pkg.id}`}
                  className={`glass-card rounded-2xl p-5 relative overflow-hidden ${
                    pkg.isPopular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-xl gradient-primary text-white border-0 px-3 py-1">
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{pkg.price}</p>
                      <p className="text-xs text-muted-foreground">one-time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{pkg.credits}</span>
                      <span className="text-sm text-muted-foreground">credits</span>
                    </div>
                    {pkg.bonus && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-0">
                        <Check className="w-3 h-3 mr-1" />
                        {pkg.bonus}
                      </Badge>
                    )}
                  </div>

                  <Button
                    data-testid={`button-buy-${pkg.id}`}
                    onClick={() => handlePurchase(pkg)}
                    disabled={purchasingId !== null}
                    className={`w-full h-12 rounded-xl font-semibold ${
                      pkg.isPopular
                        ? "gradient-primary glow-sm"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {purchasingId === pkg.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Buy Now</>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                All purchases are processed securely through the App Store. Credits are added instantly after successful payment.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
