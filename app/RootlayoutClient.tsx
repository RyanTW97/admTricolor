"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAuthMap } from "@/utils/auth";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [autenticado, setAutenticado] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const auth = getAuthMap();
    setAutenticado(!!(email && auth[email]));
  }, []);

  const esLogin = pathname === "/login";
  const soloLogin = !autenticado && esLogin;

  if (soloLogin) return <>{children}</>; // solo muestra el login limpio

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4">
        {children}
        <Toaster richColors position="top-right" />
      </main>
    </SidebarProvider>
  );
}
