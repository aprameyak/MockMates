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

    const { targetUserId, action } = await request.json()

    if (action === 'like') {
      // Check if the target user has already liked the current user
      const existingMatch = await prisma.match.findFirst({
        where: {
          senderId: targetUserId,
          receiverId: user.id
        }
      })

      if (existingMatch) {
        // It's a match! Update the existing match
        await prisma.match.update({
          where: { id: existingMatch.id },
          data: { isMatched: true }
        })

        return NextResponse.json({ isMatch: true })
      } else {
        // Create a new match record
        await prisma.match.create({
          data: {
            senderId: user.id,
            receiverId: targetUserId,
            isMatched: false
          }
        })

        return NextResponse.json({ isMatch: false })
      }
    } else if (action === 'pass') {
      // Create a pass record (no match)
      await prisma.match.create({
        data: {
          senderId: user.id,
          receiverId: targetUserId,
          isMatched: false
        }
      })

      return NextResponse.json({ isMatch: false })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing swipe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
