'use client'

import { useState } from 'react'
import { useFrame } from '@/components/farcaster-provider'
import Link from 'next/link'
import { ScoreResults } from './ScoreResults'
import { ScoreCalculation } from './ScoreCalculation'
import {
  getCreatorScore,
  type CreatorScore as CreatorScoreType,
} from '@/lib/api'

export function CreatorScore() {
  const { isSDKLoaded, context } = useFrame()
  const user = context?.user
  const [isLoading, setIsLoading] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [scoreData, setScoreData] = useState<CreatorScoreType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculateScore = async () => {
    if (!user?.fid) {
      setError('No user FID available')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const score = await getCreatorScore(user.fid)
      if (score) {
        setScoreData(score)
        setShowScore(true)
      } else {
        setError('Failed to fetch your creator score. Please try again.')
      }
    } catch (err) {
      console.error('Error calculating score:', err)
      setError('An error occurred while calculating your score.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCalculateAgain = () => {
    setShowScore(false)
    setScoreData(null)
    setError(null)
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

        {error ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleCalculateAgain}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !showScore ? (
          <ScoreCalculation
            onScoreCalculated={handleCalculateScore}
            isLoading={isLoading}
            userConnected={!!user?.fid}
          />
        ) : scoreData ? (
          <ScoreResults
            scoreData={scoreData}
            onCalculateAgain={handleCalculateAgain}
          />
        ) : null}
      </div>
    </div>
  )
}
