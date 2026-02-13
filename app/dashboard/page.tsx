"use client";
export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setBookmarks(data);
      setLoading(false);
    };

    loadBookmarks();
  }, []);

  async function addBookmark() {
    if (!title || !url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }])
      .select()
      .single();

    if (data) {
      setBookmarks((prev) => [data, ...prev]);
    }

    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id: string) {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br 
                from-indigo-100 via-white to-purple-100
                dark:from-slate-900 dark:via-slate-800 dark:to-black
                flex flex-col transition-all duration-500"
    >
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center gap-20">
          <h1
            className="text-3xl font-bold tracking-tight 
                     text-gray-800 dark:text-white"
          >
            Smart Bookmark
          </h1>

          <div className="flex items-center gap-4">
            {/* Dark Toggle */}

            <button
              onClick={() => supabase.auth.signOut()}
              className="text-lg text-white h-10 w-25 bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Add Card */}
        <div
          className="bg-white dark:bg-slate-900 
                    rounded-2xl shadow-lg p-8 mb-10 
                    transition hover:shadow-xl"
        >
          <h2
            className="text-xl font-semibold mb-6 
                     text-gray-700 dark:text-gray-200"
          >
            Add New Bookmark
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Website Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border dark:border-slate-700 
                     bg-white dark:bg-slate-800 
                     text-gray-800 dark:text-white
                     rounded-lg px-4 py-3 
                     focus:ring-2 focus:ring-indigo-500 transition"
            />

            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border dark:border-slate-700 
                     bg-white dark:bg-slate-800 
                     text-gray-800 dark:text-white
                     rounded-lg px-4 py-3 
                     focus:ring-2 focus:ring-indigo-500 transition"
            />

            <button
              onClick={addBookmark}
              className="bg-indigo-600 text-white 
                     rounded-lg px-6 py-3 font-medium 
                     hover:bg-indigo-700 
                     transition transform hover:scale-105"
            >
              Add
            </button>
          </div>
        </div>

        {/* Bookmark Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900 
                     rounded-2xl shadow-md p-6 h-40 
                     flex flex-col justify-between
                     hover:shadow-xl hover:-translate-y-1
                     transition-all duration-300"
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold 
                       text-indigo-800 dark:text-indigo-400 
                       "
              >
                {b.title}
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-lg 
                       text-white self-end transition h-10 w-20 bg-red-700"
                style={{ borderRadius: "10px 10px" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
