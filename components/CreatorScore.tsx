'use client'

import { useState } from 'react'
import { useFrame } from '@/components/farcaster-provider'
import Link from 'next/link'
import { ScoreResults } from './ScoreResults'
import { ScoreCalculation } from './ScoreCalculation'

export function CreatorScore() {
  const { isSDKLoaded, context } = useFrame()
  const user = context?.user
  const [isLoading, setIsLoading] = useState(false)
  const [showScore, setShowScore] = useState(false)

  const handleCalculateScore = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setShowScore(true)
  }

  const handleCalculateAgain = () => {
    setShowScore(false)
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Fixed header with home button */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 font-medium"
          >
            ← Home
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">👑 CREATOR SCORE 👑</h1>

        {!showScore ? (
          <ScoreCalculation
            onScoreCalculated={handleCalculateScore}
            isLoading={isLoading}
            userConnected={!!user?.fid}
          />
        ) : (
          <ScoreResults score={78} onCalculateAgain={handleCalculateAgain} />
        )}
      </div>
    </div>
  )
}
