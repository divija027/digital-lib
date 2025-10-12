# MCQ Home Page Layout Manager

## Overview
A visual drag-and-drop style interface for managing which MCQ sets appear on the home page and in what positions. Admins can click on blank slots to assign MCQ sets and upload custom banner images directly from the layout manager.

## Key Features

### 1. Visual 5-Slot Layout
- **Positions 1-4**: Small cards displayed in a grid (4 columns)
- **Position 5**: Large featured card (spans 2 columns x 2 rows)
- Click-to-assign interface for easy management
- Live preview of how cards will appear on home page

### 2. Position-Based Display
- Each MCQ set can be assigned to exactly one position (1-5)
- `homePreviewPosition` field in database tracks slot assignments
- Unique constraint ensures no two sets occupy the same position
- Home page fetches and displays sets ordered by position

### 3. Integrated Banner Upload
- Upload banner images directly from the layout manager
- Each slot shows banner upload button when MCQ set is assigned
- Recommended image size: 1200x600px (max 5MB)
- Supports JPG, PNG, WebP formats

### 4. Real-Time Updates
- Changes apply immediately without page refresh
- Automatic re-fetching of layout data after updates
- Visual feedback with loading states

## Database Schema

```prisma
model MCQSet {
  // ... existing fields
  showInHomePreview   Boolean @default(false)
  homePreviewPosition Int?    @unique  // 1-5, unique per position
  bannerImage         String? // URL to banner image
  // ... rest of fields
}
```

## File Structure

```
src/
├── app/
│   ├── admin/mcq/
│   │   ├── layout/
│   │   │   └── page.tsx              # Layout Manager UI
│   │   └── page.tsx                  # Added quick action link
│   └── api/admin/mcq/
│       └── layout/
│           └── route.ts               # Layout management API
├── components/
│   └── Layout375.tsx                  # Updated to use positions
└── prisma/
    └── schema.prisma                  # Added homePreviewPosition field
```

## Usage Guide

### Accessing the Layout Manager

1. **From Admin Dashboard**:
   - Go to Admin Dashboard → MCQ Management
   - Click "Home Page Layout" in Quick Actions

2. **Direct URL**:
   - Navigate to `/admin/mcq/layout`

### Assigning MCQ Sets to Slots

1. **Click Empty Slot**:
   - Click any empty slot (1-5)
   - Modal opens showing all active MCQ sets

2. **Select MCQ Set**:
   - Browse available sets
   - Sets already assigned show "Already Assigned" badge
   - Click desired MCQ set to assign
   - Assignment happens immediately

3. **Upload Banner**:
   - Click "Upload" button on assigned slot
   - Select image file (JPG, PNG, WebP)
   - Image uploads and displays instantly

4. **Remove from Slot**:
   - Click X button on any assigned slot
   - Set is removed and slot becomes available
   - MCQ set remains in database, just not on home page

### Understanding the Layout

#### Small Cards (Positions 1-4)
```
┌─────────┬─────────┬─────────┬─────────┐
│ Slot 1  │ Slot 2  │ Slot 3  │ Slot 4  │
│ Small   │ Small   │ Small   │ Small   │
└─────────┴─────────┴─────────┴─────────┘
```

**Best for**:
- Quick topic tests
- Practice sets
- Focused subject quizzes
- Popular categories

#### Big Card (Position 5)
```
┌─────────┬─────────┬─────────┬───────────────┐
│ Slot 1  │ Slot 2  │ Slot 3  │               │
│         │         │         │    Slot 5     │
├─────────┼─────────┼─────────┤    (Big)      │
│ Slot 4  │         │         │               │
│         │         │         │               │
└─────────┴─────────┴─────────┴───────────────┘
```

**Best for**:
- Featured assessments
- Comprehensive tests
- Placement prep packages
- Special announcements

## API Endpoints

### GET /api/admin/mcq/layout
**Purpose**: Fetch current layout configuration

**Response**:
```json
{
  "layout": [
    {
      "position": 1,
      "type": "small",
      "mcqSet": {
        "id": "...",
        "title": "Data Structures",
        "description": "...",
        "category": "Technical",
        "difficulty": "INTERMEDIATE",
        "bannerImage": "https://...",
        "questions": 25,
        "attempts": 150,
        "averageScore": 78
      }
    },
    // ... positions 2-5
  ]
}
```

### POST /api/admin/mcq/layout
**Purpose**: Assign MCQ set to a position

**Request Body**:
```json
{
  "mcqSetId": "clx123abc",
  "position": 1
}
```

**Behavior**:
- If position is occupied, existing set is removed first
- If set is already in another position, it's moved
- Automatically sets `showInHomePreview = true`
- Returns updated MCQ set

### DELETE /api/admin/mcq/layout?position=1
**Purpose**: Remove MCQ set from a position

