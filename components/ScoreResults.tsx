'use client'

import { Share2, Trophy } from 'lucide-react'

interface ScoreResultsProps {
  score: number
  onCalculateAgain: () => void
}

// Hardcoded mock data matching wireframe
const MOCK_SCORE_DATA = {
  score: 78,
  percentile: 'TOP 25%',
  breakdown: {
    engagement: 89,
    consistency: 67,
    growth: 73,
    quality: 91,
    network: 58,
  },
  friends: [
    { username: '@alice', score: 72 },
    { username: '@bob', score: 65 },
  ],
}

export function ScoreResults({ onCalculateAgain }: ScoreResultsProps) {
  const { score, percentile, breakdown, friends } = MOCK_SCORE_DATA

  const handleShare = (platform: 'farcaster' | 'x') => {
    const text = `🎉 YOUR SCORE IS ${score}! 🎉\n\nYou're in the ${percentile} of creators!\n\n#CreatorScore #Farcaster`

    if (platform === 'farcaster') {
      // Open Farcaster share intent
      window.open(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`,
        '_blank',
      )
    } else {
      // Open X/Twitter share intent
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        '_blank',
      )
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Hero Score Display */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-bold">YOUR SCORE IS {score}!</span>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>

        <div className="bg-white border-2 border-black rounded-xl p-6 mb-4 shadow-lg">
          <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
          <div className="text-sm font-medium">CREATOR SCORE</div>
        </div>

        <p className="text-sm font-medium mb-4">
          "You're in the {percentile} of creators!"
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-lg">
        <h3 className="font-bold mb-3">SCORE BREAKDOWN:</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">• Engagement</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${breakdown.engagement}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {breakdown.engagement}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">• Consistency</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${breakdown.consistency}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {breakdown.consistency}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">• Growth</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${breakdown.growth}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {breakdown.growth}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">• Quality</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${breakdown.quality}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {breakdown.quality}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">• Network</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-600 rounded-full"
                  style={{ width: `${breakdown.network}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {breakdown.network}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-lg">
        <div className="text-center mb-3">
          <div className="font-bold mb-2">SHARE & MINT YOUR SCORE NFT</div>
          <div className="text-sm text-gray-600 mb-3">[Pulsing CTA Button]</div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => handleShare('farcaster')}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Share on Farcaster
          </button>
          <button
            type="button"
            onClick={() => handleShare('x')}
            className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Share on X
          </button>
        </div>
      </div>

      {/* Friends Comparison */}
      <div className="text-center text-sm space-y-1">
        <p>"You beat @alice (Score: 72)!"</p>
        <p>"Challenge @bob to beat you"</p>
      </div>

      {/* Calculate Again Button */}
      <button
        type="button"
        onClick={onCalculateAgain}
        className="w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        Calculate Again
      </button>
    </div>
  )
}
