import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SwipeInterface from '@/components/SwipeInterface'

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  if (!user?.profile) {
    redirect('/profile')
  }

  // Get potential matches (users who haven't been swiped on yet)
  const existingMatches = await prisma.match.findMany({
    where: {
      OR: [
        { senderId: user.id },
        { receiverId: user.id }
      ]
    },
    select: {
      senderId: true,
      receiverId: true
    }
  })

  const swipedUserIds = new Set([
    ...existingMatches.map(m => m.senderId),
    ...existingMatches.map(m => m.receiverId),
    user.id // Exclude self
  ])

  const potentialMatches = await prisma.user.findMany({
    where: {
      id: {
        notIn: Array.from(swipedUserIds)
      },
      profile: {
        isNot: null
      }
    },
    include: {
      profile: true
    },
    take: 10
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MockMates</h1>
          <div className="flex gap-4">
            <a 
              href="/" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Home
            </a>
            <a 
              href="/matches" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Matches
            </a>
          </div>
        </header>

        <div className="max-w-md mx-auto">
          <SwipeInterface potentialMatches={potentialMatches} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}
