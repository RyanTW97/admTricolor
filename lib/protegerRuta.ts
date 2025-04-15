"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthMap } from "@/utils/auth";

export const useRutaProtegida = () => {
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const auth = getAuthMap();

    if (!email || !auth[email]) {
      router.push("/login");
    }
  }, []);
};
