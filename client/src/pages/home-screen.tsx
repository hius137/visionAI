import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  LogOut,
  Plus,
  Image as ImageIcon,
  Video,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  productImage: string;
  tryOnCount: number;
  videoCount: number;
}

const mockTasks: Task[] = [
  {
    id: "1",
    status: "completed",
    createdAt: "2024-01-12T10:30:00Z",
    productImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop",
    tryOnCount: 4,
    videoCount: 2,
  },
  {
    id: "2",
    status: "processing",
    createdAt: "2024-01-12T09:15:00Z",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    tryOnCount: 0,
    videoCount: 0,
  },
  {
    id: "3",
    status: "completed",
    createdAt: "2024-01-11T16:45:00Z",
    productImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=200&fit=crop",
    tryOnCount: 6,
    videoCount: 1,
  },
  {
    id: "4",
    status: "failed",
    createdAt: "2024-01-10T14:20:00Z",
    productImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop",
    tryOnCount: 0,
    videoCount: 0,
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [credits, setCredits] = useState(100);
  const [tasks] = useState<Task[]>(mockTasks);

  useEffect(() => {
    const storedCredits = localStorage.getItem("credits");
    if (storedCredits) setCredits(parseInt(storedCredits));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("credits");
    setLocation("/login");
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "processing": return "status-processing";
      case "completed": return "status-completed";
      case "failed": return "status-failed";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "processing": return "Processing";
      case "completed": return "Completed";
      case "failed": return "Failed";
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      <header className="sticky top-0 z-50 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="font-bold text-lg">VisionAI</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/purchase">
              <Button
                data-testid="button-wallet"
                variant="ghost"
                size="sm"
                className="h-9 px-3 rounded-xl glass hover:bg-white/10"
              >
                <Wallet className="w-4 h-4 mr-1.5 text-primary" />
                <span className="font-semibold">{credits}</span>
              </Button>
            </Link>
            <Button
              data-testid="button-signout"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold gradient-text">{credits}</span>
                <span className="text-sm text-muted-foreground">credits</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary" />
            </div>
          </div>
          <Link href="/purchase">
            <Button
              data-testid="button-topup"
              variant="outline"
              className="w-full h-11 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
            >
              Top up now
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/create">
            <Button
              data-testid="button-create-task"
              className="w-full h-16 rounded-2xl gradient-primary text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 glow-sm"
            >
              <Plus className="w-6 h-6 mr-2" />
              Create New Task
            </Button>
          </Link>
        </motion.div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
            <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
          </div>

          <AnimatePresence>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <Link href={`/task/${task.id}`}>
                    <div
                      data-testid={`card-task-${task.id}`}
                      className="glass-card rounded-2xl p-4 cursor-pointer hover:bg-white/5 transition-all duration-200 group"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={task.productImage}
                            alt="Product"
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <Badge
                            className={`absolute -top-2 -right-2 ${getStatusColor(task.status)} text-white text-[10px] px-2 py-0.5 border-0`}
                          >
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3 h-3" />
                            {formatDate(task.createdAt)}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{task.tryOnCount}</span>
                              <span className="text-xs text-muted-foreground">images</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-pink-500" />
                              <span className="text-sm font-medium">{task.videoCount}</span>
                              <span className="text-xs text-muted-foreground">videos</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No tasks yet</p>
              <p className="text-sm text-muted-foreground/70">Create your first AI task</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
