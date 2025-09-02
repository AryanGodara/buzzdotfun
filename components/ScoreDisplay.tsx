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
    <div className="w-full max-w-sm mx-auto px-4">
      {/* Score Display */}
      <div className="text-center mb-3">
        <h1
          className="text-base font-bold text-white mb-2"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          YOUR CREATOR SCORE IS
        </h1>
        <div
          className="font-bold mb-3"
          style={{
            fontSize: '6rem',
            lineHeight: '1',
            color: '#4D61F4',
            textShadow:
              '4px 4px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black',
          }}
        >
          {displayScore}
        </div>
        <p className="text-xs font-medium text-black mb-3">
          "You're in the {percentile} of creators!"
        </p>
        {tier && (
          <div className="mb-3">
            <div className="inline-block px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-xs rounded-full border-2 border-black shadow-lg">
              {tier} TIER
            </div>
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div
        className="bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-black rounded-xl p-4 mb-3"
        style={{ boxShadow: '6px 6px 0px rgba(0,0,0,0.8)' }}
      >
        <h3
          className="font-bold mb-3 text-white text-sm drop-shadow-lg"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          SCORE BREAKDOWN:
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-medium drop-shadow-lg">
              Engagement
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-black/30 rounded-full border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.engagement}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-white drop-shadow-lg">
                {Math.round(breakdown.engagement)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-medium drop-shadow-lg">
              ⚡ Consistency
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-black/30 rounded-full border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.consistency}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-white drop-shadow-lg">
                {Math.round(breakdown.consistency)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-medium drop-shadow-lg">
              📈 Growth
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-black/30 rounded-full border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.growth}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-white drop-shadow-lg">
                {Math.round(breakdown.growth)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-medium drop-shadow-lg">
              ✨ Quality
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-black/30 rounded-full border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.quality}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-white drop-shadow-lg">
                {Math.round(breakdown.quality)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white font-medium drop-shadow-lg">
              🌐 Network
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-black/30 rounded-full border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.network}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-white drop-shadow-lg">
                {Math.round(breakdown.network)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-white/70 mb-2 drop-shadow-lg">
        Last updated: just now
      </div>
    </div>
  )
}
