# MCQ Home Page Preview Feature

## Overview
This feature allows admins to select MCQ sets to display on the home page with custom banner images, creating a dynamic and engaging landing page experience.

## Features Implemented

### 1. Database Schema Updates
- **New Fields in MCQSet Model:**
  - `showInHomePreview` (Boolean): Toggle to show/hide MCQ set on home page
  - `bannerImage` (String?): URL to custom banner image for home page display

- **Migration:** `20251012055042_add_mcq_home_preview_fields`

### 2. Admin Dashboard - MCQ Set Manager
Located: `src/components/admin/MCQSetManager.tsx`

**New Functionality:**
- **Home Preview Toggle Button**: Shows "Shown" (blue) or "Hidden" (gray) status
- **Banner Upload Button**: Shows "Upload" or "Change" based on existing banner
- **Image Upload Modal**: 
  - Drag-and-drop interface
  - File validation (images only, max 5MB)
  - Recommended size: 1200x600px
  - Auto-deletes old banner when uploading new one

**Usage:**
1. Navigate to Admin Dashboard → MCQ Sets
2. Find your MCQ set in the table
3. Toggle "Home Preview" to show on landing page
4. Click "Upload" to add a banner image
5. MCQ set will appear on home page with custom banner

### 3. API Endpoints

#### Banner Upload: `/api/admin/mcq/sets/[id]/banner`
- **POST**: Upload banner image to R2 storage
  - Validates image file (max 5MB)
  - Stores in R2 bucket under `mcq-banners/` folder
  - Updates MCQ set with public URL
  - Auto-deletes previous banner if exists
  
- **DELETE**: Remove banner image
  - Deletes from R2 storage
  - Updates database to null

#### MCQ Sets Toggle: `/api/admin/mcq/sets/[id]`
- **PATCH**: Update individual fields
  - Used for toggling `showInHomePreview`
  - Supports partial updates

#### Public API: `/api/mcq/sets`
- **New Query Parameter**: `?showInHomePreview=true`
  - Filters only MCQ sets marked for home display
  - Only returns ACTIVE status sets
  - Includes banner image URLs

### 4. Home Page Integration
Located: `src/components/Layout375.tsx`

**Dynamic Loading:**
- Fetches MCQ sets with `showInHomePreview=true` on component mount
- Displays up to 5 sets:
  - First 4 sets: Small cards in grid layout
  - 5th set: Large featured card (or reuses 1st set)
- Falls back to default hardcoded data if:
  - No sets marked for preview
  - API fetch fails
  - Still loading

**Auto-displays:**
- Set title, description, category
- Custom banner image (or default `/quiz1.jpg`)
- Clickable cards navigate to `/quiz` page

### 5. MCQ Set Creation Form
Located: `src/app/admin/mcq/sets/new/page.tsx`

**New Field:**
- Checkbox: "Show in Home Page Preview"
- Helper text about uploading banner after creation
- Default: unchecked (false)

**Workflow:**
1. Create MCQ set with basic info
2. Check "Show in Home Page Preview" if desired
3. Save the set
4. Return to MCQ Sets management page
5. Upload banner image for the set
6. Set will appear on home page

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/mcq/sets/[id]/
│   │   │   ├── banner/route.ts          # Banner upload API
│   │   │   └── route.ts                 # Added PATCH method
│   │   └── mcq/sets/route.ts            # Added preview filter
│   └── admin/mcq/sets/new/page.tsx      # Added preview checkbox
├── components/
│   ├── admin/MCQSetManager.tsx          # Added toggle & upload UI
│   └── Layout375.tsx                     # Dynamic MCQ loading
└── prisma/schema.prisma                  # Updated MCQSet model
```

## Usage Guide for Admins

### Step 1: Create MCQ Set
1. Go to Admin Dashboard → MCQ Management
2. Click "Create New Set"
3. Fill in title, description, questions, etc.
4. Check "Show in Home Page Preview" (optional)
5. Save the set

### Step 2: Upload Banner Image
1. Go to MCQ Sets tab in admin dashboard
2. Find your MCQ set in the table
3. Click the "Upload" button in the "Home Preview" column
4. Select an image (JPG, PNG, WebP - max 5MB)
5. Recommended size: 1200x600px for best display
6. Banner uploads instantly

### Step 3: Toggle Home Preview
- Click the toggle button to show "Shown" (blue) or "Hidden" (gray)
- Only active sets with banners will display well on home page
- You can toggle on/off anytime without losing the banner

### Step 4: Verify on Home Page
1. Visit the main landing page
2. Scroll to "Master MCQ Tests" section
3. Your MCQ set should appear with custom banner
4. Click to test navigation to quiz page

## Technical Details

### Storage
- **R2 Bucket**: Cloudflare R2 storage
- **Path**: `mcq-banners/{timestamp}-{randomId}-{filename}`
- **Public Access**: Images served via R2 public URL
- **Max Size**: 5MB per image
- **Formats**: JPEG, PNG, GIF, WebP

### Security
- Admin authentication required via `verifyAdminToken()`
- Only admins can upload banners and toggle preview
- File type validation on both client and server
- File size limits enforced

### Performance
- Banner images cached by browser
- Lazy loading on home page
- Fallback to defaults if API slow/fails
- No home page blocking during fetch

## Database Schema

```prisma
model MCQSet {
  id          String   @id @default(cuid())
  title       String
  description String
  // ... other fields
  featured    Boolean  @default(false)
  showInHomePreview Boolean @default(false)  // NEW
  bannerImage String?                         // NEW
  status      MCQStatus @default(DRAFT)
  // ... relations
}
```

## API Examples

### Get Preview MCQ Sets
```bash
GET /api/mcq/sets?showInHomePreview=true
```

Response:
```json
[
  {
    "id": "clx123abc",
    "title": "Data Structures & Algorithms",
    "description": "Master fundamental DSA concepts",
    "category": "Technical",
    "difficulty": "INTERMEDIATE",
    "showInHomePreview": true,
    "bannerImage": "https://pub-xxx.r2.dev/mcq-banners/1728...jpg",
    "questions": 25,
    "attempts": 150,
    "averageScore": 78
  }
]
```

### Upload Banner
```bash
POST /api/admin/mcq/sets/{id}/banner
Content-Type: multipart/form-data

banner: <image-file>
```

### Toggle Preview
```bash
PATCH /api/admin/mcq/sets/{id}
Content-Type: application/json

{
  "showInHomePreview": true
}
```

## Future Enhancements
- Drag-and-drop ordering of home page MCQ sets
- Multiple banner sizes for responsive display
- A/B testing different banners
- Analytics on MCQ set click-through rates
- Preview mode before publishing to home page
- Bulk banner upload tool
- Image cropping/editing in admin panel

## Troubleshooting

### Banner not showing on home page
1. Check if `showInHomePreview` is toggled ON
2. Verify MCQ set status is ACTIVE
3. Confirm banner image uploaded successfully
4. Check browser console for fetch errors
5. Clear browser cache and reload

### Upload fails
1. Check file size (<5MB)
2. Verify file is image format
3. Check R2 credentials in `.env`
4. Review server logs for errors

### TypeScript errors after schema change
1. Run `npx prisma generate`
2. Run `npx prisma db push`
3. Restart TypeScript server in VS Code
4. Restart dev server

## Notes
- Maximum 5 MCQ sets displayed on home page
- Featured sets take priority in big card slot
- Banner images auto-optimize via R2
- Old banners auto-deleted on new upload
- Default images used as fallback
