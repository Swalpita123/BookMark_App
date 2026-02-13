"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Dashboard from "./dashboard/page";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div
        className="min-h-screen flex items-center justify-center 
                  bg-linear-to-br from-slate-900 via-slate-800 to-black px-6"
      >
        <div
          className="w-full max-w-md bg-black backdrop-blur-xl 
                    border border-white/10 rounded-2xl 
                    shadow-2xl p-10 text-center 
                    animate-fade-in"
        >
          {/* Animated Heading */}
          <h1
            className="text-3xl font-bold text-white mb-3 
                     animate-pulse"
          >
            Hi! 👋 Welcome to Bookmark App
          </h1>

          <p className="text-gray-400 mb-8 text-sm">
            Save, organize and access your favorite links securely anytime.
          </p>

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "google",
              })
            }
            className="w-full flex items-center justify-center gap-3 
                   bg-white text-gray-800 font-medium 
                   py-3 rounded-xl 
                   hover:bg-gray-200 transition duration-300 shadow-lg"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
              className="object-contain"
            />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
