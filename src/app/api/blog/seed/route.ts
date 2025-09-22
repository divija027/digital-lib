import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/blog/seed - Create sample blog posts and categories for demonstration
export async function POST() {
  try {
    // Create categories first
    const categories = await Promise.all([
      (prisma as any).blogCategory.upsert({
        where: { slug: 'study-tips' },
        update: {},
        create: {
          name: 'Study Tips',
          slug: 'study-tips',
          description: 'Effective study methods and tips for VTU students',
          color: '#10B981'
        }
      }),
      (prisma as any).blogCategory.upsert({
        where: { slug: 'career-guidance' },
        update: {},
        create: {
          name: 'Career Guidance',
          slug: 'career-guidance',
          description: 'Career advice and opportunities for engineering students',
          color: '#3B82F6'
        }
      }),
      (prisma as any).blogCategory.upsert({
        where: { slug: 'technology' },
        update: {},
        create: {
          name: 'Technology',
          slug: 'technology',
          description: 'Latest trends in technology and engineering',
          color: '#8B5CF6'
        }
      })
    ])

    // Get or create admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@vtu.edu',
          password: 'hashed_password', // In real app, this would be properly hashed
          name: 'VTU Admin',
          role: 'ADMIN'
        }
      })
    }

    // Create sample blog posts
    const posts = [
      {
        title: 'How to Prepare for VTU Exams: A Complete Guide',
        slug: 'how-to-prepare-for-vtu-exams-complete-guide',
        excerpt: 'Master your VTU examinations with proven strategies, time management tips, and effective study techniques used by top performers.',
        content: `
# How to Prepare for VTU Exams: A Complete Guide

Preparing for VTU exams can be challenging, but with the right strategy and dedication, you can achieve excellent results. Here's a comprehensive guide to help you excel in your examinations.

## 1. Understand the Exam Pattern

Before you start studying, it's crucial to understand the VTU exam pattern:
- Theory papers typically have 100 marks
- Internal assessment carries 20-30 marks
- Most papers have both compulsory and choice questions

## 2. Create a Study Schedule

A well-structured study schedule is essential:
- Allocate time for each subject based on difficulty
- Include regular revision sessions
- Plan breaks to avoid burnout

## 3. Focus on Previous Year Papers

Previous year question papers are your best friend:
- They help you understand the exam pattern
- Identify frequently asked questions
- Practice time management

## 4. Make Effective Notes

Good notes are crucial for quick revision:
- Use bullet points and diagrams
- Highlight important formulas and concepts
- Create summary sheets for each chapter

## 5. Stay Healthy and Motivated

Don't neglect your physical and mental health:
- Get adequate sleep
- Exercise regularly
- Take short breaks during study sessions
- Stay positive and motivated

Remember, consistent effort and smart study techniques are key to success in VTU exams. Good luck!
        `,
        categoryId: categories[0].id,
        authorId: adminUser.id,
        featured: true,
        published: true,
        views: 245,
        readTime: 5
      },
      {
        title: 'Top Tech Companies Hiring VTU Graduates in 2025',
        slug: 'top-tech-companies-hiring-vtu-graduates-2025',
        excerpt: 'Discover the latest opportunities and what top tech companies are looking for in fresh engineering graduates.',
        content: `
# Top Tech Companies Hiring VTU Graduates in 2025

The tech industry continues to grow, and VTU graduates are in high demand. Here are the top companies actively recruiting engineering talent in 2025.

## Major Tech Giants

### 1. Google
- Actively hiring for software engineering roles
- Focus on algorithms and data structures
- Competitive compensation packages

### 2. Microsoft
- Looking for cloud computing specialists
- Strong emphasis on Azure technologies
- Excellent growth opportunities

### 3. Amazon
- High demand for backend developers
- Focus on scalability and system design
- Global opportunities available

## Indian Tech Leaders

### 1. TCS (Tata Consultancy Services)
- Largest recruiter of engineering graduates
- Comprehensive training programs
- Multiple technology domains

### 2. Infosys
- Strong focus on digital transformation
- Excellent learning and development programs
- Global project exposure

### 3. Wipro
- Growing demand for AI/ML specialists
- Focus on emerging technologies
- Competitive packages for top performers

## Startups to Watch

The startup ecosystem is thriving with opportunities in:
- FinTech companies
- EdTech platforms
- HealthTech solutions
- E-commerce platforms

## How to Prepare

1. **Technical Skills**: Focus on programming languages like Java, Python, JavaScript
2. **Problem Solving**: Practice coding on platforms like LeetCode, HackerRank
3. **System Design**: Understand scalability and architecture principles
4. **Soft Skills**: Communication and teamwork are equally important

Stay updated with industry trends and continuously improve your skills to land your dream job!
        `,
        categoryId: categories[1].id,
        authorId: adminUser.id,
        featured: false,
        published: true,
        views: 189,
        readTime: 7
      },
      {
        title: 'AI and Machine Learning: Essential Skills for Engineers',
        slug: 'ai-machine-learning-essential-skills-engineers',
        excerpt: 'Learn about the most in-demand skills in AI and ML that every engineering student should know about.',
        content: `
# AI and Machine Learning: Essential Skills for Engineers

Artificial Intelligence and Machine Learning are transforming every industry. Here's what every engineering student should know to stay relevant in the AI-driven future.

## Core Programming Languages

### Python
- Most popular language for AI/ML
- Extensive libraries: NumPy, Pandas, Scikit-learn
- Easy to learn and implement

### R
- Excellent for statistical analysis
- Great for data visualization
- Strong community support

### Java
- Used in enterprise ML applications
- Good for large-scale systems
- Platform independent

## Essential Libraries and Frameworks

### For Machine Learning:
- **Scikit-learn**: Perfect for beginners
- **TensorFlow**: Google's ML framework
- **PyTorch**: Facebook's ML library
- **Keras**: High-level neural networks API

### For Data Processing:
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Matplotlib/Seaborn**: Data visualization

## Key Concepts to Master

### 1. Mathematics Foundation
- Linear Algebra
- Calculus
- Statistics and Probability
- Discrete Mathematics

### 2. Machine Learning Algorithms
- Supervised Learning (Linear Regression, Decision Trees, SVM)
- Unsupervised Learning (K-means, PCA)
- Deep Learning (Neural Networks, CNN, RNN)

### 3. Data Science Pipeline
- Data Collection
- Data Cleaning and Preprocessing
- Feature Engineering
- Model Training and Evaluation
- Model Deployment

## Practical Projects to Build

1. **Sentiment Analysis**: Analyze social media sentiment
2. **Image Classification**: Build a CNN for image recognition
3. **Recommendation System**: Create a movie/book recommendation engine
4. **Time Series Prediction**: Predict stock prices or weather
5. **Chatbot**: Build an intelligent conversational AI

## Industry Applications

AI/ML is being used across industries:
- **Healthcare**: Disease diagnosis, drug discovery
- **Finance**: Fraud detection, algorithmic trading
- **Automotive**: Self-driving cars, predictive maintenance
- **E-commerce**: Recommendation systems, price optimization
- **Education**: Personalized learning, automated grading

## Getting Started

1. **Take Online Courses**: Coursera, edX, Udacity offer excellent AI/ML courses
2. **Practice on Kaggle**: Participate in machine learning competitions
3. **Build Personal Projects**: Create a portfolio of ML projects
4. **Join Communities**: Engage with AI/ML communities and forums
5. **Stay Updated**: Follow AI research papers and industry news

The future belongs to those who can harness the power of AI and ML. Start your journey today!
        `,
        categoryId: categories[2].id,
        authorId: adminUser.id,
        featured: false,
        published: true,
        views: 156,
        readTime: 8
      }
    ]

    // Create the blog posts
    const createdPosts = []
    for (const postData of posts) {
      const post = await (prisma as any).blogPost.create({
        data: {
          ...postData,
          publishedAt: new Date()
        }
      })
      createdPosts.push(post)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${categories.length} categories and ${createdPosts.length} blog posts`,
      data: {
        categories: categories.length,
        posts: createdPosts.length
      }
    })
  } catch (error) {
    console.error('Error seeding blog data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed blog data', details: error },
      { status: 500 }
    )
  }
}