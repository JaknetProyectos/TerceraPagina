"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

import { Destination } from "@/interfaces/Destination";

export function useAdminDestinations() {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from("destinations_wondermx")
      .select("*")
      .order("name");

    if (!error) setData(data || []);
    setLoading(false);
  };

  const createDestination = async (destination: Partial<Destination>) => {
    const { error } = await supabase.from("destinations_wondermx").insert(destination);
    if (!error) fetchDestinations();
  };

  const deleteDestination = async (id: string) => {
    await supabase.from("destinations_wondermx").delete().eq("id", id);
    fetchDestinations();
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return { data, loading, createDestination, deleteDestination };
}