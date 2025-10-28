'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  email: string
  profile: {
    id: string
    bio: string | null
    experience: string | null
    skills: string[]
    industry: string | null
    location: string | null
    timezone: string | null
    availability: string | null
    linkedinUrl: string | null
    githubUrl: string | null
  } | null
}

interface SwipeInterfaceProps {
  potentialMatches: User[]
  currentUserId: string
}

export default function SwipeInterface({ potentialMatches, currentUserId }: SwipeInterfaceProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentUser = potentialMatches[currentIndex]

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (!currentUser || isAnimating) return

    setIsAnimating(true)

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: currentUser.id,
          action
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.isMatch) {
          // Show match animation
          alert('It\'s a match! 🎉')
        }
      }
    } catch (error) {
      console.error('Error swiping:', error)
    }

    // Move to next card
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No more profiles!</h2>
        <p className="text-gray-600 mb-8">Check back later for new potential matches.</p>
        <button
          onClick={() => router.push('/matches')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Your Matches
        </button>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        className={`bg-white rounded-2xl shadow-xl p-6 transform transition-transform duration-300 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
        style={{ height: '600px' }}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentUser.name || 'Anonymous'}
            </h2>
            
            {currentUser.profile?.bio && (
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {currentUser.profile.bio}
              </p>
            )}

            <div className="space-y-3">
              {currentUser.profile?.experience && (
                <div>
                  <span className="font-semibold text-gray-700">Experience:</span>
                  <span className="ml-2 text-gray-600">{currentUser.profile.experience}</span>
                </div>
              )}

              {currentUser.profile?.industry && (
                <div>
                  <span className="font-semibold text-gray-700">Industry:</span>
                  <span className="ml-2 text-gray-600">{currentUser.profile.industry}</span>
                </div>
              )}

              {currentUser.profile?.location && (
                <div>
                  <span className="font-semibold text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{currentUser.profile.location}</span>
                </div>
              )}

              {currentUser.profile?.timezone && (
                <div>
                  <span className="font-semibold text-gray-700">Timezone:</span>
                  <span className="ml-2 text-gray-600">{currentUser.profile.timezone}</span>
                </div>
              )}

              {currentUser.profile?.availability && (
                <div>
                  <span className="font-semibold text-gray-700">Availability:</span>
                  <span className="ml-2 text-gray-600">{currentUser.profile.availability}</span>
                </div>
              )}

              {currentUser.profile?.skills && currentUser.profile.skills.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700">Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentUser.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleSwipe('pass')}
              className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Pass
            </button>
            <button
              onClick={() => handleSwipe('like')}
              className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Like
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-gray-500">
        {currentIndex + 1} of {potentialMatches.length}
      </div>
    </div>
  )
}
