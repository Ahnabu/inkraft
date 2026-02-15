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
