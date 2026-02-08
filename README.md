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

---

## 📖 Overview

Inkraft is a **premium editorial blogging platform** designed for content creators who demand more than just a basic blog. Built with cutting-edge technologies, Inkraft combines beautiful design, powerful analytics, and professional SEO tools to help you grow your audience and understand your readership.

### Why Inkraft?

- 📊 **Professional Analytics**: Geographic tracking, engagement metrics, and visual dashboards
- 🎯 **SEO First**: Built-in optimization with Schema.org, OpenGraph, and Google Search Console integration
- ✨ **Premium UX**: Glass-morphism design, smooth animations, and responsive across all devices
- 🚀 **Performance**: Optimized for speed with Next.js 16, edge functions, and smart caching
- 🔒 **Privacy-First**: GDPR-compliant analytics with IP hashing and secure authentication

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
  - Follow system ready
  - User activity tracking

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
  - Rate limiting on API routes
  - SQL injection prevention (NoSQL)
  - XSS protection

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

### Backend
- **Runtime**: Node.js 20.x / Edge Runtime
- **Database**: MongoDB Atlas (7.0+)
- **ODM**: Mongoose 8.x
- **Authentication**: NextAuth.js v5
- **Image Storage**: Cloudinary
- **Geolocation**: geoip-lite
- **User Agent Parsing**: ua-parser-js

### DevOps
- **Deployment**: Vercel (Serverless)
- **CI/CD**: GitHub Actions ready
- **Monitoring**: Vercel Analytics
- **Logging**: Console Ninja integration
- **Version Control**: Git

### SEO & Analytics
- **SEO Tools**: next-seo, Schema.org
- **Analytics**: Custom analytics engine
- **Search Console**: Google integration
- **Sitemap**: Dynamic XML generation

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
| `/admin` | Admin panel | Admin only |
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
- [ ] Multi-language support (i18n)
- [ ] Newsletter integration
- [ ] Monetization features (paid posts)
- [ ] Mobile app (React Native)
- [ ] AI writing assistant
- [ ] Advanced analytics (cohort analysis)

**In Progress:**
- [x] Geographic analytics ✅
- [x] SEO optimization ✅
- [x] Responsive design ✅
- [x] Admin panel ✅

---

## 📚 Additional Resources

### Related Documentation

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

