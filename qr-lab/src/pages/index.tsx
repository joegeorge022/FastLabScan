"use client";

import Login from "@/module/login/login";
import { useLocalStorage } from "@/lib/custom-hooks";
import HomeTable from "@/module/home/homeTable";
import { User } from "@/lib/types";
import { useSession } from "supabase-swr";
import { useUserStore } from "@/lib/userStore";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session?.user.user_metadata);
      }
    });
  }, [setUser]);

  if (!session) return <Login />;
  return <HomeTable />;
}
