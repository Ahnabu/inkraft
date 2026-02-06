# Inkraft - Premium Editorial Blogging Platform

A modern, full-featured blogging platform built with Next.js 15, MongoDB, and NextAuth.js. Inkraft provides a premium reading and writing experience with advanced features like voting, commenting, saved articles, and engagement tracking.

## Features

- 🎨 Modern, glass-morphism UI with dark mode support
- ✍️ Rich text editor with TipTap (Markdown support)
- 🔐 Authentication with NextAuth.js (Credentials + Google OAuth)
- 💾 MongoDB database with Mongoose ODM
- 📊 Engagement tracking (views, votes, saves, comments)
- 🏆 Trending and top posts algorithms
- 💬 Threaded comments system
- 🔖 Save/bookmark articles
- 🖼️ Image upload with Cloudinary
- 📱 Fully responsive design
- ⚡ Optimized for Vercel serverless deployment
- 🔍 SEO optimized with metadata and Open Graph

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS 4
- **Editor**: TipTap
- **Image Storage**: Cloudinary
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB Atlas account (or local MongoDB)
- Vercel account (for deployment)
- Cloudinary account (optional, for image uploads)
- Google OAuth credentials (optional, for social login)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blogging
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your credentials:
```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Generate AUTH_SECRET

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

Build for production:

```bash
npm run build
npm start
```

### Pre-Deployment Check

Before deploying, run the pre-deployment verification script:

**Windows:**
```bash
.\pre-deploy-check.bat
```

**Linux/Mac:**
```bash
chmod +x pre-deploy-check.sh
./pre-deploy-check.sh
```

## Deployment to Vercel

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Required Environment Variables for Vercel

```env
MONGODB_URI=<your-mongodb-connection-string>
AUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_GOOGLE_ID=<your-google-client-id>
AUTH_GOOGLE_SECRET=<your-google-client-secret>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── blog/              # Blog post pages
│   ├── auth/              # Authentication pages
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...
├── lib/                   # Utility functions
│   ├── mongodb.ts        # MongoDB connection
│   ├── engagement.ts     # Engagement calculations
│   └── ...
├── models/               # Mongoose models
│   ├── Post.ts
│   ├── User.ts
│   └── ...
├── public/               # Static assets
└── ...
```

## Key Files

- `auth.ts` - NextAuth configuration
- `middleware.ts` - Route protection middleware
- `lib/mongodb.ts` - MongoDB connection with serverless optimization
- `lib/mongodb-adapter.ts` - NextAuth MongoDB adapter
- `next.config.ts` - Next.js configuration
- `vercel.json` - Vercel deployment configuration

## Troubleshooting

See [FIXES.md](FIXES.md) for common issues and solutions.

### Common Issues

**Build Errors:**
- Run `npm run build` locally to identify errors
- Check TypeScript errors
- Verify all dependencies are installed

**500 Errors:**
- Check environment variables in Vercel
- Verify MongoDB connection string
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Review function logs in Vercel dashboard

**Authentication Issues:**
- Verify AUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure Google OAuth redirect URIs are correct

## MongoDB Indexes

For optimal performance, create these indexes in MongoDB Atlas:

```javascript
// Posts
db.posts.createIndex({ slug: 1 }, { unique: true })
db.posts.createIndex({ published: 1, publishedAt: -1 })
db.posts.createIndex({ published: 1, category: 1, publishedAt: -1 })

// Votes
db.votes.createIndex({ user: 1, post: 1 }, { unique: true })

// Comments
db.comments.createIndex({ post: 1, deleted: 1, createdAt: -1 })
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Check [FIXES.md](FIXES.md) for common issues
- Open an issue on GitHub

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

