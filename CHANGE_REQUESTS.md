# Inkraft - Change Requests & Feature Improvements

> **Purpose**: Use this file to request new features or improvements to existing features.  
> **Instructions**: Add your requests under the "📝 Your Change Requests" section below. I'll review this file and implement accordingly.

---

## 📝 Your Change Requests


### Template (Copy and use for each request):

```markdown
### [Request #X] - [Short Title]
**Type**: New Feature / Improvement / Bug Fix
**Priority**: High / Medium / Low
**Description**: 
[Describe what you want added or changed]

**Why**: 
[Why this change is needed]

**Acceptance Criteria**:
- [ ] Criteria 1
- [ ] Criteria 2
```

---

### Add your requests below this line:

<!-- START YOUR REQUESTS HERE -->

# Inkraft — Next Improvements Specification
Status: Post-Implementation Refinement (Validated)

This document lists **new, incremental improvements** identified after
reviewing the live site and README, assuming all prior UX and feature
requests have already been implemented successfully.

The goal of this phase is:
- Better first-time understanding
- Stronger discovery loops
- Clearer value communication
- Higher perceived polish
- Better retention without feature bloat

---

## 1. First-Time User Onboarding (Contextual, Non-Intrusive) ✅ [Implemented]

### Outcome
Help new users immediately understand:
- What Inkraft is
- Why it’s different
- What they should do next

### Problem
New visitors may not instantly grasp Inkraft’s editorial depth and unique strengths.

### Probable Logic
- Detect first visit via cookie/localStorage
- Show onboarding only once
- Allow skip at any time

### UI/UX Changes
- Lightweight modal or tooltip flow:
  1. “Welcome to Inkraft”
  2. “Explore curated, long-form content”
  3. “Follow authors & categories”
  4. “Write or engage when ready”
- Optional “Don’t show again” checkbox

### Scope Control
- No long walkthrough
- No forced signup
- Max 3–4 steps

---

## 2. “Why Inkraft” / Value Proposition Section ✅ [Implemented]

### Outcome
Clearly communicate Inkraft’s positioning to:
- New readers
- Potential contributors
- Recruiters / clients

### Problem
Strong features exist, but the philosophy is implicit, not explicit.

### Probable Logic
- Static page or homepage section
- Content driven by markdown or CMS

### UI/UX Changes
- Dedicated page or homepage block explaining:
  - Reading-first design
  - Trust & reputation system
  - Analytics-driven insights
  - Privacy-first approach
- Short, scannable bullets

### Scope Control
- No marketing fluff
- No buzzwords
- Honest, product-led explanation

---

## 3. Explore Page Discovery Enhancements ✅ [Implemented]

### Outcome
Increase serendipitous content discovery.

### Problem
Explore is functional but can feel linear.

### Probable Logic
- Use existing analytics signals:
  - Category popularity
  - Engagement metrics
  - Reading history (for logged-in users)

### UI/UX Changes
- Add sections like:
  - “Trending Topics”
  - “Popular This Week”
  - “Recommended Based on Your Reading”
- Tag cloud or category heat indicator

### Scope Control
- No heavy algorithms
- No infinite scrolling
- Keep pagination explicit

---

## 4. Comment Experience Polishing (UX Layer)

### Outcome
Make discussions easier to follow and higher quality.

### Problem
Comments work, but hierarchy and control can be clearer.

### Probable Logic
- Relevance score = votes + replies + author trust
- Default sort: Most Relevant

### UI/UX Changes
- Expand / collapse comment threads
- Clear indentation for replies
- Visual emphasis for high-trust commenters
- Sort options: Relevant | Newest

### Scope Control
- No emoji reactions
- No gamified comment scoring UI

---

## 5. Reader Personal Library UI Upgrade

### Outcome
Make saved content feel like a personal reading space.

### Problem
Saved posts exist but are under-emphasized.

### Probable Logic
- Use existing saved/read data
- Categorize by reading status

### UI/UX Changes
- “My Library” or “My Reads” page:
  - Saved
  - In-progress
  - Finished
- Filters by category or author

### Scope Control
- No social sharing of libraries
- No public stats

---

## 6. Notification Center UX Refinement

### Outcome
Ensure notifications are helpful, not noisy.

### Problem
Notifications may be overlooked or feel passive.

### Probable Logic
- Group notifications by type
- Mark as read/unread
- Allow per-type mute settings

### UI/UX Changes
- Notification bell with badge count
- Clear labels:
  - New post
  - Comment reply
  - Engagement update
- Toasts for important events only

### Scope Control
- No push notifications yet
- No real-time spam

---

## 7. Series Navigation & Progress Feedback

### Outcome
Increase long-form completion and session depth.

### Problem
Series content exists but can be made more engaging.

### Probable Logic
- Track series progress per user
- Identify next unread post

### UI/UX Changes
- “Continue this series” CTA
- Progress bar or checklist in series sidebar
- Breadcrumb navigation within series

