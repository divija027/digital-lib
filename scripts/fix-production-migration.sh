#!/bin/bash

# Production Database Migration Fix Script
# This script fixes the site_settings migration issue

set -e  # Exit on error

echo "=========================================="
echo "Production Database Migration Fix"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database name
DB_NAME="vtu_resources"

# Step 1: Create backup
echo -e "${YELLOW}Step 1: Creating database backup...${NC}"
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
if sudo -u postgres pg_dump "$DB_NAME" > "$BACKUP_FILE"; then
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi
echo ""

# Step 2: Check current migration status
echo -e "${YELLOW}Step 2: Checking current migration status...${NC}"
npx prisma migrate status || true
echo ""

# Step 3: Mark failed migration as rolled back
echo -e "${YELLOW}Step 3: Marking failed migration as rolled back...${NC}"
if npx prisma migrate resolve --rolled-back 20251012131645_add_public_url_to_pdf; then
    echo -e "${GREEN}✓ Migration marked as rolled back${NC}"
else
    echo -e "${YELLOW}Note: Migration might not be in failed state${NC}"
fi
echo ""

# Step 4: Apply migrations
echo -e "${YELLOW}Step 4: Applying migrations with fixed SQL...${NC}"
if npx prisma migrate deploy; then
    echo -e "${GREEN}✓ Migrations applied successfully${NC}"
else
    echo -e "${RED}✗ Migration failed!${NC}"
    echo -e "${YELLOW}Attempting manual fix...${NC}"
    
    # Manual fix
    echo "Applying manual SQL fix..."
    sudo -u postgres psql "$DB_NAME" << EOF
-- Add publicUrl column if it doesn't exist
ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS "publicUrl" TEXT;

-- Drop site_settings table if it exists
DROP TABLE IF EXISTS site_settings;
EOF
    
    # Mark as applied
    echo "Marking migration as applied..."
    npx prisma migrate resolve --applied 20251012131645_add_public_url_to_pdf
    
    echo -e "${GREEN}✓ Manual fix applied${NC}"
fi
echo ""

# Step 5: Verify migration status
echo -e "${YELLOW}Step 5: Verifying migration status...${NC}"
npx prisma migrate status
echo ""

# Step 6: Verify database schema
echo -e "${YELLOW}Step 6: Verifying publicUrl column exists...${NC}"
if sudo -u postgres psql "$DB_NAME" -c "\d pdfs" | grep -q "publicUrl"; then
    echo -e "${GREEN}✓ publicUrl column exists${NC}"
else
    echo -e "${RED}✗ publicUrl column not found${NC}"
    exit 1
fi
echo ""

# Step 7: Generate Prisma Client
echo -e "${YELLOW}Step 7: Generating Prisma Client...${NC}"
if npx prisma generate; then
    echo -e "${GREEN}✓ Prisma Client generated${NC}"
else
    echo -e "${RED}✗ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}Migration Fix Complete!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Backup created: $BACKUP_FILE"
echo "  - Migration status: Fixed"
echo "  - publicUrl column: Added"
echo "  - site_settings table: Removed (if existed)"
echo ""
echo "Next steps:"
echo "  1. Test your application"
echo "  2. Restart your app server (pm2/systemctl)"
echo "  3. Keep backup for 24-48 hours"
echo ""
echo -e "${YELLOW}To rollback if needed:${NC}"
echo "  sudo -u postgres psql $DB_NAME < $BACKUP_FILE"
echo ""
