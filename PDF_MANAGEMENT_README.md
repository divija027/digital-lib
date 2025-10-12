# PDF Management System

## Overview
A complete PDF upload and management system for BrainReef admin panel that stores PDFs in Cloudflare R2 and manages metadata in PostgreSQL.

## ✅ Implementation Status

### Completed
- ✅ Database schema updated (`prisma/schema.prisma`)
- ✅ API routes created (`/api/admin/pdfs/`, `/api/pdfs/`)
- ✅ Admin components created (`PDFUpload`, `PDFList`)
- ✅ Admin page created (`/admin/pdfs`)
- ✅ Navigation added to admin sidebar

### Pending
- ⏳ Database migration (see Setup Instructions below)
- ⏳ Test upload functionality
- ⏳ Integrate with dashboard

## Architecture

### Database Schema
- **PDF Model**: Stores metadata with unique `r2Key` as the identifier
  - `r2Key`: Unique ID for R2 storage (no directories, just `{uniqueId}.pdf`)
  - `branch`, `semester`, `subjectId`: Organization fields
  - `views`, `downloads`: Analytics tracking
  - `featured`: Highlight important resources

### R2 Storage
- PDFs stored with unique IDs only (e.g., `abc123xyz.pdf`)
- No directory structure in R2
- Each PDF gets a 16-character unique nanoid

## Setup Instructions

### 1. Fix Prisma Permissions (If Needed)
If you encounter permission errors:
```bash
cd /home/hx0r/adigaprojv1/digital-lib
sudo chown -R $USER:$USER node_modules
```

### 2. Run Database Migration
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### Alternative: Use Prisma Migrate
```bash
# Create and apply migration
pnpm db:migrate
# When prompted, enter migration name: "add_pdf_model"
```

### 2. Verify R2 Configuration
Ensure these environment variables are set in `.env`:
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_ENDPOINT`
- `R2_PUBLIC_URL`

### 3. Access Admin Panel
1. Start the development server: `pnpm dev --turbopack`
2. Login as admin
3. Navigate to: `/admin/pdfs`
4. You should see:
   - PDF Upload form on the left
   - PDF List table on the right

### 4. Verify Navigation
The admin sidebar now includes:
```
📁 PDF Management
   ├── Upload PDF
   └── All PDFs
```

## API Endpoints

### Admin Endpoints (Protected)
- `POST /api/admin/pdfs` - Upload PDF
- `GET /api/admin/pdfs` - List all PDFs (with filters)
- `GET /api/admin/pdfs/[id]` - Get PDF details + download URL
- `PATCH /api/admin/pdfs/[id]` - Update PDF metadata
- `DELETE /api/admin/pdfs/[id]` - Delete PDF (from both R2 and DB)

### Student Endpoints (Public)
- `GET /api/pdfs?branch=CS&semester=3&subjectId=xxx` - Get PDFs for dashboard

## Components

### Admin Components
1. **PDFUpload** (`/components/admin/PDFUpload.tsx`)
   - File upload with validation
   - Branch/semester/subject selection
   - Progress indicator
   - 25MB file size limit

2. **PDFList** (`/components/admin/PDFList.tsx`)
   - Table view of all PDFs
   - Delete functionality
   - View analytics (views, downloads)

### Admin Page
- `/app/admin/pdfs/page.tsx` - Main PDF management page

## Features

### Upload Features
- ✅ PDF-only validation
- ✅ 25MB size limit
- ✅ Unique R2 key generation (no directories)
- ✅ Automatic title from filename
- ✅ Branch/semester/subject organization
- ✅ Featured flag
- ✅ Progress indicator

### Management Features
- ✅ List all PDFs with filters
- ✅ Delete PDFs (removes from both R2 and DB)
- ✅ View analytics
- ✅ Presigned download URLs (1-hour expiry)

### Dashboard Integration
- ✅ Fetch PDFs by branch/semester/subject
- ✅ Automatic download URL generation
- ✅ Featured PDFs prioritized

## Database Fields

```prisma
model PDF {
  id          String   // Auto-generated CUID
  title       String   // Display name
  description String?  // Optional description
  fileName    String   // Original filename
  fileSize    Int      // Size in bytes
  r2Key       String   // Unique R2 identifier (e.g., "abc123xyz.pdf")
  branch      String   // Branch code (CS, EC, ME, etc.)
  semester    Int      // Semester number (1-8)
  subjectId   String   // Foreign key to Subject
  uploadedBy  String   // Admin user ID
  downloads   Int      // Download count
  views       Int      // View count
  featured    Boolean  // Featured flag
  createdAt   DateTime
  updatedAt   DateTime
}
```

## Usage Flow

### Admin Upload Flow
1. Admin navigates to `/admin/pdfs`
2. Selects PDF file (max 25MB)
3. Fills in title, description
4. Selects branch, semester, subject
5. Optionally marks as featured
6. Clicks "Upload PDF"
7. System generates unique R2 key
8. Uploads to R2
9. Saves metadata to database
10. Returns success

### Student Access Flow
1. Student navigates to dashboard
2. Selects branch/semester/subject
3. API fetches PDFs from database using filters
4. Generates presigned download URLs
5. Student can view/download PDFs
6. System tracks views and downloads

## Security
- ✅ Admin-only upload access (RBAC check)
- ✅ Presigned URLs (1-hour expiry)
- ✅ File type validation
- ✅ Size limit enforcement
- ✅ Unique keys prevent collisions

## Next Steps
1. Run migrations to create PDF table
2. Test upload functionality
3. Integrate PDF list into dashboard
4. Add search/filter functionality
5. Add bulk upload support
6. Add PDF preview functionality
