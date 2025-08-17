'use client'

import { useState, useEffect } from 'react'

interface Creator {
  rank: number
  name: string
  score: number
  avatar: string
}

export function LeaderboardPage() {
  const [creators, setCreators] = useState<Creator[]>([])

  useEffect(() => {
    // Generate random leaderboard data
    const creatorNames = [
      'alice.eth',
      'bob.lens',
      'charlie.fc',
      'diana.base',
      'evan.cast',
      'fiona.xyz',
      'george.web3',
      'hannah.dao',
      'ivan.nft',
      'julia.defi',
    ]

    const avatarColors = [
      '#FF6B35',
      '#4D61F4',
      '#00C896',
      '#9B59B6',
      '#E74C3C',
      '#F39C12',
      '#3498DB',
      '#2ECC71',
      '#E67E22',
      '#1ABC9C',
    ]

    const leaderboardData = creatorNames
      .map((name, index) => ({
        rank: index + 1,
        name,
        score: Math.floor(Math.random() * 20) + 80, // Scores between 80-99
        avatar: avatarColors[index],
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map((creator, index) => ({ ...creator, rank: index + 1 })) // Update ranks after sorting

    setCreators(leaderboardData)
  }, [])

  const topThree = creators.slice(0, 3)
  const restOfList = creators.slice(3)

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      {/* Podium for Top 3 */}
      <div className="mb-3">
        <h2
          className="text-lg font-bold text-center mb-2 text-white"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          🏆 TOP CREATORS
        </h2>

        <div className="flex justify-center items-end gap-1 mb-3">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-gray-300"
                  style={{ backgroundColor: topThree[1].avatar }}
                >
                  {topThree[1].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
              </div>
              <p className="text-xs font-bold mt-1 text-center">
                {topThree[1].name}
              </p>
              <p className="text-sm font-bold">{topThree[1].score}</p>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base border-2 border-yellow-400"
                  style={{ backgroundColor: topThree[0].avatar }}
                >
                  {topThree[0].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
              </div>
              <p className="text-xs font-bold mt-1 text-center">
                {topThree[0].name}
              </p>
              <p className="text-base font-bold">{topThree[0].score}</p>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-orange-400"
                  style={{ backgroundColor: topThree[2].avatar }}
                >
                  {topThree[2].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
              </div>
              <p className="text-xs font-bold mt-1 text-center">
                {topThree[2].name}
              </p>
              <p className="text-sm font-bold">{topThree[2].score}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div
        className="bg-white bg-opacity-90 border-2 border-black rounded-md p-2"
        style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}
      >
        <div className="space-y-1">
          {restOfList.slice(0, 4).map((creator) => (
            <div
              key={creator.rank}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50"
            >
              <div className="flex-shrink-0 w-6 text-center">
                <span className="text-sm font-bold text-gray-600">
                  {creator.rank}
                </span>
              </div>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border border-gray-300"
                style={{ backgroundColor: creator.avatar }}
              >
                {creator.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="font-bold text-xs">{creator.name}</p>
              </div>

              <div className="flex-shrink-0">
                <span className="text-sm font-bold">{creator.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
