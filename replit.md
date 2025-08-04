# WishListED Bahamas - Teacher Wishlist Web Application

## Overview

WishListED Bahamas is a full-stack web application that connects Bahamian teachers with donors to help fulfill classroom supply needs. The platform allows teachers to create and manage wishlists of needed items with external purchase links, while donors can browse and purchase items directly through external platforms. The application is built as a modern single-page application with real-time updates and a focus on user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18 and TypeScript using App Router
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Next.js App Router with file-based routing
- **State Management**: TanStack Query (React Query) for server state management
- **Server Components**: React Server Components for improved performance and SEO
- **Real-time Communication**: Supabase real-time subscriptions for live updates

### Backend Architecture
- **Framework**: Next.js 15 API Routes with serverless functions
- **Language**: TypeScript with ES modules
- **Database**: Supabase PostgreSQL with built-in auth and real-time features
- **Authentication**: Supabase Auth with email/password and social providers
- **Session Management**: Cookie-based sessions with @supabase/ssr
- **Security**: Row Level Security (RLS) policies for data protection
- **Real-time**: Supabase real-time subscriptions for live activity updates

### Monorepo Structure
The application follows a monorepo pattern with clear separation of concerns:
- `client/` - React frontend application
- `server/` - Express.js backend application
- `shared/` - Shared TypeScript schemas and types

## Key Components

### Authentication System
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Authorization**: Route-level protection with middleware

### Database Schema
- **Users**: Core user information from Replit Auth
- **Teachers**: Extended teacher profiles with school and location data
- **Wishlists**: Teacher-created lists of needed items
- **Wishlist Items**: Individual items with priority, quantity, and fulfillment status
- **External Purchase Links**: Links to external stores (Amazon, school supply stores) where donors can purchase items

### Real-time Features
- **WebSocket Integration**: Live updates for wishlist changes and activity
- **Activity Feed**: Real-time display of recent teacher requests and fulfillment updates
- **Status Updates**: Instant reflection of item fulfillment when teachers mark items complete

### User Roles and Flows
- **Teachers**: Must authenticate, create profiles, manage wishlists, and track donations
- **Donors/Parents**: Can browse without authentication, view external purchase links, and contact teachers
- **Guest Access**: Public wishlist viewing and search functionality

## Data Flow

### Teacher Workflow
1. Authentication via Replit Auth
2. Profile creation with school and location details
3. Wishlist creation and item management
4. Real-time tracking of item fulfillment
5. Direct communication with donors outside the platform

### Donor Workflow
1. Browse public wishlists (no authentication required)
2. Search and filter by location, grade, or keywords
3. View external purchase links and buy items through external platforms
4. Contact teachers directly for coordination

### Real-time Updates
- WebSocket connections for live activity feeds
- Automatic query invalidation on data changes
- Optimistic updates for better user experience

## External Dependencies

### Core Technologies
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Auth**: Authentication and user management
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state synchronization
- **Drizzle**: Type-safe ORM with PostgreSQL dialect

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the full stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundling for production

### Runtime Dependencies
- **Express.js**: Web framework for API routes
- **WebSocket**: Real-time communication protocol
- **Zod**: Runtime type validation
- **Nanoid**: Unique ID generation for share tokens

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Express serves static files and API routes
- **Database**: Environment-based connection strings
- **Sessions**: Secure session management with database persistence

### Scalability Considerations
- **Database**: Serverless PostgreSQL with connection pooling
- **Static Assets**: Served via Express with proper caching headers
- **WebSocket**: Single server instance with in-memory client management
- **Authentication**: Stateless JWT tokens with database session fallback

The application prioritizes simplicity and maintainability while providing a robust platform for connecting teachers with donors in the Bahamian education community. The hybrid MVP approach combines external purchase links with direct bank transfer pledging for maximum donation convenience and local banking integration.

## Recent Updates (January 2025)

### Authentication-Gated Pledging System Implementation
- **Public Wishlist Viewing**: Anonymous users can browse and search all teacher wishlists without authentication
- **Authentication-Required Pledging**: Users must sign in through Replit Auth to pledge donations for tracking and accountability
- **Amazon Wishlist Integration**: Teachers can add their Amazon wishlist URL to their profiles instead of individual purchase links
- **Donor Dashboard**: Authenticated users get access to a dedicated donor dashboard to track all their pledges and donations
- **Dual Donation Methods**: Donors can either purchase items through teacher's Amazon wishlist OR pledge via direct bank transfer
- **Secure Banking Information**: Teachers can add banking details (bank name, account number, account holder name, branch location) to their profiles
- **Privacy-First Approach**: Banking information is only revealed to donors after they authenticate and commit to a pledge
- **Production Ready**: Resolved all database schema conflicts, TypeScript errors, and critical production bugs for deployment stability

### Technical Architecture Updates  
- **Enhanced Database Schema**: Added `amazonWishlistUrl` field to teachers table and `getPledgesByDonorEmail` method to storage interface
- **Improved Route Structure**: Added `/donor` dashboard route for authenticated users to manage their pledge history
- **Authentication Flow**: Integrated pledging functionality with Replit Auth, requiring sign-in before donation commits
- **User Experience**: Maintained public access to wishlist browsing while protecting pledge functionality behind authentication

## Major Architecture Migration (January 2025)

### Next.js 15 & Supabase Migration
- **Framework Migration**: Converted from Express.js/React/Vite to Next.js 15 App Router for better performance and SSR
- **Database Migration**: Moved from Neon PostgreSQL with Drizzle ORM to Supabase PostgreSQL with built-in auth and real-time features
- **Authentication Overhaul**: Replaced Replit Auth with Supabase Auth for email/password and social login support
- **API Architecture**: Migrated Express routes to Next.js App Router API routes for serverless deployment compatibility
- **Enhanced Security**: Implemented Row Level Security (RLS) policies in Supabase for data protection
- **Performance Improvements**: Server-side rendering, automatic code splitting, and optimized bundle sizes
- **Deployment Ready**: Simplified deployment process compatible with Vercel, Netlify, and other modern hosting platforms

### Key Technical Improvements
- **Server Components**: Leveraged React Server Components for better performance and SEO
- **Automatic User Management**: Database triggers handle user profile creation automatically  
- **Real-time Capabilities**: Built-in Supabase real-time subscriptions for live updates
- **Modern Authentication**: Email confirmation, password reset, and social auth out of the box
- **Type Safety**: Maintained full TypeScript support with generated Supabase types
- **Scalable Architecture**: Serverless-ready design for automatic scaling