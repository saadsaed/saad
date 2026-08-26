# Database Architecture & Schema

This document details the PostgreSQL schema implemented via Supabase for the Saad Saeed Portfolio CMS.

## 1. Tables and Purpose

### Media
- **`media`**: Centralizes metadata for all files uploaded to Supabase Storage.
  - *Primary Key*: `id` (UUID)
  - *Important Fields*: `storage_path` (UNIQUE), `file_name`, `mime_type`, `alt_text`

### Singleton Content (Enforced Single Row)
These tables use a boolean primary key (`id BOOLEAN DEFAULT TRUE CHECK (id)`) to strictly enforce that only one row can ever exist.
- **`site_settings`**: Global SEO and site-wide configuration.
- **`homepage_content`**: Hero text, intro copy, and feature statistics.
- **`about_content`**: Biography, nested JSONB education/experience, and profile media reference.
- **`contact_info`**: Public contact details (email, location) and call-to-action text.

### Repeatable Content (UUID Primary Keys)
- **`services`**: Core service offerings.
  - *Fields*: `title`, `short_desc`, `full_desc`, `icon_name`, `is_published`, `is_featured`, `display_order`
- **`technologies`**: Reusable tech stack items (frontend, backend, AI tools).
  - *Fields*: `name`, `category`, `url`, `logo_media_id` (FK to media)
- **`projects`**: Portfolio case studies.
  - *Fields*: `title`, `slug` (UNIQUE), `problem`, `solution`, `live_url`, `is_published`, `is_featured`
- **`automations`**: Specialized AI/Automation case studies.
  - *Fields*: `name`, `slug` (UNIQUE), `trigger_type`, `ai_model`, `demo_url`
- **`automation_steps`**: Ordered workflow steps belonging to a specific automation.
  - *Fields*: `automation_id` (FK), `title`, `tool`, `display_order`
- **`process_steps`**: Generalized workflow steps (e.g., Discover, Design, Build).
- **`social_links`**: Repeatable social profiles.

### Relational Junction Tables
- **`project_media`**: Links multiple `media` records to a `project` for image galleries (with `display_order`).
- **`project_technologies`**: Many-to-many link between `projects` and `technologies`.
- **`automation_technologies`**: Many-to-many link between `automations` and `technologies`.

## 2. Models & Conventions

- **Status Model**: Public-facing tables use `is_published` (BOOLEAN, default FALSE) to implement Draft vs Published states.
- **Ordering Model**: Repeatable content uses `display_order` (INTEGER, default 0) to allow drag-and-drop manual sorting in the CMS.
- **Media Model**: The database does NOT store image binaries. Images are uploaded to Supabase Storage, and the relative path/metadata is stored in the `media` table. Other tables reference this via Foreign Key (`media_id`).
- **Timestamps**: All relevant tables have `created_at` and `updated_at`. A PostgreSQL trigger automatically updates `updated_at` on row modifications.

## 3. Constraints & Indexes

- **Constraints**:
  - `slug` fields on `projects` and `automations` are `UNIQUE NOT NULL`.
  - Singleton tables have a `CHECK (id = true)` constraint.
  - Foreign keys (`REFERENCES ... ON DELETE CASCADE` or `SET NULL`) ensure referential integrity.
- **Indexes**:
  - `idx_projects_slug` and `idx_automations_slug` for fast URL resolution.
  - Index on `display_order` across repeatable tables to optimize sorting queries.

## 4. Security Considerations & Phase 3 Prep

- **Row Level Security (RLS)**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` has been applied to every table. 
- **Preparation**: By default, enabling RLS blocks ALL access. In Phase 3, we will implement policies that allow public anonymous read access to rows where `is_published = true`, and authenticated admin access to all rows (CRUD).

## 5. Migrations & Reproducibility

- The schema is strictly version-controlled using **Supabase CLI**.
- Migration file: `supabase/migrations/[timestamp]_initial_schema.sql` contains the complete schema definition.

## 6. Important Decisions

- **Singleton Enforcement**: Chose typed columns with a single-row constraint over a generic NoSQL/JSONB `settings` table. This ensures strict schema validation and typing for important fields like `hero_heading` and `hero_media_id`.
- **Media Strategy**: Created a central `media` table instead of storing raw URL strings in the content tables. This enables a unified "Media Library" view in the admin dashboard in later phases.
