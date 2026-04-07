"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

export function useAdminExperiences() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("experiences_wondermx")
      .select("*")
      .order("title");

    if (!error) setData(data || []);
    setLoading(false);
  };

  const create = async (exp: any) => {
    const { error } = await supabase.from("experiences_wondermx").insert(exp);
    if (error) throw error;
    fetchData();
  };

  const update = async (id: string, exp: any) => {
    const { error } = await supabase
      .from("experiences_wondermx")
      .update(exp)
      .eq("id", id);

    if (error) throw error;
    fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from("experiences_wondermx")
      .delete()
      .eq("id", id);

    if (error) throw error;
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, create, update, remove };
}