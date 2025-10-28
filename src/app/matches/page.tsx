import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MatchesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Get all matches for the current user
  const matches = await prisma.match.findMany({
    where: {
      isMatched: true,
      OR: [
        { senderId: user.id },
        { receiverId: user.id }
      ]
    },
    include: {
      sender: {
        include: { profile: true }
      },
      receiver: {
        include: { profile: true }
      }
    }
  })

  // Get the matched users (not the current user)
  const matchedUsers = matches.map(match => 
    match.senderId === user.id ? match.receiver : match.sender
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MockMates</h1>
          <div className="flex gap-4">
            <Link 
              href="/" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Home
            </Link>
            <Link 
              href="/discover" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Discover
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h2>
          
          {matchedUsers.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No matches yet!</h3>
              <p className="text-gray-600 mb-8">Start swiping to find your perfect mock interview partner.</p>
              <Link 
                href="/discover"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Discovering
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedUsers.map((match) => (
                <div key={match.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {match.name || 'Anonymous'}
                  </h3>
                  
                  {match.profile?.bio && (
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {match.profile.bio}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {match.profile?.experience && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Experience:</span>
                        <span className="ml-2 text-gray-600">{match.profile.experience}</span>
                      </div>
                    )}
                    
                    {match.profile?.industry && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Industry:</span>
                        <span className="ml-2 text-gray-600">{match.profile.industry}</span>
                      </div>
                    )}
                  </div>

                  {match.profile?.skills && match.profile.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {match.profile.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {match.profile.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{match.profile.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/messages/${match.id}`}
                    className="w-full block text-center py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Start Chatting
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
