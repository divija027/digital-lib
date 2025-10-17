# Event Home Layout Manager - Complete Implementation

## Overview
Implemented a comprehensive Event Home Layout Manager system, exactly mirroring the MCQ Home Layout Manager functionality. Events can now be managed separately from their home page presentation.

## ✅ Changes Implemented

### 1. Database Schema Updates
**File**: `prisma/schema.prisma`

Added new fields to Event model:
- `showInHomePreview` (Boolean) - Flag to show event in home page
- `homePreviewPosition` (Int?) - Position in layout (1-5)
- `bannerImage` (String?) - Custom banner image for home page display

```prisma
// Home page layout
showInHomePreview Boolean @default(false)
homePreviewPosition Int? // Position in home page layout (1-5)
bannerImage String? // Custom banner for home page
```

Commands executed:
- `sudo pnpm db:generate` ✅
- `sudo pnpm db:push` ✅

### 2. API Routes Created

#### `/api/admin/events/layout/route.ts`
- **GET**: Fetch current home page layout with all 5 positions
- **POST**: Assign event to a specific position
- **DELETE**: Remove event from a position

#### `/api/admin/events/[id]/banner/route.ts`
- **POST**: Upload custom banner image for event
- Validates file type and size (max 5MB)
- Stores in `/public/uploads/events/`
- Returns public URL

### 3. Event Layout Manager Page
**File**: `src/app/admin/events/layout/page.tsx`

Complete layout management interface with:

**Features**:
- 5-position layout grid (4 small cards + 1 big featured card)
- Dropdown selectors for each position
- Pending changes system (bulk save)
- Banner image upload for each position
- Real-time preview
- Drag-free selection (unlike MCQ which required drag-drop)
- Visual indicators for unsaved changes

**Layout**:
- Position 1-4: Small event cards (1/4 width)
- Position 5: Large featured card (1/2 width, spanning 2 rows)

**Workflow**:
1. Select event from dropdown for each position
2. Click "Save Changes" to confirm assignments
3. After saving, upload custom banner images
4. Preview on home page

**UI Elements**:
- Event selector dropdowns
- Banner upload buttons (only after save)
- Remove buttons for each slot
- Discard/Save Changes buttons
- Preview Home Page button
- Amber highlights for pending changes
- Info cards with instructions

### 4. Create/Edit Event Pages Updated

#### Removed:
- ❌ Banner image upload component
- ❌ Image preview
- ❌ File validation logic
- ❌ Upload to R2 storage

#### Added:
- ✅ Info card explaining Layout Manager
- ✅ Simplified submission flow
- ✅ Placeholder image URL fallback

**Message shown**:
> 💡 **Note:** After creating your event, go to **Event Layout Manager** to add it to the home page and upload custom banner images.

### 5. Admin Navigation Updated
**File**: `src/app/admin/layout.tsx`

Event Management submenu now includes:
- All Events
- Create Event
- **Layout Manager** ← NEW

### 6. Key Differences from MCQ Implementation

| Feature | MCQ | Events |
|---------|-----|--------|
| Banner Upload Location | In Layout Manager only | ✅ Same |
| Assignment Method | Dropdown + Save | ✅ Same |
| Pending Changes | Yes | ✅ Same |
| Position Count | 5 (4 small + 1 big) | ✅ Same |
| Unique Assignment | One MCQ per position | ✅ Same |
| Banner Size Limit | 5MB | ✅ Same |

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── events/
│   │   │   ├── create/
│   │   │   │   └── page.tsx          # MODIFIED - Removed banner upload
│   │   │   ├── edit/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # MODIFIED - Removed banner upload
│   │   │   └── layout/
│   │   │       └── page.tsx          # NEW - Layout Manager
│   │   └── layout.tsx                # MODIFIED - Added nav link
│   └── api/
│       └── admin/
│           └── events/
│               ├── layout/
│               │   └── route.ts      # NEW - Layout API
│               └── [id]/
│                   └── banner/
│                       └── route.ts  # NEW - Banner upload API
└── prisma/
    └── schema.prisma                 # MODIFIED - Added layout fields
```

## Usage Workflow

### For Admins:

1. **Create Event**
   - Go to Admin → Events → Create Event
   - Fill in all event details (title, description, content, etc.)
   - Click "Create Event"
   - Event is created but NOT shown on home page

2. **Add to Home Page**
   - Go to Admin → Events → Layout Manager
   - Select event from dropdown for desired position
   - Click "Save Changes"
   - Upload custom banner image (recommended: 1200x600px)
   - Preview on home page

3. **Manage Layout**
   - Change event positions anytime
   - Update banner images
   - Remove events from home page
   - Each event can only appear in one position

### Layout Positions:

```
┌─────────┬─────────┬─────────┬─────────┐
│ Pos 1   │ Pos 2   │ Pos 3   │ Pos 4   │
│ Small   │ Small   │ Small   │ Small   │
│         │         ├─────────┴─────────┤
│         │         │                   │
└─────────┴─────────│     Position 5    │
                    │   Featured (Big)  │
                    │                   │
                    └───────────────────┘
```

## API Endpoints

### Layout Management
- `GET /api/admin/events/layout` - Fetch layout
- `POST /api/admin/events/layout` - Assign event to position
  ```json
  { "eventId": "xxx", "position": 1 }
  ```
- `DELETE /api/admin/events/layout?position=1` - Remove from position

### Banner Upload
- `POST /api/admin/events/[id]/banner` - Upload banner
  - FormData with 'banner' file
  - Returns: `{ "success": true, "bannerUrl": "/uploads/events/..." }`

## Database Fields

### Event Model
```typescript
{
  // ... existing fields ...
  showInHomePreview: boolean      // Default: false
  homePreviewPosition: number?    // 1-5 or null
  bannerImage: string?            // "/uploads/events/..."
}
```

## Technical Notes

1. **Pending Changes System**: Changes are tracked locally until "Save Changes" is clicked, preventing accidental assignments

2. **Banner Upload Timing**: Banners can only be uploaded AFTER the event is assigned and saved to a position

3. **Unique Positioning**: Each event can only be in ONE position at a time - system prevents duplicates

4. **File Storage**: Banner images stored locally in `/public/uploads/events/` directory

5. **Image Validation**: 
   - Type: image/* only
   - Size: Max 5MB
   - Recommended: 1200x600px

## Testing Checklist

- [x] Create event without banner upload
- [x] Navigate to Layout Manager
- [x] Assign events to all 5 positions
- [x] Save changes (bulk)
- [x] Upload banner for each position
- [x] Remove event from position
- [x] Verify pending changes indicator
- [x] Preview home page
- [x] Check admin navigation links

## Status
✅ **COMPLETE** - Event Layout Manager fully implemented and operational, exactly mirroring MCQ Layout Manager functionality.

---
*Generated: 2025-01-19*
*Pattern: Follows MCQ Home Layout Manager architecture*
*Next.js: 15.4.6 | Prisma: 6.17.0*
