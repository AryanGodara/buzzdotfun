'use client'

import { useState, useEffect } from 'react'
import {
  getLeaderboard,
  getDisplayName,
  getProfileImage,
  type LeaderboardEntry,
} from '@/lib/api'

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true)
        console.log('🏆 Fetching leaderboard data...')

        // Fetch leaderboard from backend (now includes profile data)
        const leaderboardData = await getLeaderboard()
        if (!leaderboardData) {
          throw new Error('Failed to fetch leaderboard')
        }

        console.log(
          '📊 Leaderboard data received:',
          leaderboardData.leaderboard.length,
          'entries',
        )
        console.log('🖼️ Profile data included in backend response')

        setLeaderboard(leaderboardData.leaderboard)
        setError(null)
      } catch (err) {
        console.error('❌ Error fetching leaderboard:', err)
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto mt-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white font-medium drop-shadow-lg">
          Loading leaderboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto mt-8 text-center">
        <p className="text-red-300 font-medium drop-shadow-lg mb-4">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfList = leaderboard.slice(3)

  return (
    <div className="w-full max-w-sm mx-auto mt-2 px-4">
      {/* Podium for Top 3 */}
      <div className="mb-4">
        <h2
          className="text-lg font-bold text-center mb-4 text-white"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          🏆 TOP CREATORS
        </h2>

        <div className="flex justify-center items-end gap-2 mb-4">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                {getProfileImage(topThree[1]) ? (
                  <img
                    src={getProfileImage(topThree[1])!}
                    alt={getDisplayName(topThree[1])}
                    className="w-16 h-16 rounded-full border-4 border-gray-300 object-cover"
                    style={{ boxShadow: '0 0 0 2px #C0C0C0' }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-4 border-gray-300 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getDisplayName(topThree[1])
                        ? getDisplayName(topThree[1]).charAt(0).toUpperCase()
                        : '?'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </div>
              <p className="text-xs font-bold mt-2 text-center text-white drop-shadow-lg max-w-16 truncate">
                {getDisplayName(topThree[1])}
              </p>
              <p className="text-sm font-bold text-white drop-shadow-lg">
                {Math.round(topThree[1].overallScore)}
              </p>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                {getProfileImage(topThree[0]) ? (
                  <img
                    src={getProfileImage(topThree[0])!}
                    alt={getDisplayName(topThree[0])}
                    className="w-20 h-20 rounded-full border-4 border-yellow-400 object-cover"
                    style={{ boxShadow: '0 0 0 2px #FFD700' }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-400 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {getDisplayName(topThree[0])
                        ? getDisplayName(topThree[0]).charAt(0).toUpperCase()
                        : '?'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              </div>
              <p className="text-sm font-bold mt-2 text-center text-white drop-shadow-lg max-w-20 truncate">
                {getDisplayName(topThree[0])}
              </p>
              <p className="text-base font-bold text-white drop-shadow-lg">
                {Math.round(topThree[0].overallScore)}
              </p>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                {getProfileImage(topThree[2]) ? (
                  <img
                    src={getProfileImage(topThree[2])!}
                    alt={getDisplayName(topThree[2])}
                    className="w-14 h-14 rounded-full border-4 border-orange-400 object-cover"
                    style={{ boxShadow: '0 0 0 2px #CD7F32' }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-orange-400 flex items-center justify-center">
                    <span className="text-white font-bold text-base">
                      {getDisplayName(topThree[2])
                        ? getDisplayName(topThree[2]).charAt(0).toUpperCase()
                        : '?'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
              <p className="text-xs font-bold mt-2 text-center text-white drop-shadow-lg max-w-14 truncate">
                {getDisplayName(topThree[2])}
              </p>
              <p className="text-sm font-bold text-white drop-shadow-lg">
                {Math.round(topThree[2].overallScore)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div
        className="bg-gradient-to-br from-white/90 to-white/80 border-2 border-black rounded-xl p-3 backdrop-blur-sm"
        style={{ boxShadow: '6px 6px 0px rgba(0,0,0,0.8)' }}
      >
        <div className="space-y-2">
          {restOfList.slice(0, 7).map((entry) => (
            <div
              key={entry.fid}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <div className="flex-shrink-0 w-6 text-center">
                <span className="text-sm font-bold text-gray-700">
                  {entry.rank}
                </span>
              </div>

              {getProfileImage(entry) ? (
                <img
                  src={getProfileImage(entry)!}
                  alt={getDisplayName(entry)}
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border border-gray-300 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {getDisplayName(entry)
                      ? getDisplayName(entry).charAt(0).toUpperCase()
                      : '?'}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800 truncate">
                  {getDisplayName(entry)}
                </p>
              </div>

              <div className="flex-shrink-0">
                <span className="text-sm font-bold text-gray-800">
                  {Math.round(entry.overallScore)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
