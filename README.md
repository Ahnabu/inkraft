# Inkraft - Premium Editorial Blogging Platform

<div align="center">

![Inkraft Logo](public/icon-512.png)

**A modern, feature-rich blogging platform with professional analytics, SEO optimization, and premium reading experience**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://inkraftblog.vercel.app) • [GitHub](https://github.com/Ahnabu/inkraft) • [Contact](mailto:syedmdabuhoraira@gmail.com)

[![GitHub](https://img.shields.io/badge/GitHub-Ahnabu-black?style=for-the-badge&logo=github)](https://github.com/Ahnabu)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sm--abu--horaira-0077b5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sm-abu-horaira/)

[Documentation](#documentation) • [Features](#-features) • [Getting Started](#-getting-started)

</div>

</div>

---

## 🚀 New Features (v0.2.0)

### Phase 1: Reading Delight
- **Focus Mode**: Distraction-free reading with a single click.
- **Reading Progress**: Remembers exactly where you left off in every article.
- **Calm Editor**: A zen-like writing experience with no clutter.
- **Draft Recovery**: Never lose your work with local draft saving.

### Phase 2: Engagement
- **Reputation Badges**: Trust scores (Newcomer, Contributor, Trusted, Expert) visible on profiles and comments.
- **Inline Notes**: Add private notes to any paragraph for deep study.
- **Copy as Markdown**: Select text to instantly copy as clean formatted Markdown.
- **Difficulty Badges**: Know if a post is Beginner, Intermediate, or Advanced.
- **Smart TOC**: Auto-generated sticky table of contents with mobile slide-up navigation.
- **Silent Feedback**: Let authors know if a post was helpful, clear, or needs more detail.

### Phase 3: Discovery & Retention
- **Personalized Feed**: Content tailored to your interests and reading habits.
- **Reading History**: Easily find and resume posts you've previously read.
- **Series Navigation**: Seamlessly binge-read multi-part article series.
- **Author Following**: Build your network by following your favorite writers.

### Phase 4: Content Amplification
- **SEO Dashboard**: Real-time optimization tips and metadata management.
- **Social Previews**: See exactly how your post will look on Twitter and LinkedIn.
- **Newsletter**: Built-in subscription system to own your audience.
- **Advanced Analytics**: Granular insights into views, engagement, and subscriber growth.

### Phase 5: Power Features ⚡
- **AI Writing Assistant**: Powered by OpenAI - get suggestions, improve tone, expand content with text selection.
- **Export Posts**: Download your content as PDF, Markdown, or JSON for portability and backup.
- **Keyboard Shortcuts**: Navigate faster with `g+h` (home), `/` (search), `f` (focus mode), `Shift+?` (shortcuts modal).
- **Bangla Typography**: Full support for বাংলা text with Noto Sans Bengali font family.

### Phase 5.1: Comprehensive i18n 🌐 (v0.2.1)
- [x] **UI Translation**: Complete interface in English and বাংলা (Bangla) - switch with one click.
- [x] **Multi-language Posts**: Write each post in multiple languages with dedicated translation fields.
- [x] **Language Switcher**: Beautiful globe icon in navbar for instant language switching.
- [x] **SEO Optimized**: Proper `hreflang` tags, language-specific metadata, and separate URLs per language.
- [x] **Smart Fallback**: Posts without translation gracefully show in original language with notice.

### Phase 6: UI Refinement & Extended Discovery
- [x] **Mobile UI Fixes**
  - [x] Fix Subscribe button overflow in Footer
  - [x] Fix SEO Metadata panel overflow in Editor
- [x] **Homepage i18n**
  - [x] Extract hardcoded strings to translation files
  - [x] Implement `useTranslations` in Homepage
  - [x] Add **Explore** button to Hero section
- [x] **Discovery Features**
  - [x] Create `/authors` page (Discover Authors)
  - [x] Add "Authors" link to Navbar
  - [x] Verify "All Posts" view in Explore
- [x] **UI Translation**
  - [x] Translate Navbar (Links, Buttons, Mobile Menu)
  - [x] Translate Footer (Sections, Links, Copyright)
- [x] **Fix 404s**
  - [x] Ensure all links (especially `/authors`) work correctly

### Phase 7: Engagement & Visual Polish (Post-Launch Refinements)
- [x] **Visual Hierarchy**: homepage featuring Hero card, Top posts, and Trending section.
- [x] **Reputation Badges**: Visual trust indicators for authors (Newcomer, Contributor, Expert).
- [x] **Smart TOC**: Sticky table of contents with mobile floating button.
- [x] **Resume Reading**: "Welcome back" banner to resume reading where you left off.
- [x] **Silent Feedback**: Non-intrusive "Helpful / Clear / Needs Detail" feedback buttons.
- [x] **Difficulty Badges**: Explicit content level (Beginner, Intermediate, Advanced).
- [x] **Follow System**: Follow authors for personalized feed updates.
- [x] **Weekly Digest**: Dedicated digest cards and weekly curated content view.
- [x] **Focus Mode**: Refined distraction-free reading experience.
- [x] **Analytics UX**: Enhanced charts and insights for authors.
- [x] **Comment Polish**: Improved threading, editing history, and layout.
- [x] **Related Content**: Smarter continuation flow at end of articles.

### Phase 8: User Retention & Onboarding (New)
- [x] **Onboarding Modal**: Glassmorphism-styled welcome flow for new visitors.
- [x] **Instant History**: Articles added to reading history immediately on view.
- [x] **Internationalized Onboarding**: Full English/Bangla support for welcome screens.
- [x] **Value Proposition**: "Why Inkraft" section highlighting core values (Trust, Privacy, Focus).
- [x] **Explore Page Enhancements**:
  - [x] **Server-Side Search**: Robust search for titles, content, tags, and authors.
  - [x] **Advanced Filtering**: Filter by Category, Tags, and Sort order.
  - [x] **Staff Picks**: Dedicated toggle for editor-curated content.
  - [x] **URL Sync**: Shareable search results with URL-state synchronization.

### Phase 9: SEO & Brand Strategy (New)
- [x] **Global SEO Overhaul**:
  - [x] **Smart Metadata**: Dynamic title/desc generation for all pages.
  - [x] **Keywords Strategy**: Targeted keywords for developers, writers, and startups.
  - [x] **Social Cards**: Optimized OpenGraph and Twitter cards for better sharing.
- [x] **Content Optimization**:
  - [x] **About Page**: Dedicated page targeting key user personas.
  - [x] **Authors Page**: SEO-rich author discovery and listing.
  - [x] **Profile SEO**: Dynamic metadata for user profiles based on bio/name.
- [x] **Brand Consistency**: Unified messaging across Homepage, Onboarding, and Footer.

---


## 📖 Overview

Inkraft is a **premium editorial blogging platform** designed for content creators who demand more than just a basic blog. Built with cutting-edge technologies, Inkraft combines beautiful design, powerful analytics, and professional SEO tools to help you grow your audience and understand your readership.

### 🌟 Why Choose Inkraft?

Inkraft isn't just another blog template—it's a **complete publishing ecosystem** built for serious technical writers and engineering teams.

#### 1. **Premium Reading Experience**
Your content deserves a beautiful home. Inkraft features a **glass-morphism UI**, optimized typography for long-form reading, and zero clutter. It's designed to keep readers engaged, with features like:
- **Smart Dark Mode**: seamless switching that respects system preferences.
- **Syntax Highlighting**: Beautiful code blocks for 20+ languages.
- **Distraction-Free Reading**: Clean layouts that put your words front and center.

#### 2. **Professional-Grade Analytics**
Stop guessing who reads your work. Inkraft provides **granular insights** without compromising privacy:
- **Geographic Hitmaps**: See exactly where your readers are located (down to the city).
- **Engagement Depth**: Track scroll depth and true reading time, not just page views.
- **Device & OS Breakdown**: Understand your audience's tech stack.

#### 3. **SEO That Actually Works**
We've baked in technical SEO best practices so you don't have to worry about them:
- **Automatic Schema.org**: JSON-LD structured data for every article.
- **Dynamic Sitemaps**: Auto-generated and prioritized.
- **Performance First**: Core Web Vitals optimized out of the box (LCP, CLS, FID).

#### 4. **Community Built-In**
Inkraft turns readers into a community:
- **Threaded Discussions**: Deep conversations with markdown support.
- **Reputation System**: Trust scores for authors and commenters.
- **Follow System**: Build a loyal following that gets notified when you publish.

---

## ✨ Features

### 🎨 **Content Creation & Editing**

- **Rich Text Editor** (TipTap)
  - HTML-based WYSIWYG editing
  - Syntax highlighting for code blocks
  - Image uploads with Cloudinary integration
  - Table support with responsive wrappers
  - Heading hierarchy with auto-generated IDs
  - Markdown support in comments

- **SEO Panel**
  - Real-time preview of title & description
  - Character count guidance
  - Keyword suggestions
  - Meta tag optimization
  - OpenGraph and Twitter Card previews

- **Professional Typography**
  - Responsive font sizes (375px to desktop)
  - Optimized line heights and spacing
  - Drop cap for first paragraph
  - Code block syntax highlighting
  - Beautiful blockquotes and tables

### 📊 **Analytics & Insights**

- **Geographic Tracking**
  - IP-based geolocation (150+ countries)
  - City and region data
  - Privacy-compliant IP hashing (GDPR)
  - Interactive world map visualization

- **Engagement Metrics**
  - Total views and unique visitors
  - Average time on page
  - Scroll depth tracking
  - Session-based analytics
  - Referrer source tracking

- **Visual Dashboards**
  - Line charts for daily views
  - Pie charts for device breakdown
  - Bar charts for browser stats
  - Country rankings with progress bars
  - Top performing posts leaderboard

- **Two-Level Analytics**
  - **Post-Level**: Individual post performance (`/analytics/[slug]`)
  - **Author-Level**: Aggregate cross-post analytics (`/analytics`)
  - Time range filters (7/30/90 days)
  - Exportable data (CSV/JSON)

### 🔍 **SEO Optimization**

- **Technical SEO**
  - Schema.org structured data (Article, Breadcrumb, Organization)
  - Dynamic XML sitemap with priorities
  - Robots.txt configuration
  - Canonical URLs
  - Meta robots directives

- **Content SEO**
  - Auto-generated meta descriptions
  - OpenGraph image generation
  - Twitter Card integration
  - Reading time calculation
  - Word count tracking
  - Keyword density analysis

- **Google Integration**
  - Search Console verification (HTML tag + file)
  - Analytics.js support
  - Indexing API ready
  - Structured data validation
  - **Analytics Integration**
  - Completion rate tracking (read percentage)
  - Exit point analysis (scroll depth)
  - Referrer quality scoring

### 📚 **Reader Experience**
- **Personal Library**
  - Save posts for later reading
  - Reading history tracking
  - Progress synchronisation across devices
  - Export reading list

- **Content Portability**
  - Import from Markdown files
  - Import from Medium exports (HTML)
  - Auto-normalization to Inkraft blocks
  - Syntax highlighting for code blocks

### 💬 **Community & Engagement**

- **Comment System**
  - Threaded replies (nested discussions)
  - Markdown formatting support
  - Edit and delete functionality
  - Real-time updates
  - User avatars and badges
  - Comment count tracking

- **Voting System**
  - Upvote/downvote mechanism
  - Trust score multipliers
  - Vote weight calculation
  - Anti-abuse protection
  - Trending algorithm integration

- **Social Features**
  - Save/bookmark articles
  - Share buttons (Twitter, Facebook, LinkedIn, Copy Link)
  - Author profiles with bio
  - **Follow System** - Follow authors and categories
  - Personalized "Following" feed on homepage
  - User activity tracking

- **Notifications**
  - Real-time notification bell
  - New post from followed authors
  - Comment replies
  - Follower alerts
  - Unread count badge

- **Series System**
  - Multi-part content organization
  - Series landing pages (`/series/[slug]`)
  - Progress indicators
  - SEO-optimized with JSON-LD schema

### 📧 **Contact & Communication**

- **Contact Form**
  - Clean, user-friendly interface
  - Real-time form validation
  - Email notifications via Gmail API
  - Automatic confirmation emails to senders
  - Admin notifications with full details
  - Professional email templates with HTML formatting
  - Rate limiting to prevent spam
  - Success/error state handling

- **Email Integration**
  - Nodemailer with Gmail SMTP
  - App Password authentication
  - Dual email system (admin + sender confirmation)
  - HTML email templates
  - Error handling and retry logic
  - Production-ready configuration

### 🎯 **Content Discovery**

- **Smart Algorithms**
  - Trending posts (time-decay formula)
  - Top posts (all-time best)
  - Latest posts (chronological)
  - Category-based filtering
  - Tag-based search

- **Navigation**
  - Category pages with SEO
  - Explore page with filters
  - Search functionality
  - Related posts suggestions
  - Breadcrumb navigation

### 🔐 **Authentication & Security**

- **Multi-Provider Auth**
  - Email/Password (Credentials)
  - Google OAuth 2.0
  - Extensible for more providers

- **Security Features**
  - Session-based authentication
  - CSRF protection
  - **Vercel BotID** - Advanced bot protection on all forms and APIs
  - Rate limiting on API routes
  - SQL injection prevention (NoSQL)
  - XSS protection
  - Automated bot detection and blocking

- **Bot Protection (Vercel BotID)**
  - AI-powered bot detection
  - Form spam prevention
  - Fake account blocking
  - Vote manipulation prevention
  - Comment spam filtering
  - Upload abuse protection
  - Edge-based (ultra-fast)
  - Zero impact on real users

- **User Roles**
  - Admin dashboard
  - Author permissions
  - Reader accounts
  - Ban system for moderation

### 📱 **Responsive Design**

- **Breakpoints Optimized**
  - Small Mobile: ≤375px
  - Mobile Portrait: ≤640px
  - Mobile Landscape: ≤768px
  - Tablet: ≤1024px
  - Desktop: >1024px

- **Mobile Features**
  - Touch-optimized interactions
  - Swipe gestures
  - Collapsible menus
  - Responsive tables
  - Mobile-first images

### 🎯 **Admin Features**

- **Content Management**
  - Moderate posts (approve/reject)
  - Manage users (ban/unban)
  - Delete comments
  - View all analytics

- **User Management**
  - User list with search
  - Role assignment
  - Trust score adjustment
  - Activity monitoring

- **Statistics Dashboard**
  - Total users, posts, comments
  - Growth metrics
  - Engagement rates
  - System health

- **Admin Alerts System**
  - Automated detection of vote spikes
  - Spam velocity monitoring
  - Low-trust engagement alerts
  - Severity-based prioritization
  - One-click resolution actions
  - **Trust & Safety Tools**
  - Vote nullification for suspicious posts
  - Trust score freezing for bad actors
  - Content import moderation
  - User history tracking


---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router + Turbopack)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom + Radix UI primitives
- **Charts**: Recharts 3.7.0
- **Rich Text**: TipTap (ProseMirror)
- **Animations**: Framer Motion ready
- **Icons**: Lucide React
- **Internationalization**: next-intl

### Backend
- **Runtime**: Node.js 20.x / Edge Runtime
- **Database**: MongoDB Atlas (7.0+)
- **ODM**: Mongoose 8.x
- **Authentication**: NextAuth.js v5
- **Image Storage**: Cloudinary
- **Email**: Nodemailer + Gmail SMTP
- **Geolocation**: geoip-lite
- **User Agent Parsing**: ua-parser-js
- **Bot Protection**: Vercel BotID

### DevOps
- **Deployment**: Vercel (Serverless)
- **Security**: Vercel BotID (Pro/Enterprise)
- **CI/CD**: GitHub Actions ready
- **Monitoring**: Vercel Analytics
- **Logging**: Console Ninja integration
- **Version Control**: Git

### SEO & Analytics
- **SEO Tools**: next-seo, Schema.org
- **Analytics**: Custom analytics engine
- **Search Console**: Google integration
- **Search Console**: Google integration
- **Sitemap**: Dynamic XML generation

---

## 📈 Scalability & Performance Analysis

Inkraft is architected to scale from a personal blog to a high-traffic media platform.

### **Horizontal Scalability**
- **Stateless Application**: The Next.js app is stateless, allowing it to scale horizontally across Vercel's edge network (or any container orchestration system like Kubernetes).
- **Serverless Functions**: API routes run as independent serverless functions, scaling automatically with traffic spikes.
- **Database Connection Pooling**: Mongoose is configured with connection pooling to handle concurrent requests efficiently, preventing database exhaustion.

### **Vertical Scalability**
- **MongoDB Atlas**: The database layer is hosted on Atlas, allowing for vertical scaling (increasing RAM/CPU) with zero downtime.
- **Edge Caching**: Static assets and ISR (Incremental Static Regeneration) pages are cached at the edge, reducing load on the origin server.

### **Performance Optimization**
- **Dynamic Imports**: Large components (like the Editor) are lazy-loaded to keep initial bundle size small.
- **Image Optimization**: Cloudinary handles image resizing and format conversion (WebP/AVIF) on the fly.
- **Bot Protection**: Vercel BotID prevents automated traffic from consuming resources.

### **Limitations & Future Improvements**
- **Search**: Currently uses MongoDB text search. For >1M documents, migrating to a dedicated search engine (Elasticsearch/Algolia) is recommended.
- **Caching**: While Vercel handles frontend caching, implementing Redis for API response caching (e.g., trending posts) would further reduce DB load.

---

## 🧠 Feed Algorithms & Matrices

Inkraft uses improved algorithms to surface relevant content to users.

### **1. Trending Score (Time-Decay)**
Calculated to surface "hot" content while ensuring rotation.
```typescript
Score = (Views * 1) + (Upvotes * 3) + (Comments * 5) / (TimeSincePosted + 2)^1.8
```
- **Newness Factor**: The denominator `(Time + 2)^1.8` ensures widely viewed older posts eventually drop off.
- **Engagement Weight**: Comments and Upvotes are weighted higher than passive Views.

### **2. Engagement Score (User Trust)**
Used to identify high-quality content for "Editor's Pick" consideration.
```typescript
Engagement = (TotalTimeRead / WordCount) * (ScrollDepth / 100) * TrustScore
```
- **Read Ratio**: Checks if users actually read the content.
- **Trust Score**: Users with higher trust scores (verified/consistent authors) carry more weight.

### **3. Personalization Matrix**
The "For You" feed (future implementation) uses a vector-like approach based on:
- **Category Affinity**: Tags the user interacts with most.
- **Author Affinity**: Authors the user follows or reads frequently.
- **Reading History**: Similar posts to those in the user's history.

---

## 🏢 Publications & Teams (New!)

Inkraft now supports **Publications**, enabling multi-author collaboration.

- **Create a Publication**: Users can create their own publication branding (like Medium/Substack).
- **Team Roles**:
  - **Owner**: Full control over publication settings and members.
  - **Admin**: Can manage posts and members.
  - **Editor**: Can edit and publish posts from Writers.
  - **Writer**: Can submit drafts for publication.
- **Shared Analytics**: View aggregate stats for the entire publication.
- **Publication Landing Page**: Dedicated URL (`/publication/my-pub`) with custom branding.

---

---

## 🚀 Getting Started

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or 22.x
- **MongoDB Atlas** account (free tier available)
- **Cloudinary** account (free tier available)
- **Google OAuth** credentials (optional but recommended)
- **Git** for version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/inkraft.git
cd inkraft
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure `.env.local`:**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inkraft

# Authentication
AUTH_SECRET=your-generated-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Cloudinary (For image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Gmail (For contact form)
GMAIL_USER=syedmdabuhoraira@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Analytics Salt (For IP hashing)
IP_SALT=your-random-salt-string

# OpenAI (For AI Writing Assistant)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> **📧 Gmail Setup**: See [GMAIL_SETUP_GUIDE.md](GMAIL_SETUP_GUIDE.md) for detailed instructions on generating Gmail App Password.

### Generate Secrets

**AUTH_SECRET:**
```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**IP_SALT:**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Database Setup

1. **Create MongoDB Atlas Cluster:**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Add database user with read/write permissions
   - Whitelist IP: `0.0.0.0/0` (allow from anywhere)
   - Get connection string

2. **Configure Indexes (Optional but recommended):**
```javascript
// In MongoDB Compass or Atlas UI
db.posts.createIndex({ slug: 1 }, { unique: true })
db.posts.createIndex({ published: 1, publishedAt: -1 })
db.posts.createIndex({ category: 1, published: 1 })
db.postanalytics.createIndex({ postSlug: 1, viewedAt: -1 })
db.postanalytics.createIndex({ postId: 1, viewedAt: -1 })
db.votes.createIndex({ user: 1, post: 1 }, { unique: true })
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Test Locally

```bash
# Build for production
npm run build

# Start production server locally
npm start
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/inkraft)

**Manual Deployment:**

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `MONGODB_URI`
     - `AUTH_SECRET`
     - `NEXTAUTH_URL` (use your Vercel domain)
     - `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
     - `GMAIL_USER` and `GMAIL_APP_PASSWORD` (see [GMAIL_SETUP_GUIDE.md](GMAIL_SETUP_GUIDE.md))
     - `IP_SALT`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

### Post-Deployment Setup

1. **Google Search Console:**
   - Visit [search.google.com/search-console](https://search.google.com/search-console)
   - Add your property (domain or URL prefix)
   - Verify using HTML tag (already in `layout.tsx`)
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`

2. **Google OAuth (if using):**
   - Update authorized redirect URIs:
     - `https://yourdomain.com/api/auth/callback/google`
   - Add authorized JavaScript origins:
     - `https://yourdomain.com`

3. **Cloudinary CORS:**
   - Add your domain to allowed origins
   - Enable unsigned uploads if needed

---

## 📚 Documentation

### Key Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Homepage with featured posts | Public |
| `/explore` | Browse all posts with filters | Public |
| `/blog/[slug]` | Individual blog post | Public |
| `/category/[slug]` | Posts by category | Public |
| `/new` | Create new post | Authenticated |
| `/edit/[slug]` | Edit existing post | Author/Admin |
| `/dashboard` | User dashboard | Authenticated |
| `/analytics` | Overall author analytics | Authenticated |
| `/analytics/[slug]` | Single post analytics | Author/Admin |
| `/series/[slug]` | Series landing page | Public |
| `/admin` | Admin panel | Admin only |
| `/admin/alerts` | Admin alerts dashboard | Admin only |
| `/settings` | User settings | Authenticated |
| `/profile/[id]` | User profile | Public |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts` | GET | List all posts |
| `/api/posts` | POST | Create new post |
| `/api/posts/[slug]` | GET | Get post details |
| `/api/posts/[slug]` | PUT | Update post |
| `/api/posts/[slug]/view` | POST | Track view |
| `/api/posts/[slug]/vote` | POST | Vote on post |
| `/api/posts/[slug]/analytics` | GET/POST | Analytics data |
| `/api/author/analytics` | GET | Author analytics |
| `/api/comments/[id]` | GET/PUT/DELETE | Comment operations |
| `/api/admin/*` | * | Admin operations |

### Project Structure

```
inkraft/
├── app/                          # Next.js App Router
│   ├── (pages)/                  # Page routes
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/[slug]/          # Blog post page
│   │   ├── analytics/            # Analytics dashboard
│   │   ├── dashboard/            # User dashboard
│   │   └── ...
│   ├── api/                      # API routes
│   │   ├── posts/                # Post endpoints
│   │   ├── author/analytics/     # Author analytics
│   │   ├── admin/                # Admin endpoints
│   │   └── ...
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── BlogContent.tsx           # Post content renderer
│   ├── PostAnalyticsDashboard.tsx
│   ├── AuthorAnalyticsDashboard.tsx
│   ├── Editor.tsx                # TipTap editor
│   ├── Comments.tsx              # Comment system
│   ├── Navbar.tsx                # Navigation
│   └── ui/                       # UI primitives
│
├── lib/                          # Utilities
│   ├── mongodb.ts                # DB connection
│   ├── analytics.ts              # Analytics utils
│   ├── engagement.ts             # Engagement scoring
│   ├── seo.ts                    # SEO helpers
│   ├── categories.ts             # Category data
│   └── utils.ts                  # General utils
│
├── models/                       # Mongoose models
│   ├── Post.ts                   # Blog post schema
│   ├── User.ts                   # User schema
│   ├── PostAnalytics.ts          # Analytics schema
│   ├── Comment.ts                # Comment schema
│   ├── Vote.ts                   # Vote schema
│   └── ...
│
├── public/                       # Static assets
│   ├── icon-512.png              # App icon
│   ├── google*.html              # Search Console verification
│   └── ...
│
├── auth.ts                       # NextAuth config
├── auth.config.ts                # Auth callbacks
├── middleware.ts                 # Route protection
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── vercel.json                   # Vercel settings
```

---

## 🎯 Usage Guide

### For Content Creators

**1. Create Your First Post:**
- Sign in → Dashboard → "New Post"
- Write your content in the rich text editor
- Add images via Cloudinary upload
- Fill in SEO panel (title, description, keywords)
- Choose category and tags
- Publish or save as draft

**2. Track Performance:**
- Dashboard → Click chart icon next to any post
- View geographic distribution
- Analyze engagement metrics
- Monitor daily view trends
- Check scroll depth and time on page

**3. Engage With Readers:**
- Respond to comments on your posts
- Check upvotes and saves
- Review referrer sources
- Identify top-performing content

### For Readers

**1. Discover Content:**
- Browse by category
- Use Explore page filters
- Check Trending posts
- View Latest updates

**2. Engage:**
- Upvote/downvote posts
- Leave comments (threaded discussions)
- Save articles for later
- Share on social media

**3. Customize:**
- Toggle dark/light mode
- Adjust reading preferences
- Manage saved posts
- Update profile

### For Admins

**1. Access Admin Panel:**
- Navigate to `/admin` (admin role required)
- View site-wide statistics
- Manage users, posts, comments

**2. Moderate Content:**
- Approve/reject posts
- Delete inappropriate comments
- Ban/unban users
- Adjust trust scores

**3. Monitor Health:**
- Check database status
- Review error logs
- Track system metrics

---

## 🔧 Advanced Configuration

### Custom Categories

Edit `lib/categories.ts` to add/modify categories:

```typescript
export const categories = [
  {
    name: "Your Category",
    slug: "your-category",
    description: "Description here",
    icon: YourIcon,
    color: "#hexcolor",
  },
  // ...
];
```

### Analytics Customization

Modify data retention in `models/PostAnalytics.ts`:

```typescript
// Add TTL index for automatic deletion
PostAnalyticsSchema.index(
  { viewedAt: 1 },
  { expireAfterSeconds: 7776000 } // 90 days
);
```

### SEO Optimization

Customize meta tags in `lib/seo.ts`:

```typescript
export function generateSEO(options: SEOOptions) {
  return {
    title: `${options.title} | Inkraft`,
    description: options.description,
    // Add more customizations
  };
}
```

### Rate Limiting

Adjust limits in `lib/rateLimit.ts`:

```typescript
const limiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

---

## 🐛 Troubleshooting

---

## 🐛 Troubleshooting

### Build Errors

**TypeScript Errors:**
```bash
# Run type check
npm run build

# Fix common issues
npm install --save-dev @types/node @types/react
```

**Module Not Found:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Turbopack Issues:**
```bash
# Switch to webpack
npm run dev -- --no-turbopack
```

### Runtime Errors

**500 Internal Server Error:**
1. Check Vercel function logs
2. Verify MongoDB connection string
3. Ensure all environment variables are set
4. Check MongoDB Atlas network access (allow 0.0.0.0/0)

**Authentication Issues:**
1. Verify `AUTH_SECRET` is set correctly
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure OAuth redirect URIs are configured
4. Clear browser cookies and try again

**Analytics Not Tracking:**
1. Check browser console for errors
2. Verify `/api/posts/[slug]/analytics` endpoint works
3. Ensure `geoip-lite` is installed
4. Check MongoDB `postanalytics` collection

**Images Not Loading:**
1. Verify Cloudinary credentials
2. Check CORS settings in Cloudinary
3. Ensure image URLs are correct
4. Check network tab for 403/404 errors

### Database Issues

**Connection Timeout:**
```env
# Add connection pool settings to MONGODB_URI
mongodb+srv://user:pass@cluster.mongodb.net/inkraft?retryWrites=true&w=majority&maxPoolSize=10
```

**Serverless Function Timeout:**
```javascript
// In vercel.json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 10
    }
  }
}
```

### Performance Issues

**Slow Page Loads:**
1. Enable Next.js Image Optimization
2. Implement caching strategies
3. Use `revalidate` in `fetch` calls
4. Optimize MongoDB queries with indexes

**High Memory Usage:**
1. Limit aggregation pipeline stages
2. Use pagination for large datasets
3. Implement cursor-based pagination
4. Clear unused connections

---

## ⚡ Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Database Optimization

**1. Use Lean Queries:**
```typescript
// Faster - returns plain objects
const posts = await Post.find().lean();

// Slower - returns Mongoose documents
const posts = await Post.find();
```

**2. Select Only Needed Fields:**
```typescript
const posts = await Post.find()
  .select('title slug excerpt author')
  .lean();
```

**3. Implement Pagination:**
```typescript
const page = 1;
const limit = 20;
const posts = await Post.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();
```

### Caching Strategies

**1. Static Generation (SSG):**
```typescript
export async function generateStaticParams() {
  const posts = await Post.find({ published: true }).select('slug');
  return posts.map((post) => ({ slug: post.slug }));
}
```

**2. Incremental Static Regeneration (ISR):**
```typescript
export const revalidate = 3600; // Revalidate every hour
```

**3. API Route Caching:**
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

---

## 📊 Analytics Deep Dive

### Data Collection

**What We Track:**
- ✅ Page views (deduplicated by 30-min window)
- ✅ Unique visitors (IP hash)
- ✅ Geographic location (country, city, region)
- ✅ Device type (desktop, mobile, tablet)
- ✅ Browser and OS
- ✅ Referrer source
- ✅ Time on page
- ✅ Scroll depth percentage
- ✅ Session ID (client-side UUID)

**What We DON'T Track:**
- ❌ Raw IP addresses (we hash them)
- ❌ Personal identifiable information (PII)
- ❌ Exact location (latitude/longitude)
- ❌ Browsing history
- ❌ Cross-site tracking

### Privacy Compliance

**GDPR Compliance:**
- IP addresses are hashed with salt before storage
- No personally identifiable information stored
- Users can request data deletion
- Analytics are anonymous and aggregated

**How IP Hashing Works:**
```typescript
import crypto from 'crypto';

function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.IP_SALT)
    .digest('hex');
}
```

### Custom Analytics Queries

**Example: Get views by hour:**
```typescript
const hourlyViews = await PostAnalytics.aggregate([
  { $match: { postSlug: slug } },
  {
    $group: {
      _id: { $hour: '$viewedAt' },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);
```

**Example: Get unique visitors by country:**
```typescript
const countryVisitors = await PostAnalytics.aggregate([
  { $match: { postSlug: slug } },
  {
    $group: {
      _id: { country: '$country', ip: '$ipHash' },
    },
  },
  {
    $group: {
      _id: '$_id.country',
      uniqueVisitors: { $sum: 1 },
    },
  },
]);
```

---

## 🎨 Customization

### Theme Customization

**Colors (Tailwind Config):**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',    // Indigo
        secondary: '#06B6D4',  // Cyan
        accent: '#F59E0B',     // Amber
      },
    },
  },
};
```

**Dark Mode:**
```typescript
// app/globals.css
.dark {
  --primary: #6366F1;
  --background: #09090B;
  --foreground: #FAFAFA;
}
```

### Typography

**Fonts:**
```typescript
// app/layout.tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});
```

**Responsive Breakpoints:**
```css
/* BlogContent.tsx */
@media (max-width: 375px)  { /* Small Mobile */ }
@media (max-width: 640px)  { /* Mobile Portrait */ }
@media (max-width: 768px)  { /* Mobile Landscape */ }
@media (max-width: 1024px) { /* Tablet */ }
```

---

## 🧪 Testing

### Manual Testing Checklist

**Before Deployment:**
- [ ] Build succeeds locally (`npm run build`)
- [ ] All pages load without errors
- [ ] Authentication works (sign in/out)
- [ ] Posts can be created/edited/deleted
- [ ] Comments can be added/edited/deleted
- [ ] Voting system works
- [ ] Analytics are tracked
- [ ] Images upload successfully
- [ ] Mobile responsive on all breakpoints
- [ ] SEO meta tags are correct
- [ ] Sitemap generates correctly

**Post-Deployment:**
- [ ] Production site loads
- [ ] Environment variables configured
- [ ] Database connection works
- [ ] OAuth authentication works
- [ ] Cloudinary uploads work
- [ ] Analytics data populates
- [ ] Google Search Console verified
- [ ] No console errors

### Automated Testing (Future)

```bash
# Unit tests (coming soon)
npm run test

# E2E tests (coming soon)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue with detailed reproduction steps
2. **Suggest Features**: Share your ideas in GitHub Discussions
3. **Improve Documentation**: Fix typos, add examples, clarify instructions
4. **Submit Pull Requests**: Fix bugs or implement features

### Development Workflow

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/inkraft.git
cd inkraft
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

4. **Test your changes**
```bash
npm run build
npm run dev
```

5. **Commit with conventional commits**
```bash
git commit -m "feat: add amazing feature"
git commit -m "fix: resolve analytics bug"
git commit -m "docs: update README"
```

6. **Push and create PR**
```bash
git push origin feature/amazing-feature
```

### Coding Standards

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Files**: Descriptive names, group related files
- **Comments**: Explain why, not what
- **Formatting**: Use Prettier (coming soon)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability and warranty not provided

---

## 🙏 Acknowledgments

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Recharts](https://recharts.org/) - Charts and visualizations
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Vercel](https://vercel.com/) - Deployment platform

### Inspiration

- Medium's clean reading experience
- Substack's author-first approach
- Dev.to's community engagement
- Ghost's SEO optimization

### Special Thanks

- Next.js team for amazing framework
- MongoDB for reliable database
- Vercel for seamless deployment
- Open source community for libraries

---

## 📞 Support & Community

### Get Help

- 📖 **Documentation**: You're reading it!
- 💬 **GitHub Discussions**: Ask questions, share ideas
- 🐛 **GitHub Issues**: Report bugs, request features
- 📧 **Email**: support@inkraft.app (if applicable)

### Stay Updated

- ⭐ **Star this repo** to show support
- 👀 **Watch releases** for updates
- 🍴 **Fork** to create your own version

### Roadmap

**Coming Soon:**
- [ ] Email notifications for comments
- [ ] Advanced search with Algolia
- [ ] Newsletter integration
- [ ] Monetization features (paid posts)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (cohort analysis)

**In Progress / Completed:**
- [x] Geographic analytics ✅
- [x] SEO optimization ✅
- [x] Responsive design ✅
- [x] Admin panel ✅
- [x] AI writing assistant ✅
- [x] Multi-language support (i18n) (Partial)

---

## 📚 Additional Resources

### Related Documentation

- [Gmail Setup Guide](GMAIL_SETUP_GUIDE.md) - Complete guide for setting up contact form emails
- [BotID Setup Guide](BOTID_SETUP_GUIDE.md) - Vercel bot protection configuration
- [SEO Guide](SEO_GUIDE.md) - Complete SEO optimization guide
- [Blog Formatting Guide](BLOG_FORMATTING_GUIDE.md) - Content creator guide
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Fixes & Solutions](FIXES.md) - Common issues and solutions

### External Links

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [NextAuth Docs](https://next-auth.js.org/getting-started/introduction)
- [Vercel Docs](https://vercel.com/docs)

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⬆ Back to Top](#inkraft---premium-editorial-blogging-platform)

</div>

