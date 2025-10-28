import type { NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const HomePage: NextPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MockMates</h1>
          <div className="flex gap-4">
            <Link 
              href="/profile" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Profile
            </Link>
            <Link 
              href="/matches" 
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Matches
            </Link>
            <Link 
              href="/api/auth/signout" 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </header>

        <main className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MockMates!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Find your perfect mock interview partner
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link 
              href="/discover" 
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Discover Matches
              </h3>
              <p className="text-gray-600">
                Swipe through potential mock interview partners and find your perfect match!
              </p>
            </Link>
            
            <Link 
              href="/messages" 
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Messages
              </h3>
              <p className="text-gray-600">
                Chat with your matched partners and schedule your mock interviews.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage
