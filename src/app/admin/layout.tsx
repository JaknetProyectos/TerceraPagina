"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  MapPin,
  TentTree,
  Clock1,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import Image from "next/image";
import Loading from "@/components/Loading";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservaciones", label: "Reservaciones", icon: Calendar },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  { href: "/admin/experiencias", label: "Experiencias", icon: Clock1 },
  { href: "/admin/categorias", label: "Categorias", icon: MapPin },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 PROTEGER RUTA
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // 🚪 LOGOUT REAL
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // 🧠 Título dinámico
  const getTitle = () => {
    if (pathname.startsWith("/admin/reservaciones")) return "Reservaciones";
    if (pathname.startsWith("/admin/configuracion")) return "Configuración";
    if (pathname.startsWith("/admin/experiencias")) return "Experiencias";
    if (pathname.startsWith("/admin/categorias")) return "Categorias";
    return "Dashboard";
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* CONTENT */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}