**Parameters**:
- `position` (query): Position number (1-5)

**Response**:
```json
{
  "success": true,
  "message": "MCQ set removed from position successfully"
}
```

## Home Page Integration

### Layout375 Component Changes

**Before** (Old Approach):
- Fetched all sets with `showInHomePreview=true`
- No guaranteed order
- First 4 became small cards, 5th became big card

**After** (New Approach):
- Fetches sets ordered by `homePreviewPosition`
- Exact control over which set appears where
- Position-based mapping to card types

### Fetch Request
```javascript
fetch('/api/mcq/sets?showInHomePreview=true&orderBy=homePreviewPosition')
```

### Display Logic
```javascript
// Position 1-4 → Small cards
const cardsSmall = orderedSets.slice(0, 4)

// Position 5 → Big card
const cardBig = orderedSets[4] || orderedSets[0]
```

## Admin Workflow Example

### Scenario: Setting up home page for semester start

1. **Create MCQ Sets**:
   ```
   - Create "Data Structures Basics" set with 30 questions
   - Create "OOP Fundamentals" set with 25 questions
   - Create "DBMS Essentials" set with 35 questions
   - Create "OS Concepts" set with 28 questions
   - Create "Full Stack Bootcamp" featured set with 100 questions
   ```

2. **Access Layout Manager**:
   - Admin Dashboard → MCQ Management → Home Page Layout

3. **Assign to Slots**:
   - **Slot 1**: Assign "Data Structures Basics"
   - **Slot 2**: Assign "OOP Fundamentals"
   - **Slot 3**: Assign "DBMS Essentials"
   - **Slot 4**: Assign "OS Concepts"
   - **Slot 5**: Assign "Full Stack Bootcamp" (featured)

4. **Upload Banners**:
   - Click upload button on each slot
   - Upload relevant banner images
   - Preview immediately visible

5. **Preview Results**:
   - Click "Preview Home Page" button
   - View actual home page
   - Verify layout and images

## Benefits Over Previous System

### Old System (MCQSetManager Toggle)
❌ No control over order/position
❌ Banner upload separate from layout
❌ No visual preview of home page
❌ Difficult to manage multiple sets
❌ No way to see final layout before publish

### New System (Layout Manager)
✅ Exact position control (1-5)
✅ Integrated banner upload
✅ Visual preview of layout
✅ Easy drag-and-drop style UX
✅ See final result before users do
✅ Quick swap/rearrange functionality

## Tips & Best Practices

### Banner Images
- **Size**: 1200x600px for best results
- **Format**: WebP for smaller file sizes
- **Content**: High contrast text, clear visuals
- **Small cards**: Focus on icon/logo in center
- **Big card**: Can include more detailed graphics

### Position Strategy
- **Position 1**: Most popular/trending topic
- **Position 2**: Beginner-friendly content
- **Position 3**: Intermediate difficulty
- **Position 4**: Advanced challenges
- **Position 5**: Featured assessment or special event

### Seasonal Updates
- Update positions monthly for fresh content
- Rotate featured (Position 5) every 2 weeks
- Keep high-performing sets in positions 1-2
- Test new content in positions 3-4 first

### Content Curation
- Ensure all 5 positions are filled
- Balance difficulty levels across positions
- Include variety of categories
- Update banner images seasonally
- Monitor click-through rates

## Troubleshooting

### Set not appearing on home page
**Check**:
1. Is set status ACTIVE?
2. Is position assigned (1-5)?
3. Does set have banner image?
4. Clear browser cache
5. Check console for API errors

### Position already occupied error
**Solution**: The layout manager automatically removes existing sets when assigning new ones. This shouldn't happen, but if it does:
1. Refresh the page
2. Try removing the slot first
3. Then assign new set

### Banner upload fails
**Common causes**:
1. File size > 5MB
2. Not an image file
3. R2 credentials misconfigured
4. Network timeout

**Fix**:
- Compress image
- Convert to WebP format
- Check `.env` R2 settings
- Retry upload

### TypeScript errors after migration
**Solution**:
```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
# TypeScript will pick up new types
```

## Future Enhancements

- [ ] True drag-and-drop between slots
- [ ] A/B testing for different layouts
- [ ] Analytics on position performance
- [ ] Scheduled position changes
- [ ] Preview mode before publishing
- [ ] Mobile layout preview
- [ ] Bulk banner upload tool
- [ ] Position history/rollback
- [ ] Clone layout configurations
- [ ] Multi-language banner support

## Notes

- Maximum 5 MCQ sets on home page (by design)
- Each position can only have one set
- Removing from layout doesn't delete the set
- Banner images stored in R2 under `mcq-banners/`
- Old banners auto-deleted when uploading new ones
- Position changes apply immediately (no publish button needed)
