import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ChatInterface from '@/components/ChatInterface'

interface MessagePageProps {
  params: {
    userId: string
  }
}

export default async function MessagePage({ params }: MessagePageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!currentUser) {
    redirect('/auth/signin')
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: params.userId },
    include: { profile: true }
  })

  if (!targetUser) {
    redirect('/matches')
  }

  // Check if users are matched
  const match = await prisma.match.findFirst({
    where: {
      isMatched: true,
      OR: [
        { senderId: currentUser.id, receiverId: targetUser.id },
        { senderId: targetUser.id, receiverId: currentUser.id }
      ]
    }
  })

  if (!match) {
    redirect('/matches')
  }

  // Get messages between users
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUser.id, receiverId: targetUser.id },
        { senderId: targetUser.id, receiverId: currentUser.id }
      ]
    },
    include: {
      sender: true,
      receiver: true
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <a 
              href="/matches" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              ← Back to Matches
            </a>
            <h1 className="text-2xl font-bold text-gray-900">
              Chat with {targetUser.name || 'Anonymous'}
            </h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <ChatInterface 
            messages={messages}
            currentUserId={currentUser.id}
            targetUserId={targetUser.id}
            targetUserName={targetUser.name || 'Anonymous'}
          />
        </div>
      </div>
    </div>
  )
}
