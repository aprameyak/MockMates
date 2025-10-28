import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, bio, experience, skills, industry, location, timezone, availability, linkedinUrl, githubUrl } = body

    // Update user name
    await prisma.user.update({
      where: { id: user.id },
      data: { name }
    })

    // Upsert profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        bio,
        experience,
        skills,
        industry,
        location,
        timezone,
        availability,
        linkedinUrl,
        githubUrl
      },
      create: {
        userId: user.id,
        bio,
        experience,
        skills,
        industry,
        location,
        timezone,
        availability,
        linkedinUrl,
        githubUrl
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
