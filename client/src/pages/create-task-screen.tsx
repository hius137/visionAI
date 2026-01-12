import { useState, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Upload,
  Check,
  ChevronRight,
  User,
  UserX,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const contexts = [
  { id: "studio", label: "Studio Background" },
  { id: "outdoor", label: "Outdoor Scene" },
  { id: "lifestyle", label: "Lifestyle Setting" },
  { id: "minimal", label: "Minimal White" },
  { id: "custom", label: "Custom..." },
];

const modelTypes = [
  { id: "female_asian", label: "Female - Asian" },
  { id: "female_western", label: "Female - Western" },
  { id: "male_asian", label: "Male - Asian" },
  { id: "male_western", label: "Male - Western" },
  { id: "custom", label: "Custom..." },
];

const IMAGE_CREATION_COST = 10;

export default function CreateTaskScreen() {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasModel, setHasModel] = useState<boolean | null>(null);
  const [selectedContext, setSelectedContext] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [selectedModelType, setSelectedModelType] = useState("");
  const [customModelType, setCustomModelType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

  const credits = parseInt(localStorage.getItem("credits") || "100");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImage(reader.result as string);
      setIsUploading(false);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTask = async () => {
    if (credits < IMAGE_CREATION_COST) {
      setShowInsufficientCredits(true);
      return;
    }

    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 2000));
    
    const newCredits = credits - IMAGE_CREATION_COST;
    localStorage.setItem("credits", newCredits.toString());
    
    setLocation("/task/new-1");
  };

  const canProceed = step === 2 && 
    hasModel !== null && 
    (selectedContext && (selectedContext !== "custom" || customContext)) &&
    (hasModel || (selectedModelType && (selectedModelType !== "custom" || customModelType)));

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
          <div>
            <h1 className="font-semibold">Create New Task</h1>
            <p className="text-xs text-muted-foreground">Step {step} of 2</p>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? "gradient-primary" : "bg-muted"}`} />
          <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? "gradient-primary" : "bg-muted"}`} />
        </div>
      </div>

      <main className="px-4 pb-32">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Upload Product Image</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a clear image of the product you want to create try-on images for
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-file"
              />

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full glass-card rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors disabled:opacity-50"
                  data-testid="button-gallery"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold">Choose from Gallery</p>
                    <p className="text-sm text-muted-foreground">Select an existing photo</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isUploading}
                  className="w-full glass-card rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors disabled:opacity-50"
                  data-testid="button-camera"
                >
                  <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-pink-500" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold">Take a Photo</p>
                    <p className="text-sm text-muted-foreground">Use your camera</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-6 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Uploading...</p>
                    <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Configure Task</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how AI will generate your try-on images
                </p>
              </div>

              {productImage && (
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <img
                    src={productImage}
                    alt="Product"
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Product Image</p>
                    <p className="text-xs text-muted-foreground">Ready for processing</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium">Model Type</Label>
                <RadioGroup
                  value={hasModel === null ? "" : hasModel ? "with" : "without"}
                  onValueChange={(v) => setHasModel(v === "with")}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="with-model"
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                      hasModel === true ? "ring-2 ring-primary bg-primary/10" : "hover:bg-white/5"
                    }`}
                  >
                    <RadioGroupItem value="with" id="with-model" className="sr-only" />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <User className={`w-8 h-8 ${hasModel === true ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">With Model</span>
                    </div>
                  </Label>
                  <Label
                    htmlFor="without-model"
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                      hasModel === false ? "ring-2 ring-primary bg-primary/10" : "hover:bg-white/5"
                    }`}
                  >
                    <RadioGroupItem value="without" id="without-model" className="sr-only" />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <UserX className={`w-8 h-8 ${hasModel === false ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">Product Only</span>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Background Context</Label>
                <Select value={selectedContext} onValueChange={setSelectedContext}>
                  <SelectTrigger data-testid="select-context" className="h-12 rounded-xl bg-card border-border">
                    <SelectValue placeholder="Select a context" />
                  </SelectTrigger>
                  <SelectContent>
                    {contexts.map((ctx) => (
                      <SelectItem key={ctx.id} value={ctx.id}>
                        {ctx.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedContext === "custom" && (
                  <Input
                    data-testid="input-custom-context"
                    placeholder="Describe your custom context..."
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                    className="h-12 rounded-xl bg-card border-border"
                  />
                )}
              </div>

              <AnimatePresence>
                {hasModel === false && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-medium">AI Model Type</Label>
                    <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                      <SelectTrigger data-testid="select-model-type" className="h-12 rounded-xl bg-card border-border">
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelTypes.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedModelType === "custom" && (
                      <Input
                        data-testid="input-custom-model"
                        placeholder="Describe your custom model..."
                        value={customModelType}
                        onChange={(e) => setCustomModelType(e.target.value)}
                        className="h-12 rounded-xl bg-card border-border"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cost</p>
                  <p className="text-xs text-muted-foreground">Will be deducted from your balance</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{IMAGE_CREATION_COST}</p>
                  <p className="text-xs text-muted-foreground">credits</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {step === 2 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 glass">
          <div className="max-w-[430px] mx-auto">
            <Button
              data-testid="button-create"
              onClick={handleCreateTask}
              disabled={!canProceed || isCreating}
              className="w-full h-14 rounded-2xl gradient-primary text-base font-semibold shadow-lg disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Task...
                </>
              ) : (
                <>Create Task • {IMAGE_CREATION_COST} Credits</>
              )}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showInsufficientCredits} onOpenChange={setShowInsufficientCredits}>
        <DialogContent className="glass-card border-border max-w-[340px] rounded-2xl">
          <DialogHeader>
            <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <DialogTitle className="text-center">Insufficient Credits</DialogTitle>
            <DialogDescription className="text-center">
              You need {IMAGE_CREATION_COST} credits to create a task. Your current balance is {credits} credits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Link href="/purchase" className="w-full">
              <Button className="w-full h-12 rounded-xl gradient-primary">
                Top Up Credits
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => setShowInsufficientCredits(false)}
              className="w-full h-12 rounded-xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
