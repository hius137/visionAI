import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import SplashScreen from "@/pages/splash-screen";
import LoginScreen from "@/pages/login-screen";
import HomeScreen from "@/pages/home-screen";
import CreateTaskScreen from "@/pages/create-task-screen";
import TaskDetailScreen from "@/pages/task-detail-screen";
import VideoPlayerScreen from "@/pages/video-player-screen";
import PurchaseScreen from "@/pages/purchase-screen";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/login" component={LoginScreen} />
      <Route path="/home" component={HomeScreen} />
      <Route path="/create" component={CreateTaskScreen} />
      <Route path="/task/:id" component={TaskDetailScreen} />
      <Route path="/video/:id" component={VideoPlayerScreen} />
      <Route path="/purchase" component={PurchaseScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
