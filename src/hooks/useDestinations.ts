"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";

import { Destination } from "@/interfaces/Destination";


export function useDestinations() {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("destinations_wondermx")
          .select("*");

        console.log(data)

        if (error) throw error;

        setData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return { data, loading, error };
}