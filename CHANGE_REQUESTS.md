# Inkraft - Change Requests & Feature Improvements

> **Purpose**: Use this file to request new features or improvements to existing features.  
> **Instructions**: Add your requests under the "📝 Your Change Requests" section below. I'll review this file and implement accordingly.

---

## 📝 Your Change Requests
# Inkraft — Next Phase Unified Specification
Status-aligned, free-only, user-first evolution plan

This document consolidates ALL approved next features for Inkraft
based on current progress, repo validation, and platform maturity.

Scope:
- No paid APIs
- No feature bloat
- No social-media dark patterns
- Editorial quality > engagement hacks

---

## CURRENT BASELINE (ASSUMED DONE)

Inkraft already has:
- Rich editor (TipTap)
- Strong typography & SEO
- Analytics (views, scroll, geo)
- Comments + voting
- Author/Admin separation
- Trust score (internal)
- Security & abuse protection
- Save/bookmark posts

This spec ONLY covers **what’s next**.

---

# FEATURE SET A — READING EXPERIENCE (IMMEDIATE IMPACT)

## 1. Reader Focus Mode

### Outcome
Make Inkraft feel premium, calm, and respectful of attention.
This directly increases long-form completion rate.

### Logic
- Toggle-based mode per reader
- State stored in localStorage (anonymous users)
- Overrides default layout styles

### UI Changes
- Add “Focus Mode” button near reading controls
- On activation:
  - Hide navbar
  - Hide footer
  - Hide comments
  - Expand content width slightly
- Show minimal floating toolbar:
  - Exit focus mode
  - Font size +
  - Line height +
  - Theme (Light / Dark / Sepia)

### Integration Notes
- No backend changes
- CSS + layout state only
- Should work on all post pages

---

## 2. Resume Reading (Progress Memory)

### Outcome
Readers feel Inkraft “remembers them”.
This increases return reading sessions.

### Logic
- Track scroll percentage per post
- Save:
  - Logged-in users → DB
  - Logged-out users → localStorage
- Trigger resume prompt if progress > 15%

### UI Changes
- On returning to post:
  - Show subtle banner: “Resume reading from where you left off”
- Optional progress marker on scrollbar

### Integration Notes
- Uses existing analytics scroll logic
- Privacy-safe (not public)

---

## 3. Smart Table of Contents (Adaptive)

### Outcome
Improve navigation in long-form content without overwhelming UI.

### Logic
- Generate TOC from headings
- Use IntersectionObserver to:
  - Highlight active section
  - Collapse completed sections automatically

### UI Changes
- Desktop:
  - Sticky TOC sidebar
- Mobile:
  - Floating TOC button
- Active section highlighted
- Completed sections visually dimmed

### Integration Notes
- Client-side only
- No schema changes

---

# FEATURE SET B — WRITER EXPERIENCE (RETENTION DRIVER)

## 4. Calm Editor Mode

### Outcome
Writers feel safe, focused, and respected.
This is why authors choose platforms.

### Logic
- Toggle fullscreen editor
- Hide all side panels
- Dim background
- Highlight active paragraph

### UI Changes
- “Calm Mode” button in editor toolbar
- Exit via ESC or button
- Optional word-count-only footer

### Integration Notes
- TipTap extension + layout state
- No data changes

---

## 5. Smart Draft Recovery

### Outcome
Zero content loss → massive trust gain.

### Logic
- Auto-save draft to:
  - IndexedDB / localStorage every X seconds
- On reload:
  - Detect unsaved draft
  - Prompt restore

### UI Changes
- Restore modal on editor open
- “Recovered from local backup” notice

### Integration Notes
- Complements existing auto-save
- Local-first, free-only

---

# FEATURE SET C — TRUST & QUALITY (VISIBILITY, NOT GAMING)

## 6. Visible Reputation Badges (Not Scores)

### Outcome
Readers instantly know who to trust.
Comment quality improves automatically.

### Logic
- Map internal trust score → badge level
- Levels:
  - New Author
  - Contributor
  - Trusted Author
  - Expert

### UI Changes
- Badge shown:
  - On author profile
  - On post header
  - Next to username in comments
- Tooltip explaining badge meaning