### Scope Control
- No gamification
- No completion badges

---

## 8. Author Analytics Insight Layer (UX, Not Data)

### Outcome
Help authors *understand why* content performs well.

### Problem
Metrics exist, but interpretation can be improved.

### Probable Logic
- Derive insights from existing data:
  - High completion + low comments
  - High comments + low completion

### UI/UX Changes
- Insight cards:
  - “Readers stayed till the end”
  - “This post sparked discussion”
- Simple comparisons between posts

### Scope Control
- No AI explanations
- No overwhelming dashboards

---

## 9. About / Case Study Page for Inkraft

### Outcome
Strengthen Inkraft as:
- A portfolio project
- A professional product
- A credibility signal

### Problem
External viewers (recruiters, clients) lack context.

### Probable Logic
- Static markdown page

### UI/UX Changes
- Sections:
  - Why Inkraft was built
  - Problems it solves
  - Key design decisions
  - Tech stack overview
  - Lessons learned

### Scope Control
- No personal story overload
- Keep it professional and concise

---

## 10. Public Roadmap & Changelog

### Outcome
Build transparency and community trust.

### Problem
Users don’t see evolution clearly.

### Probable Logic
- Markdown-driven roadmap
- Simple status labels

### UI/UX Changes
- “Roadmap” page with:
  - Planned
  - In progress
  - Shipped
- “What’s new” changelog

### Scope Control
- No voting on roadmap yet
- No promises with dates

---

## FINAL PRIORITY ORDER (Suggested)

1. First-time onboarding
2. Value proposition / Why Inkraft
3. Explore page discovery boost
4. Reader library UI
5. Comment UX polish
6. Notification center refinement
7. Series progress UX
8. Author analytics insights
9. Case study page
10. Public roadmap

---

## SUCCESS INDICATORS

- Lower bounce rate for new users
- Higher explore-page engagement
- Increased saved & resumed reads
- Better author retention
- Clearer external perception of Inkraft

---

## FINAL NOTE

At this stage, Inkraft does not need *more features*.
It needs **clarity, flow, and refinement**.

These improvements focus on:
- Making value obvious
- Making good content easier to find
- Making the platform feel complete

This is the polish phase that separates
**good projects from memorable ones**.



<!-- END YOUR REQUESTS -->

---

## ✅ Completed Features (For Context)

This section shows everything already implemented so you know what's available and what to build upon.

### Phase 1: Reading & Writing Delight ✅

#### Focus Mode
- Single-click distraction-free reading
- Hides navbar, sidebar, comments
- Adjustable font size and line height
- Light/Dark/Sepia backgrounds
- Preferences saved in localStorage

#### Reading Progress Memory
- Remembers scroll position per post
- "Resume reading" indicator
- Private per-user tracking

#### Smart Table of Contents
- Auto-generated from headings
- Active section highlighting (IntersectionObserver)
- Auto-collapse completed sections
- Mobile jump navigation

#### Calm Editor Mode
- Fullscreen writing environment
- Soft background
- Current paragraph focus
- Persists per author

#### Smart Draft Recovery
- Auto-save every few seconds
- Browser-based backup (IndexedDB/localStorage)
- Crash recovery
- Server sync

---

### Phase 2: Reader Engagement ✅

#### Inline Private Notes
- Attach notes to paragraphs
- Private to user only
- Add/edit/delete functionality
- Perfect for students/researchers

#### Highlight & Copy as Markdown
- Copy selected text as clean Markdown
- Copy with citation links
- Clipboard API integration

#### Difficulty Badges
- Beginner/Intermediate/Advanced labels
- Author-selectable, admin override
- Displayed near title

#### Accurate Reading Time
- 200 wpm base calculation
- +20s per code block
- +12s per image
- Honest estimates

#### Silent Feedback
- "Helpful", "Clear", "Needs more detail"
- Anonymous aggregates
- Author/admin visibility only

---

### Phase 3: Discovery & Retention ✅

#### Personalized Feed
- Based on followed authors/categories
- Trending + latest mixed in
- Paginated (no infinite scroll)

#### Reading History
- Track all read posts
- Resume access
- Private data

#### Series Navigation
- Multi-part article organization
- Landing pages with progress
- Previous/Next navigation
- SEO optimized

#### Author Following
- Follow favorite writers
- Counts on profiles only
- Notification triggers
- Relationship-driven

#### Reading Streaks
- Consecutive reading days
- Private only
- No leaderboards
- Gentle motivation

---

### Phase 4: Content Amplification ✅

#### SEO Dashboard
- Real-time optimization tips
- Meta tag guidance
- Keyword suggestions
- Character counting
- Preview cards (OpenGraph/Twitter)

#### Social Preview Generation
- Twitter/LinkedIn previews
- Client-side Canvas API
- No external services
- Copy image capability

#### Newsletter System
- Built-in subscriptions
- Email integration
- Subscriber management
- Audience ownership

