'use client'

import type { CreatorScore } from '@/lib/api'

interface ScoreDisplayProps {
  scoreData?: CreatorScore
  score?: number // Fallback for legacy usage
}

export function ScoreDisplay({
  scoreData,
  score: propScore,
}: ScoreDisplayProps) {
  // Use scoreData if available, otherwise fallback to propScore
  const displayScore = scoreData
    ? Math.round(scoreData.overallScore)
    : propScore || 78
  const percentile = scoreData?.tierInfo.percentile || 'TOP 25%'
  const breakdown = scoreData?.components || {
    engagement: 89,
    consistency: 67,
    growth: 73,
    quality: 91,
    network: 58,
  }
  const tier = scoreData?.tier

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Score Display */}
      <div className="text-center mb-2">
        <h1
          className="text-lg font-bold text-white mb-2"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          YOUR CREATOR SCORE IS
        </h1>
        <div
          className="font-bold mb-4"
          style={{
            fontSize: '9rem',
            lineHeight: '1',
            color: '#4D61F4',
            textShadow:
              '6px 6px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black',
          }}
        >
          {displayScore}
        </div>
        <p className="text-sm font-medium text-black mb-4">
          "You're in the {percentile} of creators!"
        </p>
        {tier && (
          <div className="mb-4">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-full border-2 border-black shadow-lg">
              {tier} TIER
            </div>
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div
        className="bg-white border-2 border-black rounded-md p-3 mb-4"
        style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}
      >
        <h3 className="font-bold mb-3 text-black">SCORE BREAKDOWN:</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-black">• Engagement</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${breakdown.engagement}%` }}
                />
              </div>
              <span className="text-sm font-medium w-6 text-black">
                {breakdown.engagement}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-black">• Consistency</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${breakdown.consistency}%` }}
                />
              </div>
              <span className="text-sm font-medium w-6 text-black">
                {breakdown.consistency}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-black">• Growth</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${breakdown.growth}%` }}
                />
              </div>
              <span className="text-sm font-medium w-6 text-black">
                {breakdown.growth}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-black">• Quality</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${breakdown.quality}%` }}
                />
              </div>
              <span className="text-sm font-medium w-6 text-black">
                {breakdown.quality}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-black">• Network</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${breakdown.network}%` }}
                />
              </div>
              <span className="text-sm font-medium w-6 text-black">
                {breakdown.network}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-500 mb-4">
        Last updated: just now
      </div>
    </div>
  )
}
