import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { SwrSupabaseContext } from "supabase-swr";
import { supabase } from "@/lib/supabase";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <SwrSupabaseContext.Provider value={supabase}>
        <Component {...pageProps} />
        <Toaster />
      </SwrSupabaseContext.Provider>
    </ThemeProvider>
  );
}
