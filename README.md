# VTU University Student Resources Website

A comprehensive MVP for VTU University students to access study resources including question papers, study materials, and previous year papers. Built with Next.js, TypeScript, PostgreSQL, Prisma, and Shadcn UI.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT
- **Student Dashboard**: Browse and download resources with advanced filtering
- **Admin Dashboard**: Upload, manage, and organize content
- **Resource Management**: Categorized resources by subject, semester, and type
- **File Upload/Download**: Secure file handling with size limits
- **Responsive Design**: Modern UI with Tailwind CSS and Shadcn UI components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **File Upload**: Built-in file handling system

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL database running
- pnpm package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd adigaproj
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database:
```sql
CREATE DATABASE vtu_resources;
```

#### Option B: Using Docker
```bash
docker run --name vtu-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vtu_resources -p 5432:5432 -d postgres:15
```

### 4. Environment Configuration
Update `.env` file with your database credentials:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vtu_resources?schema=public"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-here"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

### 5. Database Migration & Seeding
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with initial data
pnpm db:seed
```

### 6. Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🔐 Default Login Credentials

After seeding the database, use these credentials:

**Admin Account:**
- Email: `admin@vtu.ac.in`
- Password: `admin123`

**Student Account:**
- Email: `student@example.com`
- Password: `student123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── categories/    # Category management
│   │   ├── resources/     # Resource management
│   │   └── subjects/      # Subject management
│   ├── dashboard/         # Student dashboard
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # Reusable components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   └── ui/              # Shadcn UI components
└── lib/                 # Utility functions
    ├── auth.ts          # Authentication utilities
    ├── prisma.ts        # Database client
    └── utils.ts         # General utilities
```

## 🗃️ Database Schema

### Users Table
- Authentication data
- Role-based access (STUDENT/ADMIN)
- User profile information

### Resources Table
- File metadata and paths
- Resource categorization
- Download tracking
- Approval status

### Categories & Subjects
- Hierarchical organization
- Semester-wise grouping
- Resource counting

## 🔄 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Create and run migrations
pnpm db:seed          # Seed database with initial data
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database

# Code Quality
pnpm lint             # Run ESLint
```

## 🔒 Authentication Flow

1. **Registration**: Users register with email/password
2. **Login**: JWT token generated and stored in HTTP-only cookie
3. **Authorization**: Middleware validates tokens for protected routes
4. **Role-based Access**: Admin and student roles with different permissions

## 📤 File Upload System

- **Supported Formats**: PDF, DOC, DOCX, PPT, PPTX
- **Size Limit**: 10MB per file
- **Storage**: Local file system (configurable for cloud storage)
- **Security**: File type validation and secure paths

## 🎯 Admin Features

- **Dashboard**: Overview statistics and analytics
- **Resource Upload**: Multi-step form with file validation
- **Content Management**: Edit, delete, and organize resources
- **Category Management**: Create and manage resource categories
- **Subject Management**: Semester-wise subject organization

## 👨‍🎓 Student Features

- **Resource Browser**: Advanced filtering and search
- **Download Tracking**: Monitor download history
- **Category Filtering**: Browse by subject, semester, type
- **Responsive Design**: Mobile-friendly interface

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on git push

### Manual Deployment
```bash
pnpm build
pnpm start
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret key
- `JWT_SECRET`: JWT signing secret
- `UPLOAD_DIR`: File upload directory
- `MAX_FILE_SIZE`: Maximum file size limit

### Customization
- **Styling**: Modify Tailwind CSS configuration
- **Components**: Extend Shadcn UI components
- **Database**: Adjust Prisma schema as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **File Upload Issues**
   - Check UPLOAD_DIR permissions
   - Verify file size limits
   - Ensure supported file types

3. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check cookie configuration
   - Ensure HTTPS in production

### Support

For additional support, please:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

---

Built with ❤️ for VTU University students
