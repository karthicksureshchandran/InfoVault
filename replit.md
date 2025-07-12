# InfoVault - Personal Repository Manager

## Overview

InfoVault is a full-stack personal repository management application that allows users to organize and manage their digital assets in a project-based structure. The application provides a comprehensive solution for storing, categorizing, and searching through various types of digital content including URLs, images, videos, documents, code files, notes, references, and archives.

## User Preferences

Preferred communication style: Simple, everyday language.
Desktop application requirements: Local storage only, no cloud features, built-in database preferred.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

**Frontend**: React-based single-page application with TypeScript
- Built with Vite for fast development and optimized builds
- Uses Wouter for lightweight client-side routing
- Styled with Tailwind CSS and shadcn/ui components
- State management via TanStack Query (React Query)

**Backend**: Express.js REST API server
- TypeScript-based Node.js server
- RESTful API endpoints for projects and items
- SQLite database with persistent storage (better-sqlite3)
- Development server with Vite integration for seamless full-stack development

**Database**: SQLite with better-sqlite3
- Built-in file-based database perfect for desktop applications
- Data stored in user's home directory (~/.infovault/infovault.db)
- No external database server required - completely self-contained
- Schema-first approach with TypeScript type generation

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query for server state with optimistic updates
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight routing without React Router overhead

### Backend Architecture
- **API Layer**: Express.js with typed request/response handling
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Schema Validation**: Zod schemas shared between client and server
- **Development Experience**: Hot reload with Vite integration and structured logging

### Data Models
- **Projects**: Top-level containers for organizing items
- **Items**: Individual assets with metadata, tags, and categorization
- **Item Types**: Support for URLs, images, videos, documents, code, notes, references, and archives

## Data Flow

1. **Client Requests**: Frontend components trigger API calls through custom hooks
2. **API Processing**: Express routes validate input and interact with storage layer
3. **Storage Operations**: Storage interface handles CRUD operations (currently in-memory)
4. **Response Handling**: TanStack Query manages caching, optimistic updates, and error states
5. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express**: Backend web framework
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: PostgreSQL hosting service

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Schema validation library

### UI/UX Dependencies
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling with validation

## Deployment Strategy

**Development**:
- Vite dev server for frontend with hot module replacement
- Express server with TypeScript compilation via tsx
- Shared type definitions between client and server

**Production**:
- Frontend built as static assets via Vite
- Backend bundled with esbuild for Node.js deployment
- Database migrations handled through Drizzle Kit
- Environment-based configuration for database connections

**Build Process**:
1. TypeScript compilation and type checking
2. Frontend asset bundling and optimization
3. Backend bundling for production deployment
4. Database schema synchronization

The application is designed to be easily deployable on platforms like Replit, with built-in SQLite database for desktop deployment and production optimizations. Perfect for conversion to desktop applications using Electron, Tauri, or PWA frameworks.