const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@vtu.ac.in',
        password: 'admin123' // Common default password, might need to check what the actual password is
      })
    });

    const data = await response.json();
    console.log('Login response status:', response.status);
    console.log('Login response:', data);
    
    if (response.ok && data.token) {
      console.log('Login successful! Token received.');
      
      // Test MCQ question creation with the token
      console.log('\nTesting MCQ question creation...');
      
      const createResponse = await fetch('http://localhost:3002/api/mcq/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `auth-token=${data.token}`
        },
        body: JSON.stringify({
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation: "Basic addition: 2 + 2 = 4",
          difficulty: "BEGINNER",
          tags: ["math", "basic"],
          mcqSetId: "cmfebwiyn0001sbd7c9x2h6x9" // Using existing MCQ set ID from database
        })
      });
      
      const createData = await createResponse.json();
      console.log('MCQ creation response status:', createResponse.status);
      console.log('MCQ creation response:', createData);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLogin();
