import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { AppSidebar } from "./AppSidebar";
import { Skeleton } from "@/components/ui/skeleton";

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isBootstrapping } = useAppData();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="grid gap-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl md:col-span-2" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((current) => !current)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 pt-20 md:pt-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
