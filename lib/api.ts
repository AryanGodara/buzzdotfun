// Backend API integration for Buzz Fun Creator Credit Rating
const API_BASE = 'https://buzzfunbackend.buzzdotfun.workers.dev/api'

// Types based on backend API documentation
export interface CreatorScore {
  fid: number
  overallScore: number
  tier: string
  tierInfo: {
    tier: string
    minScore: number
    maxScore: number
    description: string
    percentile: string
  }
  percentileRank: number
  components: {
    engagement: number
    consistency: number
    growth: number
    quality: number
    network: number
  }
  timestamp: string
  validUntil: string
}

export interface LeaderboardEntry {
  rank: number
  fid: number
  overallScore: number
  tier: string
  tierInfo: {
    tier: string
    minScore: number
    maxScore: number
    description: string
    percentile: string
  }
  percentileRank: number
  components: {
    engagement: number
    consistency: number
    growth: number
    quality: number
    network: number
  }
  timestamp: string
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  total: number
  generatedAt: string
  validUntil: string
  cacheDate: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Get individual creator score
export const getCreatorScore = async (
  fid: number,
): Promise<CreatorScore | null> => {
  try {
    const response = await fetch(`${API_BASE}/score/creator/${fid}`)
    const data: ApiResponse<CreatorScore> = await response.json()

    if (data.success && data.data) {
      return data.data
    }
    console.error('API returned error:', data.error)
    return null
  } catch (error) {
    console.error('Failed to fetch creator score:', error)
    return null
  }
}

// Get leaderboard (top 50 creators)
export const getLeaderboard = async (): Promise<LeaderboardResponse | null> => {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`)
    const data: ApiResponse<LeaderboardResponse> = await response.json()

    if (data.success && data.data) {
      return data.data
    }
    console.error('API returned error:', data.error)
    return null
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return null
  }
}

// Utility function to get tier color based on tier
export const getTierColor = (tier: string): string => {
  const colors: Record<string, string> = {
    AAA: '#10B981', // Green
    AA: '#059669', // Dark Green
    A: '#047857', // Darker Green
    BBB: '#3B82F6', // Blue
    BB: '#1D4ED8', // Dark Blue
    B: '#F59E0B', // Yellow
    C: '#F97316', // Orange
    D: '#EF4444', // Red
  }
  return colors[tier] || '#6B7280' // Default gray
}

// Utility function to get tier description
export const getTierDescription = (tier: string): string => {
  const descriptions: Record<string, string> = {
    AAA: 'Exceptional',
    AA: 'Excellent',
    A: 'Very Good',
    BBB: 'Good',
    BB: 'Fair',
    B: 'Below Average',
    C: 'Poor',
    D: 'Very Poor',
  }
  return descriptions[tier] || 'Unknown'
}

// Health check endpoint
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/health`)
    const data = await response.json()
    return data.status === 'ok'
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}
