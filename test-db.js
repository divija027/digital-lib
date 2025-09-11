const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPI() {
  try {
    // Check if users exist
    console.log('Checking users...');
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    console.log('Users:', users);

    // Check if MCQ sets exist
    console.log('\nChecking MCQ sets...');
    const mcqSets = await prisma.mCQSet.findMany({
      select: { id: true, title: true, createdBy: true }
    });
    console.log('MCQ Sets:', mcqSets);

    // Check if MCQ questions exist
    console.log('\nChecking MCQ questions...');
    const mcqQuestions = await prisma.mCQQuestion.findMany({
      select: { id: true, question: true, mcqSetId: true, createdBy: true }
    });
    console.log('MCQ Questions:', mcqQuestions);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
