# 🔖 Smart Bookmark App

A full-stack web application that allows users to securely save, manage, and access their personal bookmarks using **Google OAuth authentication**.  
Built with **Next.js App Router**, **Supabase**, and **Tailwind CSS**, and deployed on **Vercel**.

---

## 🚀 Live Demo
👉 https://book-mark-app.vercel.app

## 📂 GitHub Repository
👉 https://github.com/Swalpita123/BookMark_App

---

## ✨ Features

- 🔐 **Google OAuth Authentication** (no email/password)
- 👤 **User-specific private bookmarks**
- ➕ Add new bookmarks (title + URL)
- ❌ Delete bookmarks
- 🌙 **Dark / Light mode toggle**
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 Secure backend with **Row Level Security (RLS)**
- ☁️ Deployed on Vercel with a live URL

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** Supabase (Auth, PostgreSQL, RLS)
- **Styling:** Tailwind CSS v4
- **Authentication:** Google OAuth (via Supabase)
- **Deployment:** Vercel

---

## 📸 Screenshots
*(Optional – you can add screenshots later)*

---

## ⚠️ Challenges Faced & How I Solved Them

### 1️⃣ Supabase Environment Variables Not Working in Production
**Problem:**  
The app worked locally but failed on Vercel with errors like:


**Cause:**  
Vercel does not use `.env.local`. Environment variables must be added manually in the Vercel dashboard.

**Solution:**  
- Added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Selected **Production, Preview, and Development**
- Redeployed the project with cache disabled

---

### 2️⃣ Client Component SSR Error During Build
**Problem:**  
`npm run dev` worked, but `npm run build` failed with:


**Cause:**  
A client component (`Dashboard`) was being imported and rendered inside another page (`app/page.tsx`), which is not allowed in Next.js App Router.

**Solution:**  
- Removed direct imports of `/dashboard/page.tsx`
- Used `router.push("/dashboard")` for navigation instead
- Added:
```ts
export const dynamic = "force-dynamic";
