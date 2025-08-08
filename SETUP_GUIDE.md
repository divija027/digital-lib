# VTU University Resources MVP - Complete Setup Guide

## 🎯 Project Overview

This is a complete MVP (Minimum Viable Product) for VTU University students to access study resources. The application includes:

- **User Authentication** (Student/Admin roles)
- **Resource Management** (Upload, categorize, download)
- **Admin Dashboard** (Content management)
- **Student Portal** (Browse and download resources)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│                 │    │                 │    │                 │
│ • Next.js       │◄──►│ • API Routes    │◄──►│ • PostgreSQL    │
│ • React         │    │ • JWT Auth      │    │ • Prisma ORM    │
│ • TypeScript    │    │ • File Upload   │    │ • Relationships │
│ • Tailwind CSS  │    │ • Middleware    │    │ • Indexing      │
│ • Shadcn UI     │    │ • Validation    │    │ • Constraints   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Quick Start Guide

### 1. Prerequisites
```bash
# Install Node.js 18+
node --version  # Should be 18.0.0 or higher

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
# On Ubuntu/Debian: sudo apt install postgresql postgresql-contrib
# On macOS: brew install postgresql
# On Windows: Download from postgresql.org
```

### 2. Database Setup
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database
CREATE DATABASE vtu_resources;

-- Create user (optional)
CREATE USER vtu_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vtu_resources TO vtu_admin;

-- Exit
\q
```

### 3. Project Setup
```bash
# Navigate to project directory
cd /home/hx0r/adigaproj

# Install dependencies
pnpm install

# Update environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed initial data
pnpm db:seed

# Start development server
pnpm dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Login**: admin@vtu.ac.in / admin123
- **Student Login**: student@example.com / student123

## 🔧 Detailed Implementation

### Authentication System

**JWT-based authentication with HTTP-only cookies:**

1. **Registration Flow**:
   ```typescript
   POST /api/auth/register
   Body: { email, password, name }
   Response: { user, message }
   ```

2. **Login Flow**:
   ```typescript
   POST /api/auth/login
   Body: { email, password }
   Response: { user, token } + HTTP-only cookie
   ```

3. **Middleware Protection**:
   ```typescript
   // Protects admin routes and API endpoints
   /admin/* → Requires ADMIN role
   /api/resources POST → Requires ADMIN role
   ```

### Database Schema

```sql
-- Core Tables
Users (id, email, password, name, role, timestamps)
Categories (id, name, description, timestamps)
Subjects (id, name, code, semester, description, timestamps)
Resources (id, title, description, filePath, fileSize, type, semester, year, downloads, timestamps)

-- Relationships
Resources.categoryId → Categories.id
Resources.subjectId → Subjects.id
Resources.uploadedBy → Users.id
```

### File Upload System

**Features:**
- Multi-part form upload
- File type validation (PDF, DOC, DOCX, PPT, PPTX)
- Size limit (10MB)
- Secure file storage
- Download tracking

**Implementation:**
```typescript
// Upload endpoint
POST /api/resources
Content-Type: multipart/form-data
Files: file, title, description, categoryId, type, etc.

// File serving
GET /api/uploads/[filename]
Response: File stream with appropriate headers
```

### Admin Dashboard Features

1. **Statistics Overview**:
   - Total resources count
   - User registrations
   - Download analytics
   - Category distribution

2. **Resource Management**:
   - Upload new resources
   - Edit existing content
   - Delete resources
   - Monitor downloads

3. **Content Organization**:
   - Category management
   - Subject management
   - Semester organization

### Student Portal Features

1. **Resource Discovery**:
   - Advanced filtering (category, subject, semester, type)
   - Search functionality
   - Pagination
   - Responsive grid layout

2. **Download System**:
   - Direct file downloads
   - Download tracking
   - File metadata display
   - Mobile-friendly interface

## 🚀 Production Deployment

### Environment Configuration
```env
# Production environment variables
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="strong-random-secret"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="another-strong-secret"
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

### Self-hosted Deployment
```bash
# Build the application
pnpm build

# Start production server
pnpm start

# Or use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

## 📊 Feature Roadmap

### Phase 1 (Current MVP)
- ✅ User authentication
- ✅ Resource upload/download
- ✅ Admin dashboard
- ✅ Basic filtering

### Phase 2 (Future Enhancements)
- [ ] Advanced search with Elasticsearch
- [ ] User profiles and favorites
- [ ] Resource ratings and reviews
- [ ] Email notifications
- [ ] Advanced analytics

### Phase 3 (Advanced Features)
- [ ] Real-time chat/discussions
- [ ] Mobile app (React Native)
- [ ] AI-powered content recommendations
- [ ] Integration with VTU official APIs

## 🔒 Security Considerations

### Current Implementation
- ✅ JWT with HTTP-only cookies
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Zod)
- ✅ File type validation
- ✅ Protected API routes

### Additional Security (Recommended)
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] File virus scanning
- [ ] Content Security Policy (CSP)
- [ ] Audit logging

## 📈 Performance Optimizations

### Current Optimizations
- ✅ Next.js App Router
- ✅ Static generation where possible
- ✅ Image optimization
- ✅ Component-based architecture

### Future Optimizations
- [ ] Database query optimization
- [ ] Redis caching
- [ ] CDN for file serving
- [ ] Image compression
- [ ] Lazy loading

## 🧪 Testing Strategy

### Unit Tests
```bash
# Add testing dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
pnpm test
```

### Integration Tests
```bash
# API testing
pnpm add -D supertest

# Database testing
pnpm add -D @testcontainers/postgresql
```

### E2E Tests
```bash
# Playwright setup
pnpm add -D @playwright/test
pnpm exec playwright install
```

## 📞 Support & Maintenance

### Monitoring
- Application performance monitoring
- Error tracking (Sentry)
- Database monitoring
- User analytics

### Backup Strategy
- Daily database backups
- File storage backups
- Configuration backups
- Disaster recovery plan

### Updates & Maintenance
- Regular dependency updates
- Security patches
- Performance monitoring
- User feedback integration

---

This MVP provides a solid foundation for a VTU University resources platform with room for future enhancements and scalability.
