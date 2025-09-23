# Email Authentication System Documentation

## Overview
This document describes the refactored email authentication system for the VTU Digital Library. The system handles email verification during registration and password reset functionality.

## Architecture

### Core Components

#### 1. Email Service (`src/lib/email.ts`)
- **Purpose**: Handles SMTP configuration and email sending
- **Key Features**:
  - Zoho SMTP integration
  - Professional HTML email templates
  - Type-safe email configuration
  - Automatic error handling and logging

#### 2. Auth Tokens Service (`src/lib/auth-tokens.ts`)
- **Purpose**: Manages authentication tokens and database operations
- **Key Features**:
  - Token generation with configurable expiry
  - User lookup by tokens
  - Database operations for token management
  - Type-safe token operations

#### 3. API Endpoints (`src/app/api/auth/`)
- **Purpose**: REST API endpoints for authentication operations
- **Endpoints**:
  - `POST /api/auth/register` - User registration with email verification
  - `GET/POST /api/auth/verify-email` - Email verification
  - `POST /api/auth/forgot-password` - Password reset request
  - `POST /api/auth/reset-password` - Password reset with token
  - `POST /api/auth/resend-verification` - Resend verification email

## Configuration

### Environment Variables
```env
# Email Configuration (Zoho SMTP)
EMAIL_USER="no-reply@brainreef.in"
EMAIL_PASSWORD="your_zoho_app_password"
EMAIL_FROM="no-reply@brainreef.in"

# Application URL
NEXTAUTH_URL="http://localhost:3000"
```

### Token Expiry Settings
- **Email Verification**: 24 hours
- **Password Reset**: 1 hour

## API Reference

### Registration
```typescript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "collegeName": "Example College"
}
```

### Email Verification
```typescript
GET /api/auth/verify-email?token=verification_token
// Redirects to login page with status

POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token"
}
```

### Password Reset Request
```typescript
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Password Reset
```typescript
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "new_password"
}
```

## Security Features

1. **Email Enumeration Prevention**: Always return success responses for forgot password and resend verification
2. **Token Expiry**: All tokens have configurable expiry times
3. **Secure Token Generation**: Uses crypto.randomBytes for token generation
4. **Password Hashing**: bcrypt with salt rounds of 12
5. **Input Validation**: Zod schemas for all API inputs

## Error Handling

The system implements comprehensive error handling:
- Validation errors return 400 with specific field errors
- Authentication failures are logged but return generic messages
- SMTP errors are logged and return appropriate error responses
- Database errors are caught and return 500 status codes

## Email Templates

Professional HTML email templates with:
- Responsive design
- Brand consistency
- Clear call-to-action buttons
- Fallback links for accessibility
- Security information and expiry details

## Development Features

- Debug logging in development environment
- SMTP connection verification
- Detailed error logging
- TypeScript type safety throughout

## Usage Examples

### Sending Verification Email
```typescript
import { sendVerificationEmail } from '@/lib/email'
import { setVerificationToken } from '@/lib/auth-tokens'

const tokenData = await setVerificationToken(userId)
const result = await sendVerificationEmail(email, name, tokenData.token)
```

### Verifying Email
```typescript
import { findUserByVerificationToken, verifyUserEmail } from '@/lib/auth-tokens'

const user = await findUserByVerificationToken(token)
if (user) {
  await verifyUserEmail(user.id)
}
```

## Testing

The system can be tested using:
1. User registration flow
2. Email verification links
3. Password reset flow
4. Token expiry scenarios
5. Error conditions

## Maintenance

### Regular Tasks
- Monitor email delivery rates
- Check SMTP credentials validity
- Review token expiry settings
- Update email templates as needed

### Monitoring
- Email send success/failure rates
- Token usage patterns
- User verification completion rates
- SMTP connection health

## Future Enhancements

Potential improvements:
1. Email delivery status tracking
2. Multiple email providers fallback
3. Email rate limiting
4. Custom email templates per college
5. Bulk email operations for admin