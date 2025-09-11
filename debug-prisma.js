const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available Prisma models:');
const props = Object.getOwnPropertyNames(prisma).filter(name => !name.startsWith('_') && !name.startsWith('$'));
console.log(props);

// Check if the models exist
console.log('MCQSet exists:', 'MCQSet' in prisma);
console.log('MCQQuestion exists:', 'MCQQuestion' in prisma);
console.log('mCQSet exists:', 'mCQSet' in prisma);
console.log('mCQQuestion exists:', 'mCQQuestion' in prisma);