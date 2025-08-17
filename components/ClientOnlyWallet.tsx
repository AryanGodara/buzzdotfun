'use client'

import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@/components/farcaster-provider'

/**
 * A client-only component that shows the Farcaster user profile
 */
export function ClientOnlyWallet() {
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { isSDKLoaded, context } = useFrame()
  const farcasterUser = context?.user

  // Only show the wallet after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  if (!mounted || !isSDKLoaded) {
    return <div className="h-[36px] w-[120px]"></div> // Placeholder with similar dimensions
  }

  if (!farcasterUser?.fid) {
    return (
      <div
        className="flex items-center justify-center border-2 border-black text-black text-xs px-2 py-1 rounded-md font-medium"
        style={{ backgroundColor: '#D7FF7B' }}
      >
        No User
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
      >
        {farcasterUser?.pfpUrl ? (
          <img
            src={farcasterUser.pfpUrl}
            alt={
              farcasterUser.displayName ||
              farcasterUser.username ||
              `FID: ${farcasterUser.fid}`
            }
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-gray-300">
            {farcasterUser?.username?.substring(0, 1) ||
              farcasterUser?.displayName?.substring(0, 1) ||
              '?'}
          </div>
        )}
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 top-10 bg-white border-2 border-black rounded-md min-w-48 z-50"
          style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
        >
          <div className="p-3">
            <div className="flex items-center space-x-2">
              {farcasterUser?.pfpUrl ? (
                <img
                  src={farcasterUser.pfpUrl}
                  alt={
                    farcasterUser.displayName ||
                    farcasterUser.username ||
                    `FID: ${farcasterUser.fid}`
                  }
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm border border-gray-300">
                  {farcasterUser?.username?.substring(0, 1) ||
                    farcasterUser?.displayName?.substring(0, 1) ||
                    '?'}
                </div>
              )}
              <div>
                <div className="font-medium text-sm">
                  {farcasterUser?.displayName ||
                    farcasterUser?.username ||
                    'User'}
                </div>
                <div className="text-xs text-gray-600">
                  @{farcasterUser?.username || `FID: ${farcasterUser.fid}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
