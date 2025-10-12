# Quick Start: PDF Management

## What's Been Added

### 1. Admin Navigation
The admin sidebar now has a **"PDF Management"** section:

```
Admin Panel
├── Overview
├── Branch Management
├── PDF Management  ⬅️ NEW!
│   ├── Upload PDF
│   └── All PDFs
├── User Management
├── Blog Management
└── MCQ Management
```

### 2. Admin Page: `/admin/pdfs`
This page contains:
- **Left Side**: PDF Upload Form
  - File selector (PDF only, max 25MB)
  - Title and description fields
  - Branch/semester/subject dropdowns
  - Featured checkbox
  - Upload button with progress bar

- **Right Side**: PDF List Table
  - Shows all uploaded PDFs
  - Columns: Title, Subject, Branch, Semester, Size, Views, Downloads, Date
  - Delete button for each PDF

### 3. How It Works

#### Upload Flow:
1. Admin selects PDF file
2. Fills in title, description
3. Selects branch (CS, EC, ME, etc.)
4. Selects semester (1-8)
5. Selects subject (auto-loaded based on branch/semester)
6. Clicks "Upload PDF"
7. System:
   - Generates unique ID (e.g., `abc123xyz.pdf`)
   - Uploads to R2 with just the ID (no folders!)
   - Saves metadata to database
   - Returns success

#### Student Access:
- Students access PDFs via dashboard
- API: `/api/pdfs?branch=CS&semester=3&subjectId=xxx`
- System generates temporary download URLs (1-hour expiry)
- Tracks views and downloads

### 4. Database Structure

```
PDF Table:
├── id (primary key)
├── title
├── description
├── fileName
├── fileSize
├── r2Key ⬅️ Unique ID (e.g., "abc123xyz.pdf")
├── branch
├── semester
├── subjectId (foreign key to Subject)
├── uploadedBy (admin user ID)
├── downloads (counter)
├── views (counter)
├── featured (boolean)
└── createdAt, updatedAt
```

### 5. R2 Storage
- **No directories/folders!**
- PDFs stored with unique IDs only
- Example: `abc123xyz.pdf`, `def456uvw.pdf`
- Each PDF gets a 16-character nanoid

## Next Steps

1. **Run Migration**:
   ```bash
   pnpm db:generate && pnpm db:push
   ```

2. **Test Upload**:
   - Go to `/admin/pdfs`
   - Upload a test PDF
   - Verify it appears in the list

3. **Integration**:
   - Update dashboard to fetch PDFs using `/api/pdfs`
   - Add download buttons
   - Display PDF list by subject

## Troubleshooting

### Permission Error
```bash
sudo chown -R $USER:$USER node_modules
pnpm db:generate
```

### R2 Connection Error
Check `.env` file has:
- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME
- R2_ENDPOINT
- R2_PUBLIC_URL

### Navigation Not Showing
- Clear browser cache
- Restart dev server
- Check if you're logged in as admin

## File Locations

```
src/
├── app/
│   ├── admin/
│   │   └── pdfs/
│   │       └── page.tsx ⬅️ Main admin page
│   └── api/
│       ├── admin/
│       │   └── pdfs/
│       │       ├── route.ts ⬅️ Upload & list API
│       │       └── [id]/
│       │           └── route.ts ⬅️ Get/update/delete API
│       └── pdfs/
│           └── route.ts ⬅️ Student-facing API
│
├── components/
│   └── admin/
│       ├── PDFUpload.tsx ⬅️ Upload form
│       └── PDFList.tsx ⬅️ PDF table
│
└── lib/
    └── r2-client.ts ⬅️ R2 utilities
```

## Features Summary

✅ PDF-only validation
✅ 25MB size limit
✅ Unique R2 key generation
✅ No directory structure in R2
✅ Presigned URLs for security
✅ View/download tracking
✅ Featured PDFs
✅ Branch/semester/subject filtering
✅ Admin RBAC protection
✅ Progress indicator during upload
