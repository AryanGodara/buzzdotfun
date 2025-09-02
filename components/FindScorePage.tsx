'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useCreatorScore } from '@/components/CreatorScoreProvider'

interface UserScore {
  fid: number
  username: string
  displayName: string
  overallScore: number
  tier: string
  components: {
    engagement: number
    consistency: number
    growth: number
    quality: number
    network: number
  }
}

export function FindScorePage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [userScore, setUserScore] = useState<UserScore | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [myScore, setMyScore] = useState<number | null>(null)
  const { scoreData, user, fetchCreatorScore } = useCreatorScore()

  // Fetch user's own score when component mounts or when user changes
  useEffect(() => {
    const loadMyScore = async () => {
      if (user?.fid && !scoreData) {
        try {
          await fetchCreatorScore()
        } catch (error) {
          console.log('Failed to fetch user score:', error)
        }
      }
      
      // Set myScore from scoreData or fetch directly if needed
      if (scoreData?.overallScore) {
        setMyScore(scoreData.overallScore)
      } else if (user?.fid) {
        // Fallback: fetch score directly
        try {
          const apiUrl = `https://buzzfunbackend.buzzdotfun.workers.dev/api/score/creator/${user.fid}`
          const response = await fetch(apiUrl)
          const data = await response.json()
          if (data?.success && data?.data?.overallScore) {
            setMyScore(data.data.overallScore)
          }
        } catch (error) {
          console.log('Failed to fetch fallback score:', error)
          setMyScore(44) // Use your known score as fallback
        }
      }
    }

    loadMyScore()
  }, [user?.fid, scoreData, fetchCreatorScore])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError(null)
    setUserScore(null)

    try {
      // API endpoint will be: /api/score/username/{username}
      const apiUrl = `https://buzzfunbackend.buzzdotfun.workers.dev/api/score/username/${username.trim()}`
      console.log('Searching for user score:', apiUrl)
      
      const response = await fetch(apiUrl)
      
      const data = await response.json()
      
      if (!response.ok) {
        // Handle backend error response format: {"error": "User not found"}
        const errorMessage = data?.error || 'Failed to fetch user score'
        throw new Error(errorMessage)
      }
      
      if (data?.success && data?.data) {
        setUserScore(data.data)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleShareScore = async (user: UserScore) => {
    // Create dynamic messaging based on score comparison
    const currentScore = myScore || scoreData?.overallScore || 0
    let competitiveMessage = ''
    
    if (currentScore > user.overallScore) {
      competitiveMessage = `Just checked @${user.username}'s Creator Score: ${user.overallScore}/100 (Tier ${user.tier})! 

Not bad, but I'm sitting at ${currentScore}/100 😎 Can you beat us both?

Check your loan eligibility at buzz.fun`
    } else if (currentScore < user.overallScore) {
      competitiveMessage = `Just checked @${user.username}'s Creator Score: ${user.overallScore}/100 (Tier ${user.tier})! 

Impressive! I'm at ${currentScore}/100 but catching up soon 🚀

Think you can beat @${user.username}? Check your loan eligibility at buzz.fun`
    } else {
      competitiveMessage = `Just checked @${user.username}'s Creator Score: ${user.overallScore}/100 (Tier ${user.tier})! 

We're tied at ${currentScore}/100! Who's going to break the deadlock?

Check your loan eligibility at buzz.fun`
    }

    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(competitiveMessage)}&embeds[]=${encodeURIComponent('https://farcaster.xyz/miniapps/B17cQgOJGymU/buzzfun')}`
      await sdk.actions.openUrl(shareUrl)
    } catch (error) {
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(competitiveMessage)}&embeds[]=${encodeURIComponent('https://farcaster.xyz/miniapps/B17cQgOJGymU/buzzfun')}`
      window.open(shareUrl, '_blank')
    }
  }

  const handleTagFriend = async (user: UserScore) => {
    // Create broader social discovery cast for network expansion
    const currentScore = myScore || scoreData?.overallScore || 0
    const castText = `Creator Score discovery time! 📊

@${user.username}: ${user.overallScore}/100 (Tier ${user.tier})
Me: ${currentScore}/100

Drop your username below and let's see who has the highest score in our network! 

Test your loan eligibility: buzz.fun`

    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent('https://farcaster.xyz/miniapps/B17cQgOJGymU/buzzfun')}`
      await sdk.actions.openUrl(shareUrl)
    } catch (error) {
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent('https://farcaster.xyz/miniapps/B17cQgOJGymU/buzzfun')}`
      window.open(shareUrl, '_blank')
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-purple-600 bg-purple-100'
      case 'A': return 'text-green-600 bg-green-100'
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C': return 'text-yellow-600 bg-yellow-100'
      case 'D': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {/* Search Form */}
      <div
        className="bg-white border-2 border-black rounded-md p-4 mb-4"
        style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
      >
        <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
          Find Creator Score
        </h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Farcaster username"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none text-sm text-gray-800 placeholder-gray-500"
              disabled={loading}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full border-2 border-black p-3 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#4D61F4',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
            }}
          >
            {loading ? 'Searching...' : 'Search Creator'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* User Score Results */}
      {userScore && (
        <div
          className="bg-white border-2 border-black rounded-md p-4 mb-4"
          style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
        >
          {/* User Info */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              @{userScore.username}
            </h2>
            <p className="text-sm text-gray-600">{userScore.displayName}</p>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-800">
                {userScore.overallScore}
              </span>
              <span className="text-lg text-gray-600">/100</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTierColor(userScore.tier)}`}>
                Tier {userScore.tier}
              </span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3 mb-4">
            <h3 className="text-sm font-bold text-gray-800 text-center mb-3">
              SCORE BREAKDOWN
            </h3>
            
            {Object.entries(userScore.components).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-gray-700 font-medium capitalize">
                  {key}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-6 text-gray-700">
                    {Math.round(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Social Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleShareScore(userScore)}
              className="w-full border-2 border-black p-3 text-center text-sm font-bold text-white hover:brightness-110 transition-all rounded-md"
              style={{
                backgroundColor: '#FF6B35',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
              }}
            >
              Challenge @{userScore.username} Directly
            </button>
            
            <button
              type="button"
              onClick={() => handleTagFriend(userScore)}
              className="w-full border-2 border-gray-300 p-3 text-center text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all rounded-md"
              style={{
                backgroundColor: 'white',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
              }}
            >
              Start Network Score Battle
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
