"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== "/";
  return (
    <>
      {showHeader && <SiteHeader />}
      {children}
    </>
  );
}


