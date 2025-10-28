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

    const { receiverId, content } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if users are matched
    const match = await prisma.match.findFirst({
      where: {
        isMatched: true,
        OR: [
          { senderId: user.id, receiverId },
          { senderId: receiverId, receiverId: user.id }
        ]
      }
    })

    if (!match) {
      return NextResponse.json({ error: 'Users are not matched' }, { status: 403 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content
      },
      include: {
        sender: true,
        receiver: true
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
