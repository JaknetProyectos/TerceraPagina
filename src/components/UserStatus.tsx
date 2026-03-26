"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

export default function UserStatus() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <span>No autenticado</span>;

  return (
    <div className="text-sm">
      {user.email} ({user.user_metadata?.role})
    </div>
  );
}