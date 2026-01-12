import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function VideoPlayerScreen() {
  const [, params] = useRoute("/video/:id");
  const videoId = params?.id;
  const { toast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const handleShare = () => {
    toast({
      title: "Link Copied",
      description: "Video link has been copied to clipboard",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = (progress / 100) * 15;
  const duration = 15;

  return (
    <div className="mobile-container bg-black min-h-screen flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-[430px] mx-auto">
          <Link href="/home">
            <Button
              data-testid="button-back"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-white">Walking</h1>
            <p className="text-xs text-white/60">AI Generated Video</p>
          </div>
          <Button
            data-testid="button-share"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 text-white" />
          </Button>
        </div>
      </header>

      <div 
        className="flex-1 flex items-center justify-center relative"
        onClick={() => setShowControls(!showControls)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-[9/16] max-h-[calc(100vh-200px)] bg-gradient-to-b from-purple-900/30 to-black flex items-center justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop"
            alt="Video frame"
            className="w-full h-full object-cover opacity-80"
          />
          
          {!isPlaying && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(true);
              }}
              className="absolute w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
              data-testid="button-play-main"
            >
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </motion.button>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-xs text-white/60 mb-2">Video ID: {videoId}</p>
            <p className="text-xs text-white/40">Demo video player - actual video not loaded</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-12"
      >
        <div className="max-w-[430px] mx-auto space-y-4">
          <div className="space-y-2">
            <Slider
              value={[progress]}
              onValueChange={([v]) => setProgress(v)}
              max={100}
              step={1}
              className="cursor-pointer"
              data-testid="slider-progress"
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-white/10"
              data-testid="button-skip-back"
            >
              <SkipBack className="w-6 h-6 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-white hover:bg-white/90"
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-gray-900" fill="currentColor" />
              ) : (
                <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-white/10"
              data-testid="button-skip-forward"
            >
              <SkipForward className="w-6 h-6 text-white" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-white/10"
              onClick={() => setIsMuted(!isMuted)}
              data-testid="button-mute"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-white/10"
              data-testid="button-fullscreen"
            >
              <Maximize className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
