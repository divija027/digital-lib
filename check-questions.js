const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkQuestion() {
  try {
    const questions = await prisma.mCQQuestion.findMany({
      include: {
        mcqSet: true,
        creator: true
      }
    });
    console.log('MCQ Questions in database:');
    console.log(JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestion();
