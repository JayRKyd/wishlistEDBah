# WishListED Bahamas - Next.js & Supabase Migration Guide

## Overview

This document outlines the migration from Express.js/React/Neon to Next.js 15/Supabase. The migration provides better performance, server-side rendering, and simplified deployment.

## Migration Steps

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Settings > API and copy your Project URL and anon public key
4. Set up environment variables:

```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Run Database Migration

Execute the SQL migration file in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
```

This will create:
- All necessary tables (users, teachers, wishlists, wishlist_items, pledges)
- Row Level Security (RLS) policies
- Triggers for automatic user creation and timestamp updates
- Proper indexes for performance

### 3. Update Dependencies

The following packages have been added:
- `next@latest`  
- `@supabase/supabase-js`
- `@supabase/ssr`

### 4. Architecture Changes

#### Authentication
- **Before**: Replit Auth with OpenID Connect
- **After**: Supabase Auth with email/password and social providers
- **Files**: `app/auth/login/`, `app/auth/signup/`, `lib/supabase/`

#### API Routes  
- **Before**: Express.js routes in `server/routes.ts`
- **After**: Next.js App Router API routes in `app/api/`
- **Example**: `/api/auth/user` → `app/api/auth/user/route.ts`

#### Database
- **Before**: Neon PostgreSQL with Drizzle ORM
- **After**: Supabase PostgreSQL with Supabase client
- **Benefits**: Built-in auth, real-time subscriptions, Row Level Security

#### Frontend
- **Before**: Vite + React with Wouter routing
- **After**: Next.js 15 App Router with React Server Components
- **Benefits**: SSR, better SEO, optimized performance

### 5. Key Features Preserved

✅ Authentication-gated pledging system  
✅ Public wishlist browsing  
✅ Teacher and donor dashboards  
✅ Amazon wishlist integration  
✅ Direct bank transfer pledging  
✅ Real-time updates (via Supabase realtime)  
✅ Responsive design with Tailwind CSS  

### 6. New Features Added

🆕 Server-side rendering for better SEO  
🆕 Automatic user profile creation via database triggers  
🆕 Row Level Security for data protection  
🆕 Built-in email confirmation flow  
🆕 Optimized performance with Next.js App Router  

### 7. Environment Setup

```bash
# Development
npm run dev

# Build for production  
npm run build
npm run start
```

### 8. Deployment

The app is now ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify** 
- **Railway**
- **Any Node.js hosting provider**

### 9. Migration Checklist

- [ ] Create Supabase project
- [ ] Set environment variables
- [ ] Run database migration SQL
- [ ] Test user registration/login
- [ ] Verify teacher profile creation
- [ ] Test wishlist creation and viewing
- [ ] Test pledge functionality
- [ ] Verify email confirmation flow
- [ ] Deploy to production

### 10. Troubleshooting

**Issue**: Users can't sign up  
**Solution**: Check that the database migration ran and RLS policies are active

**Issue**: API routes return 500 errors  
**Solution**: Verify Supabase environment variables are set correctly

**Issue**: Authentication redirects fail  
**Solution**: Check that middleware.ts is properly configured

## Support

The migration maintains all existing functionality while providing a modern, scalable architecture that's easier to deploy and maintain.