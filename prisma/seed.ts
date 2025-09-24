import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin@gmail.com user
  const adminPassword = await bcrypt.hash('Password123@', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create superadmin@gmail.com user
  const superAdminPassword = await bcrypt.hash('Password123@', 12)
  
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: {},
    create: {
      email: 'superadmin@gmail.com',
      password: superAdminPassword,
      name: 'Super Admin User',
      role: 'SUPERADMIN'
    }
  })

  console.log('✅ Super Admin user created:', superAdminUser.email)

  // Create sample student user
  const studentPassword = await bcrypt.hash('student123', 12)
  
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: studentPassword,
      name: 'John Doe',
      role: 'STUDENT'
    }
  })

  console.log('✅ Student user created:', studentUser.email)

  // Create categories
  const categories = [
    { name: 'Question Papers', description: 'University question papers for various subjects' },
    { name: 'Study Materials', description: 'Comprehensive study materials and notes' },
    { name: 'Previous Year Papers', description: 'Previous year examination papers' },
    { name: 'Syllabus', description: 'Subject-wise syllabus documents' },
    { name: 'Lab Manuals', description: 'Laboratory manuals and experiments' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories created')

  // Create subjects
  const subjects = [
    { name: 'Engineering Mathematics-I', code: 'MAT101', semester: 1 },
    { name: 'Engineering Physics', code: 'PHY102', semester: 1 },
    { name: 'Engineering Chemistry', code: 'CHE103', semester: 1 },
    { name: 'Elements of Civil Engineering', code: 'CIV104', semester: 1 },
    { name: 'Engineering Mathematics-II', code: 'MAT201', semester: 2 },
    { name: 'Engineering Mechanics', code: 'MEC202', semester: 2 },
    { name: 'Basic Electronics', code: 'ELE203', semester: 2 },
    { name: 'Computer Programming', code: 'CSE204', semester: 2 },
    { name: 'Data Structures', code: 'CSE301', semester: 3 },
    { name: 'Digital Logic Design', code: 'CSE302', semester: 3 },
    { name: 'Computer Organization', code: 'CSE303', semester: 3 },
    { name: 'Object Oriented Programming', code: 'CSE304', semester: 3 },
    { name: 'Operating Systems', code: 'CSE401', semester: 4 },
    { name: 'Database Management Systems', code: 'CSE402', semester: 4 },
    { name: 'Computer Networks', code: 'CSE403', semester: 4 },
    { name: 'Software Engineering', code: 'CSE404', semester: 4 }
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject
    })
  }

  console.log('✅ Subjects created')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('👨‍💼 Admin: admin@gmail.com / Password123@')
  console.log('👑 Super Admin: superadmin@gmail.com / Password123@')
  console.log('👨‍🎓 Student: student@example.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
