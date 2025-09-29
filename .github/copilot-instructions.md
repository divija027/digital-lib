# Brainreef - AI Coding Agent Instructions

## Architecture Overview

This Next.js 15 + TypeScript project follows a domain-driven design with clear separation:
- **Frontend**: App Router with server/client components, Shadcn UI + Tailwind
- **Backend**: API routes with JWT authentication, Prisma ORM + PostgreSQL
- **Domain**: VTU curriculum-based academic resource management system

## Critical Patterns & Conventions

### Authentication & RBAC
- JWT tokens in HTTP-only cookies (`auth-token`)
- Admin whitelist in `src/lib/admin-rbac.ts` - only `admin@gmail.com` and `superadmin@gmail.com` can access `/admin`
- Use `isAdminAllowed(email, role)` for access control
- Middleware protects `/admin/*` routes (returns 404 for unauthorized users)

### Database Schema Knowledge
- **MCQ System**: `MCQSet` has `totalTimeLimit`/`questionTimeLimit` fields (NOT `timeLimit`)
- **VTU Curriculum**: Comprehensive branch/semester structure in `src/lib/vtu-curriculum.ts`
- **File Storage**: Local filesystem with structured paths `uploads/branch/semester/subject/`

### Component Architecture
- Use Shadcn UI components from `src/components/ui/`
- Follow the `Card`, `Button`, `Input` pattern with consistent styling
- Admin components in `src/components/admin/`
- Form validation with Zod + React Hook Form

### API Route Patterns
```typescript
// Standard error handling pattern
try {
  // Business logic
  return NextResponse.json(data)
} catch (error) {
  console.error('Context-specific error:', error)
  return NextResponse.json({ error: 'Descriptive message' }, { status: 500 })
}
```

## Development Workflow

### Essential Commands
```bash
pnpm db:generate    # After schema changes
pnpm db:push        # Deploy schema to DB
pnpm db:seed        # Seed with admin users
pnpm dev --turbopack # Development with Turbopack
```

### File Upload System
- 25MB limit for PDFs, 10MB for other files
- Validation in both client (`src/components/admin/ResourceUpload.tsx`) and API (`src/app/api/admin/resources/upload/route.ts`)
- Structured storage: `uploads/{branch}/{semester}/{subject}/{timestamp}-{filename}`

### Admin Dashboard Integration
- All admin features use custom hooks from `src/hooks/useAdminApi.ts`
- Dashboard stats from `src/app/api/admin/dashboard/route.ts`
- Always use RBAC checks in admin API routes

## Project-Specific Gotchas

1. **Schema Field Names**: MCQ sets use `totalTimeLimit` not `timeLimit` in database
2. **Admin Access**: Return 404 (not 401/403) for unauthorized admin access
3. **VTU Branches**: Use curriculum data from `vtu-curriculum.ts` for branch/semester logic
4. **File Serving**: Route through `/api/uploads/[filename]` for access control
5. **Authentication State**: Check both cookie and payload validation in protected routes

## Key Directories
- `src/app/admin/` - Admin dashboard pages
- `src/app/api/admin/` - Admin-only API endpoints  
- `src/lib/vtu-curriculum.ts` - Complete VTU academic structure
- `prisma/schema.prisma` - Database schema with MCQ, Blog, Resource models
