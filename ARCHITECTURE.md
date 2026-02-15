# Inkraft System Architecture

## Overview
Inkraft is a modern, reading-first blogging platform built with Next.js 15, specialized for long-form content and community engagement without paid APIs or invasive tracking.

## Tech Stack

### Core Framework
- **Frontend/Backend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Data Layer
- **Database**: MongoDB (via Mongoose)
- **Caching**: Native Next.js Fetch Cache
- **Storage**: Cloudinary (Images) / LocalStorage (User Preferences)

### Authentication & Security
- **Auth**: NextAuth.js (v5 beta)
- **Providers**: Google, Email/Password
- **Protection**: 
  - Vercel BotID
  - Rate Limiting (Custom Middleware)
  - Trust Score System (Internal Logic)

## Key Subsystems

### 1. Internationalization (i18n)
- **Library**: `next-intl`
- **Strategy**: 
  - Middleware-based locale detection
  - Dedicated dictionaries (`messages/en.json`, `messages/bn.json`)
  - Route prefixing (`/en/blog/...`, `/bn/blog/...`)

### 2. Branding & Themes
- **Theming**: `next-themes` (Light/Dark/System/Sepia)
- **Glassmorphism**: Extensive use of backdrop-blur and semi-transparent borders for premium feel.

### 3. Feature Flags & Preferences
- **Local-First**: Many features (Focus Mode, Reading Progress) use `localStorage` to avoid DB overhead for anonymous users.
- **Progressive Enhancement**: Features degrade gracefully if JS is disabled (where possible).

### 4. SEO Architecture (New)
- **Strategy**: 
  - **Dynamic Metadata**: Server-side generation of `title`, `description`, and `keywords` based on page content.
  - **Canonical URLs**: Automatic self-referencing canonicals to prevent duplicate content issues.
  - **Structured Data**: JSON-LD schemas for Articles, Breadcrumbs, and Profiles.
  - **Sitemap**: Dynamic `sitemap.ts` generation for real-time indexing.

---

## Directory Structure
```
/app
  /[locale]       # Internationalized routes
  /api            # Backend API endpoints
  /admin          # Admin dashboard routes
/components
  /ui             # Shadcn primitives
  /onboarding     # [NEW] User onboarding flows
  /analytics      # Visualization components
/lib
  /actions        # Server Actions
  /db             # Mongoose models & connection
  /hooks          # Custom React hooks
  /utils          # Helper functions
/messages         # i18n JSON files
/public           # Static assets
```

## Critical Flows

### Content Rendering
1. **Fetch**: Server Component fetches data via Mongoose.
2. **Process**: Markdown/MDX processed (if applicable).
3. **Hydrate**: Client components (Comments, Interactions) hydrate on load.

### Onboarding (New)
- **Trigger**: Checks `localStorage` for `inkraft_onboarding_seen`.
- **Display**: Multipage Modal using `framer-motion` for transitions.
- **Action**: User dismissal updates `localStorage`.

## Deployment
- **Platform**: Vercel
- **Build**: `next build` (Static Generation + ISR)
- **Env**: Production/Preview specific variables.
