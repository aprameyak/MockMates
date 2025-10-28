# MockMates - Mock Interview Partner Finder

A Next.js application that helps users find mock interview partners with a Tinder-like matching system.

## Features

- **User Authentication**: Sign up and sign in with email/password
- **Profile Management**: Create and edit detailed profiles with skills, experience, and availability
- **Tinder-like Swiping**: Discover potential mock interview partners by swiping through profiles
- **Matching System**: Users can only message each other after mutual likes (matches)
- **Real-time Messaging**: Chat with matched partners to schedule mock interviews
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or NeonDB for cloud)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MockMates
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Update `.env.local` with your database URL and NextAuth secret:
```
DATABASE_URL="postgresql://username:password@localhost:5432/mockmates?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

5. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: Basic user information and authentication
- **Profile**: Detailed user profiles with skills, experience, and preferences
- **Match**: Tracks swipes and matches between users
- **Message**: Chat messages between matched users

## API Routes

- `/api/auth/[...nextauth]` - NextAuth.js authentication
- `/api/auth/signup` - User registration
- `/api/profile` - Profile management
- `/api/swipe` - Handle swiping actions
- `/api/messages` - Send and receive messages

## Features Overview

### 1. Authentication
- Secure sign up and sign in
- Password hashing with bcrypt
- Session management with NextAuth.js

### 2. Profile System
- Comprehensive profile creation
- Skills, experience level, industry selection
- Location and timezone preferences
- LinkedIn and GitHub links

### 3. Discovery & Matching
- Swipe through potential matches
- Like/pass functionality
- Mutual matching system
- Real-time match notifications

### 4. Messaging
- Chat interface for matched users
- Real-time message updates
- Message history and timestamps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
