# MockMates

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)

## About

**MockMates** is a full-stack web application built with **Next.js**, **TypeScript**, and **PostgreSQL** that helps developers find mock interview partners through a Tinder-style matching system. Users swipe through profiles, match with people who swipe back, and then chat to schedule sessions.

## Features

- Email and password authentication with bcrypt password hashing via NextAuth.js
- Detailed profile creation with skills, experience level, industry, and timezone
- Swipe-based discovery interface to like or pass on potential interview partners
- Mutual matching system — conversations only unlock after both users like each other
- Real-time chat between matched partners for scheduling mock interviews
- LinkedIn and GitHub profile linking on user profiles
- Full Prisma ORM integration with PostgreSQL for type-safe database access

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
