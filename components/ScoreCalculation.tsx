'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ScoreCalculationProps {
  onScoreCalculated: () => void
  isLoading: boolean
  userConnected: boolean
}

export function ScoreCalculation({
  onScoreCalculated,
  isLoading,
  userConnected,
}: ScoreCalculationProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <button
        type="button"
        onClick={onScoreCalculated}
        disabled={isLoading || !userConnected}
        className="w-full border-2 border-black p-4 text-lg font-bold bg-white hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            CALCULATING...
          </>
        ) : (
          'CALCULATE YOUR SCORE NOW!'
        )}
      </button>

      {!userConnected && (
        <p className="text-center text-red-500 text-sm">
          Connect your Farcaster account first to calculate your score
        </p>
      )}
    </div>
  )
}
