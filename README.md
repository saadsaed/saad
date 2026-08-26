# Saad Saeed — AI & Fullstack Developer Portfolio

A dynamic, cinematic portfolio website built with **React**, **Vite**, **TailwindCSS**, and **Supabase**. Features an interactive, password-protected CMS Admin Panel for real-time content management, custom background automation showcases, and a stateful fallback database for offline development.

Live at: [https://saad.thepegasusvalley.com](https://saad.thepegasusvalley.com)

---

## 🚀 Key Features

*   **Cinematic Page Flow:** Styled with custom CSS design tokens and smooth fluid entrance layouts powered by `framer-motion`.
*   **Dynamic CMS Panel:** Full-featured dashboard (`/admin`) protecting access to database resources where you can modify homepage titles, career/education history, and services.
*   **Case Studies & Automation Showcases:** Dedicated sections displaying lead capturing, data enrichment, and GPT/Claude reasoning pipelines.
*   **Stateful Mock Mode Fallback:** Automatically runs off a stateful `localStorage` mock database client when Supabase credentials are not configured, enabling offline testing.
*   **Asset Library Manager:** Upload and manage images/files directly in the browser through a custom Media Library interface.

---

## 🛠️ Technology Stack

*   **Frontend:** React (hooks & context), Vite, TailwindCSS (for modern page layout and theming)
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Backend & Auth:** Supabase (PostgREST API, Row Level Security Policies, JWT Auth)
*   **Deployment:** Vercel (Edge CDN)

---

## ⚙️ Local Development Setup

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/saadsaeed/saad-saeed-portfolio.git
cd saad-saeed-portfolio
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```
*(If left empty, the project automatically launches in **Mock Mode** using local storage).*

### 3. Initialize the Live Database
Run the SQL queries in your Supabase project's **SQL Editor**:
1. Copy and execute [`supabase/migrations/20260823215527_initial_schema.sql`](./supabase/migrations/20260823215527_initial_schema.sql) (creates tables and triggers).
2. Copy and execute [`supabase/migrations/20260823220639_security_policies.sql`](./supabase/migrations/20260823220639_security_policies.sql) (configures RLS authorization rules).
3. Copy and execute [`supabase/seed_dummy_data.sql`](./supabase/seed_dummy_data.sql) (populates initial mock content and promotes your user account to Admin).

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