#### Advanced Analytics
- Geographic tracking (city-level)
- Scroll depth & time on page
- Completion rate tracking
- Exit point analysis
- Referrer quality scoring

#### Topic Heatmap
- Category popularity trends
- Bar/line charts
- Author/admin visibility
- No external analytics

---

### Phase 5: Power Features ✅

#### AI Writing Assistant
- OpenAI-powered suggestions
- Text selection improvements
- Tone adjustment
- Content expansion
- Context-aware recommendations

#### Export Posts
- PDF download
- Markdown export
- JSON backup
- Full data ownership

#### Keyboard Shortcuts
- `g+h` - Home
- `/` - Search
- `f` - Focus mode
- `Shift+?` - Shortcuts modal

#### Bangla Typography
- Full বাংলা support
- Noto Sans Bengali font
- Proper rendering
- Cultural inclusivity

---

### Phase 5.1: Comprehensive i18n ✅ (v0.2.1)

#### UI Translation
- English and বাংলা interfaces
- One-click switching
- Consistent translations

#### Multi-language Posts
- Write posts in multiple languages
- Dedicated translation fields
- Language-specific management

#### Language Switcher
- Globe icon in navbar
- Instant switching
- Persistent preference

#### SEO Optimization
- `hreflang` tags
- Language-specific metadata
- Separate URLs per language
- International visibility

#### Smart Fallback
- Original language display for missing translations
- Graceful degradation
- User notices

---

### Core Platform Features (Already Built) ✅

#### Content Creation
- **Rich Text Editor** (TipTap) - WYSIWYG with syntax highlighting
- **Image Uploads** - Cloudinary integration
- **SEO Panel** - Real-time title/description preview
- **Markdown Support** - Including in comments
- **Import** - From Markdown files or Medium exports

#### Analytics & Insights
- **Geographic Tracking** - IP-based, 150+ countries, GDPR-compliant
- **Engagement Metrics** - Views, time on page, scroll depth
- **Visual Dashboards** - Charts for daily views, devices, browsers
- **Two-Level Analytics** - Post-level + Author-level
- **Export Data** - CSV/JSON

#### Community & Social
- **Comment System** - Threaded replies, Markdown formatting
- **Voting System** - Upvote/downvote with trust score weights
- **Follow System** - Authors and categories
- **Notifications** - Real-time bell, unread counts
- **Personal Library** - Save posts, reading history
- **Series System** - Multi-part content with landing pages

#### Authentication & Security
- **Multi-Provider Auth** - Email/Password + Google OAuth
- **Vercel BotID** - Advanced bot protection
- **User Roles** - Admin, Author, Reader
- **Trust Scores** - Anti-abuse system
- **Rate Limiting** - API protection

#### Admin Features
- **Content Moderation** - Approve/reject posts
- **User Management** - Ban/unban, role assignment
- **Admin Alerts** - Vote spikes, spam detection
- **Trust & Safety Tools** - Vote nullification, score freezing
- **Statistics Dashboard** - Site-wide metrics

#### Publications & Teams
- **Create Publications** - Multi-author collaboration
- **Team Roles** - Owner, Admin, Editor, Writer
- **Shared Analytics** - Publication-level stats
- **Landing Pages** - Dedicated publication URLs

#### Technical Features
- **SEO** - Schema.org, dynamic sitemaps, robots.txt
- **Responsive Design** - Mobile-optimized (375px+)
- **Dark Mode** - System preference support
- **Progressive Enhancement** - Works without JS
- **Email Integration** - Contact form, Gmail SMTP
- **Mobile-First Enhancements** - Improved touch targets, responsive tables, adaptive layouts

---

### Phase 6 & 7: Engagement & Visual Polish ✅

#### Homepage Visual Hierarchy
- **Hero Card** - Featured content prominence
- **Top Posts** - Visual ranking (1-3)
- **Trending Section** - Algorithm-driven discovery

#### Reputation Badges
- **Visual Trust** - Newcomer / Contributor / Expert badges
- **Contextual Display** - Profiles, comments, and headers

#### Editorial tools
- **Weekly Digest** - Curated collections with editor picks
- **Related Content** - Context-aware continuation flow
- **Comment Polish** - Threaded, edited status, clear hierarchy

---

---

## 📋 How to Use This File

1. **Add Your Request**: Use the template above and add it under "Your Change Requests"
2. **Be Specific**: Include detailed descriptions and acceptance criteria
3. **Reference Context**: Look at the completed features list to see what's available
4. **Prioritize**: Mark priority so I know what's urgent
5. **Review Together**: We'll discuss feasibility and approach before implementation

---

## 💡 Tips for Good Requests

- **Clear Goal**: What problem does this solve?
- **User Benefit**: How does this help readers/writers/admins?
- **Examples**: Reference similar features from other platforms
- **Scope**: Is this a small tweak or major feature?
- **Dependencies**: Does this require other features first?
