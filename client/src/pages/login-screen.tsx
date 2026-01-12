import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import bgImage from "@assets/generated_images/ai_tech_abstract_background.png";

export default function LoginScreen() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("credits", "100");
    setLocation("/home");
  };

  return (
    <div 
      className="mobile-container relative flex flex-col overflow-hidden grain"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/95" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center glow-sm">
            <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-3 tracking-tight text-center"
        >
          VisionAI Studio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground text-center mb-4 max-w-[280px]"
        >
          AI-Powered Image & Video Creation
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex gap-2 mb-16"
        >
          {["Try-On", "Video", "AI Magic"].map((tag, i) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium glass text-white/80"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 px-8 pb-12"
      >
        <Button
          data-testid="button-google-signin"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-white hover:bg-white/90 text-gray-900 font-semibold text-base shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Chrome className="w-5 h-5 mr-3" />
          )}
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By signing in, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
