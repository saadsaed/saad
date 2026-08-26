# Security Architecture & Policies

This document outlines the security architecture for the Saad Saeed Portfolio CMS.

## Authentication Architecture
- We utilize **Supabase Authentication**.
- The public portfolio relies on unauthenticated access. 
- The admin dashboard uses a secure email/password login flow. Registration is strictly disabled.
- Session state is managed by Supabase and propagated to React via an `AuthContext` wrapper and `useAuth` hook.

## Authorization Architecture & Admin Identification
- **Authorization vs Authentication**: A logged-in user is not automatically assumed to be an admin.
- **Admin Identification**: We created a dedicated `admin_users` table with a `user_id` foreign key mapped directly to `auth.users(id)`. 
- Only users explicitly inserted into this table are granted admin privileges. This completely isolates our admin permissions without needing complex RBAC systems and avoids problematic recursive RLS policies.

## Row Level Security (RLS) Strategy
- **Public Content**:
  - Repeatable content (projects, automations, services) requires `is_published = true` for public reads.
  - Global singletons (site settings, homepage content, about content) are readable by the public.
  - Public `INSERT`, `UPDATE`, and `DELETE` access is strictly blocked everywhere.
- **Admin Access**:
  - RLS policies grant `ALL` privileges (CRUD) on all tables ONLY if the condition `EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())` is met.

## Storage Security
- A central `media` bucket houses all file uploads.
- **Public Access**: Allowed to `SELECT` (download) objects.
- **Admin Access**: Allowed to `INSERT`, `UPDATE`, and `DELETE` objects via the same `admin_users` RLS check.

## Route Protection
- Frontend admin routes (`/admin`, `/admin/dashboard`) are wrapped in a `<ProtectedRoute />` component.
- The component checks `supabase.auth.getSession()` on load. If no valid session exists, it immediately redirects the user to `/admin/login`.

## Environment Variables & Secret Handling
- **Public**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safely exposed to the client. The Anon Key is safe to expose because actual data access is constrained by RLS.
- **Secrets**: Passwords, Service Role Keys, and Database Passwords are never committed or exposed to the frontend.
- `.env` is properly registered in `.gitignore`.

## Security Testing Results
Because the local environment lacks Docker daemon access (required for `supabase start`), live testing against a running database instance could not be performed.
- **Test 1 — Unauthenticated access:** NOT VERIFIED
- **Test 2 — Invalid credentials:** NOT VERIFIED
- **Test 3 — Admin login:** NOT VERIFIED
- **Test 4 — Logout:** NOT VERIFIED
- **Test 5 — Public read:** NOT VERIFIED
- **Test 6 — Unpublished content:** NOT VERIFIED
- **Test 7 — Unauthorized write:** NOT VERIFIED
- **Test 8 — Admin write:** NOT VERIFIED
- **Test 9 — Storage:** NOT VERIFIED

## Known Limitations
- The current implementation is logically sound but strictly relies on code inspection as live verification was blocked by the environment. Live testing must be performed once deployed or when Docker is available.
