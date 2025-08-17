'use client'

import type { UserMetrics } from '@/lib/hooks/useFarcaster'

interface MetricsDisplayProps {
  metrics: UserMetrics | null
  score: number
}

function calculateScore(metrics: UserMetrics) {
  if (!metrics) return 0

  if (
    metrics.followers === undefined ||
    metrics.engagement_rate === undefined
  ) {
    return 0
  }

  const followersWeight = 0.3
  const engagementWeight = 0.4
  const castsWeight = 0.15
  const reactionsWeight = 0.15

  const followersScore =
    Math.min((metrics.followers || 0) / 1000, 10) * followersWeight
  const engagementScore =
    Math.min((metrics.engagement_rate || 0) * 100, 10) * engagementWeight
  const castsScore = Math.min((metrics.casts || 0) / 100, 10) * castsWeight
  const reactionsScore =
    Math.min((metrics.reactions || 0) / 1000, 10) * reactionsWeight

  const totalScore =
    followersScore + engagementScore + castsScore + reactionsScore
  return Math.round(totalScore * 10)
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const score = metrics ? calculateScore(metrics) : 0

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Score Display */}
      <div className="text-center mb-4">
        <h2
          className="text-lg font-bold text-white mb-2"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          Your Creator Score
        </h2>
        <div
          className="text-4xl font-bold mb-4"
          style={{
            color: '#4D61F4',
            textShadow:
              '3px 3px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          {score}
        </div>
      </div>

      {/* Compact Metrics Table */}
      <div
        className="bg-white border-2 border-black rounded-md p-3 mb-4"
        style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}
      >
        <table className="w-full text-sm">
          <tbody className="space-y-1">
            <tr className="border-b border-gray-300">
              <td className="font-bold text-black py-1">FOLLOWERS</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.followers?.toLocaleString() || 'N/A'}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="font-bold text-black py-1">FOLLOWING</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.following?.toLocaleString() || 'N/A'}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="font-bold text-black py-1">CASTS</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.casts?.toLocaleString() || 'N/A'}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="font-bold text-black py-1">REACTIONS</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.reactions?.toLocaleString() || 'N/A'}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="font-bold text-black py-1">REPLIES</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.replies?.toLocaleString() || 'N/A'}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="font-bold text-black py-1">RECASTS</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.recasts?.toLocaleString() || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="font-bold text-black py-1">ENGAGEMENT RATE</td>
              <td className="font-bold text-black text-right py-1">
                {metrics?.engagement_rate
                  ? `${(metrics.engagement_rate * 100).toFixed(2)}%`
                  : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-600 mb-4">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  )
}
