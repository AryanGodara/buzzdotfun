'use client'

interface ScoreDisplayProps {
  score?: number
}

// Mock data for score display - will be replaced with backend call later
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
  metrics: {
    followers: 212,
    following: 98,
    casts: 62,
    reactions: 440,
    replies: 114,
    recasts: 78,
    engagement_rate: 6.6,
  },
}

export function ScoreDisplay({ score: propScore }: ScoreDisplayProps) {
  const { score, percentile, breakdown, metrics } = MOCK_SCORE_DATA
  const displayScore = propScore || score

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
