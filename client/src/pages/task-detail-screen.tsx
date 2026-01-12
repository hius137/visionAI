import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Image as ImageIcon,
  Video,
  Play,
  Share2,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const videoActions = [
  { id: "walk", label: "Walking" },
  { id: "spin", label: "360° Spin" },
  { id: "pose", label: "Model Pose" },
  { id: "dance", label: "Light Dance" },
];

const VIDEO_CREATION_COST = 20;

interface TryOnImage {
  id: string;
  url: string;
}

interface VideoResult {
  id: string;
  url: string;
  action: string;
  thumbnailUrl: string;
}

const mockTryOnImages: TryOnImage[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop" },
  { id: "2", url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop" },
  { id: "3", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop" },
  { id: "4", url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop" },
];

const mockVideos: VideoResult[] = [
  { 
    id: "v1", 
    url: "https://example.com/video1.mp4", 
    action: "Walking",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop"
  },
  { 
    id: "v2", 
    url: "https://example.com/video2.mp4", 
    action: "360° Spin",
    thumbnailUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=200&fit=crop"
  },
];

export default function TaskDetailScreen() {
  const [, params] = useRoute("/task/:id");
  const taskId = params?.id;
  
  const [status, setStatus] = useState<"processing" | "completed" | "failed">(
    taskId === "new-1" ? "processing" : "completed"
  );
  const [tryOnImages, setTryOnImages] = useState<TryOnImage[]>(
    taskId === "new-1" ? [] : mockTryOnImages
  );
  const [videos, setVideos] = useState<VideoResult[]>(
    taskId === "new-1" ? [] : mockVideos
  );
  const [isPolling, setIsPolling] = useState(taskId === "new-1");
  const [errorMsg, setErrorMsg] = useState<string | null>(
    taskId === "4" ? "Image processing failed due to unsupported format" : null
  );

  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedImageForVideo, setSelectedImageForVideo] = useState<TryOnImage | null>(null);
  const [selectedVideoAction, setSelectedVideoAction] = useState("");
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  const credits = parseInt(localStorage.getItem("credits") || "100");

  useEffect(() => {
    if (taskId === "new-1" && isPolling) {
      const timer = setTimeout(() => {
        setTryOnImages(mockTryOnImages);
        setStatus("completed");
        setIsPolling(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [taskId, isPolling]);

  const handleCreateVideo = async () => {
    if (!selectedImageForVideo || !selectedVideoAction) return;
    
    setIsCreatingVideo(true);
    await new Promise((r) => setTimeout(r, 2000));
    
    const newCredits = credits - VIDEO_CREATION_COST;
    localStorage.setItem("credits", newCredits.toString());
    
    const newVideo: VideoResult = {
      id: `v${Date.now()}`,
      url: "https://example.com/new-video.mp4",
      action: videoActions.find(a => a.id === selectedVideoAction)?.label || "",
      thumbnailUrl: selectedImageForVideo.url,
    };
    setVideos([...videos, newVideo]);
    
    setShowVideoDialog(false);
    setSelectedImageForVideo(null);
    setSelectedVideoAction("");
    setIsCreatingVideo(false);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "processing": return <Loader2 className="w-5 h-5 animate-spin" />;
      case "completed": return <CheckCircle2 className="w-5 h-5" />;
      case "failed": return <XCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "processing": return "status-processing";
      case "completed": return "status-completed";
      case "failed": return "status-failed";
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen pb-8">
      <header className="sticky top-0 z-50 glass px-4 py-3">
        <div className="flex items-center justify-between">
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
              <h1 className="font-semibold">Task Details</h1>
              <p className="text-xs text-muted-foreground">ID: {taskId}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor()} text-white border-0 gap-1.5`}>
            {getStatusIcon()}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Created Jan 12, 2024 at 10:30 AM
            </span>
          </div>
          {isPolling && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              Auto-updating...
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Original Product</h2>
          <div className="glass-card rounded-2xl p-4">
            <img
              src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop"
              alt="Product"
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        </motion.div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-muted-foreground">{errorMsg}</p>
            </div>
          </motion.div>
        )}

        {status === "processing" && tryOnImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Creating Try-On Images</h3>
            <p className="text-sm text-muted-foreground">
              AI is working its magic. This usually takes 30-60 seconds...
            </p>
          </motion.div>
        )}

        {tryOnImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">Try-On Results</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ImageIcon className="w-4 h-4 text-primary" />
                {tryOnImages.length} images
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tryOnImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative group"
                >
                  <img
                    src={img.url}
                    alt={`Try-on ${index + 1}`}
                    className="w-full aspect-[4/5] object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <Button
                      data-testid={`button-create-video-${img.id}`}
                      size="sm"
                      onClick={() => {
                        setSelectedImageForVideo(img);
                        setShowVideoDialog(true);
                      }}
                      className="rounded-lg gradient-primary text-xs h-8"
                    >
                      <Video className="w-3.5 h-3.5 mr-1.5" />
                      Video
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tryOnImages.length > 0 && videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5 border-dashed border-2 border-primary/30"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Next Step: Create Video</h3>
                <p className="text-sm text-muted-foreground">
                  Tap the "Video" button on any try-on image to generate an AI video with custom actions.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">Videos</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Video className="w-4 h-4 text-pink-500" />
                {videos.length} videos
              </div>
            </div>
            <div className="space-y-3">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={`/video/${video.id}`}>
                    <div
                      data-testid={`card-video-${video.id}`}
                      className="glass-card rounded-2xl p-3 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group"
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnailUrl}
                          alt="Video thumbnail"
                          className="w-24 h-16 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{video.action}</p>
                        <p className="text-xs text-muted-foreground">AI Generated Video</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="glass-card border-border max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create Video</DialogTitle>
            <DialogDescription>
              Choose an action for your AI-generated video
            </DialogDescription>
          </DialogHeader>

          {selectedImageForVideo && (
            <img
              src={selectedImageForVideo.url}
              alt="Selected"
              className="w-full h-40 object-cover rounded-xl"
            />
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Video Action</label>
            <Select value={selectedVideoAction} onValueChange={setSelectedVideoAction}>
              <SelectTrigger data-testid="select-video-action" className="h-12 rounded-xl bg-card border-border">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {videoActions.map((action) => (
                  <SelectItem key={action.id} value={action.id}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="glass rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm">Cost</span>
            <span className="font-bold text-primary">{VIDEO_CREATION_COST} credits</span>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              data-testid="button-confirm-video"
              onClick={handleCreateVideo}
              disabled={!selectedVideoAction || isCreatingVideo || credits < VIDEO_CREATION_COST}
              className="w-full h-12 rounded-xl gradient-primary"
            >
              {isCreatingVideo ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>Create Video</>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowVideoDialog(false)}
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
