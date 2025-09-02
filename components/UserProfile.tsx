'use client'

import { useState } from 'react'
import { useFrame } from '@/components/farcaster-provider'
import { ProfilePage } from '@/components/ProfilePage'

export function UserProfile() {
  const { context } = useFrame()
  const [showProfile, setShowProfile] = useState(false)

  if (!context?.user) {
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowProfile(true)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        {context.user.pfpUrl && (
          <img
            src={context.user.pfpUrl}
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg hover:border-yellow-300 transition-colors"
            alt="Profile"
            width={32}
            height={32}
          />
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white drop-shadow-lg">
            {context.user.displayName || context.user.username}
          </p>
        </div>
      </button>

      <ProfilePage isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  )
}
