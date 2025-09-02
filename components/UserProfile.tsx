'use client'

import { useFrame } from '@/components/farcaster-provider'

export function UserProfile() {
  const { context } = useFrame()

  if (!context?.user) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      {context.user.pfpUrl && (
        <img
          src={context.user.pfpUrl}
          className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
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
    </div>
  )
}