### Integration Notes
- No score numbers shown
- Uses existing trust logic

---

## 7. Silent Feedback System (Private)

### Outcome
Improve content quality without comment toxicity.

### Logic
- Readers can select:
  - Helpful
  - Clear
  - Needs more detail
- Stored anonymously
- Aggregated per post

### UI Changes
- Small feedback buttons at end of article
- Authors see aggregate stats in dashboard
- Admins see site-wide trends

### Integration Notes
- Simple feedback collection
- No public display

---

# FEATURE SET D — DISCOVERY WITHOUT ADDICTION

## 8. Follow Authors (Soft Launch)

### Outcome
Create personal attachment without social pressure.

### Logic
- Users can follow authors
- No follower counts on posts
- Counts visible only on profile

### UI Changes
- Follow button on author profile & post header
- Subtle confirmation state

### Integration Notes
- No feed yet
- Used later for notifications

---

## 9. Weekly Digest (Manual First)

### Outcome
Habit-building without algorithms.

### Logic
- Admin-curated weekly digest
- Includes:
  - Best posts
  - Editor’s picks
  - Notable discussions

### UI Changes
- “This Week on Inkraft” page
- Optional email (later)

### Integration Notes
- Start manual
- No automation needed initially

---

## 10. Series & Long-Form Collections

### Outcome
Encourage structured, deep content.
Boost session duration & SEO.

### Logic
- Series entity:
  - Title
  - Description
  - Ordered posts
- Post belongs to max one series

### UI Changes
- “Part X of Y” indicator on posts
- Series landing page
- Previous / Next navigation

### Integration Notes
- Strong fit now (content maturity reached)

---

# FEATURE SET E — READER DELIGHT (DIFFERENTIATION)

## 11. Inline Private Reader Notes

### Outcome
Appeals to students, researchers, serious readers.

### Logic
- User selects paragraph
- Adds private note
- Notes visible only to user

### UI Changes
- “Add note” option on selection
- Notes icon in margin
- Notes panel toggle

### Integration Notes
- Simple DB relation
- No sharing

---

## 12. Highlight & Copy as Clean Markdown

### Outcome
Developers and writers love this.
Encourages sharing & reuse.

### Logic
- Normalize selected HTML → Markdown
- Optional citation link appended

### UI Changes
- Copy menu on selection
- “Copy as Markdown” option

### Integration Notes
- Clipboard API
- Client-side conversion

---

## 13. Difficulty Indicator

### Outcome
Readers choose content confidently.

### Logic
- Author selects:
  - Beginner
  - Intermediate
  - Advanced
- Admin override allowed

### UI Changes
- Difficulty badge near title
- Filter option later

---

## 14. Accurate Reading Time

### Outcome
Builds reader trust.

### Logic
Base: 200 wpm
+20s per code block
+12s per image


### UI Changes
- Replace generic reading time with accurate estimate

---

# FEATURE SET F — GOVERNANCE & SAFETY

## 15. Admin Alert Signals

### Outcome
Admins act before problems escalate.

### Logic
Trigger alerts on:
- Sudden vote spikes
- Repeated reports
- High engagement from low-trust users

### UI Changes
- Alerts panel in admin dashboard
- Action buttons:
  - Freeze trust
  - Lock comments
  - Hide post

---

# WHAT WE ARE NOT ADDING (YET)

- ❌ Paid AI tools
- ❌ Real-time collaboration
- ❌ Infinite feeds
- ❌ Emoji reactions
- ❌ Paid subscriptions

---

# IMPLEMENTATION ORDER (CRITICAL)

1. Reader Focus Mode
2. Resume Reading
3. Calm Editor Mode
4. Visible Reputation Badges
5. Silent Feedback
6. Series Support
7. Follow Authors
8. Weekly Digest
9. Inline Notes
10. Clean Markdown Copy

Stop after step 5 and measure.
If users love reading, everything else compounds.

---

# SUCCESS METRICS

- Avg read completion ↑
- Return visits ↑
- Comment quality ↑
- Author retention ↑
- Admin moderation load ↓

---

## FINAL PRINCIPLE

Inkraft does not win by being loud.
It wins by being **thoughtful**.


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

### Phase 5.1: Comprehensive i18n ✅

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
