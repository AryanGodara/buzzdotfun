'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useFrame } from '@/components/farcaster-provider'
import type { CreatorScore } from '@/lib/api'

interface CreatorScoreContextType {
  // State
  scoreData: CreatorScore | null
  scoreLoading: boolean
  scoreError: string | null
  showScore: boolean
  showLoading: boolean
  activeTab: string

  // Actions
  fetchCreatorScore: () => Promise<void>
  handleCalculateScore: () => Promise<void>
  handleLoadingComplete: () => Promise<void>
  handleHomeClick: () => void
  handleTabChange: (tab: string) => void

  // User data
  user: { fid: number; username?: string; displayName?: string } | undefined
  isSDKLoaded: boolean
}

const CreatorScoreContext = createContext<CreatorScoreContextType | undefined>(
  undefined,
)

export function useCreatorScore() {
  const context = useContext(CreatorScoreContext)
  if (context === undefined) {
    throw new Error(
      'useCreatorScore must be used within a CreatorScoreProvider',
    )
  }
  return context
}

interface CreatorScoreProviderProps {
  children: ReactNode
}

export function CreatorScoreProvider({ children }: CreatorScoreProviderProps) {
  const { isSDKLoaded, context } = useFrame()
  const user = context?.user

  const [scoreData, setScoreData] = useState<CreatorScore | null>(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState<string | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // Generate mock data when backend is unavailable
  const generateMockScore = (fid: number): CreatorScore => {
    const fidSeed = fid % 100
    const baseScore = 60 + (fidSeed % 40) // Score between 60-100
    return {
      fid,
      overallScore: baseScore,
      tier:
        baseScore >= 90
          ? 'AAA'
          : baseScore >= 80
            ? 'AA'
            : baseScore >= 70
              ? 'A'
              : baseScore >= 60
                ? 'BBB'
                : 'BB',
      tierInfo: {
        tier:
          baseScore >= 90
            ? 'AAA'
            : baseScore >= 80
              ? 'AA'
              : baseScore >= 70
                ? 'A'
                : baseScore >= 60
                  ? 'BBB'
                  : 'BB',
        minScore:
          baseScore >= 90
            ? 90
            : baseScore >= 80
              ? 80
              : baseScore >= 70
                ? 70
                : baseScore >= 60
                  ? 60
                  : 50,
        maxScore:
          baseScore >= 90
            ? 100
            : baseScore >= 80
              ? 89
              : baseScore >= 70
                ? 79
                : baseScore >= 60
                  ? 69
                  : 59,
        description:
          baseScore >= 90
            ? 'Exceptional'
            : baseScore >= 80
              ? 'Excellent'
              : baseScore >= 70
                ? 'Very Good'
                : baseScore >= 60
                  ? 'Good'
                  : 'Fair',
        percentile:
          baseScore >= 90
            ? 'Top 5%'
            : baseScore >= 80
              ? 'Top 10%'
              : baseScore >= 70
                ? 'Top 20%'
                : baseScore >= 60
                  ? 'Top 40%'
                  : 'Top 60%',
      },
      percentileRank: baseScore,
      components: {
        engagement: 60 + ((fidSeed * 2) % 35),
        consistency: 65 + ((fidSeed * 3) % 30),
        growth: 55 + ((fidSeed * 4) % 40),
        quality: 70 + ((fidSeed * 5) % 25),
        network: 60 + ((fidSeed * 6) % 35),
      },
      timestamp: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  const fetchCreatorScore = async (): Promise<void> => {
    if (!user?.fid) {
      setScoreError('No user FID available')
      return
    }

    setScoreLoading(true)
    setScoreError(null)

    const apiUrl = `https://buzzfunbackend.buzzdotfun.workers.dev/api/score/creator/${user.fid}`
    console.log('🚀 Making backend API call to:', apiUrl)
    console.log('📊 Fetching creator score for FID:', user.fid)

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(3000),
      })

      console.log('📡 Backend API response status:', response.status)
      console.log(
        '📡 Response headers:',
        Object.fromEntries(response.headers.entries()),
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch creator score: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Backend API response data:', data)

      if (data?.success && data?.data) {
        console.log('🎯 Using real backend data:', {
          score: data.data.overallScore,
          tier: data.data.tier,
          components: data.data.components,
        })
        setScoreData(data.data)
        setScoreLoading(false)
        setShowScore(true)
      } else {
        console.log('⚠️ Backend returned unsuccessful response, using mock data')
        setScoreData(generateMockScore(user.fid))
        setScoreLoading(false)
        setShowScore(true)
      }
    } catch (err) {
      console.log('❌ Backend API call failed:', err)
      console.log('🔄 Using mock data for FID:', user.fid)
      setScoreData(generateMockScore(user.fid))
      setScoreLoading(false)
      setShowScore(true)
    }
  }

  const handleCalculateScore = async (): Promise<void> => {
    setShowLoading(true)
    // The loading component will handle the timeout and call onComplete
  }

  const handleLoadingComplete = async (): Promise<void> => {
    setShowLoading(false)
    await fetchCreatorScore()
  }

  const handleHomeClick = (): void => {
    setShowScore(false)
    setShowLoading(false)
    setScoreData(null)
    setScoreError(null)
    setActiveTab('home')
  }

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab)
    if (tab === 'home') {
      setShowScore(false)
      setShowLoading(false)
    }
    // Reset score display when switching to other tabs
    if (tab !== 'home') {
      setShowScore(false)
      setShowLoading(false)
    }
  }

  const value: CreatorScoreContextType = {
    // State
    scoreData,
    scoreLoading,
    scoreError,
    showScore,
    showLoading,
    activeTab,

    // Actions
    fetchCreatorScore,
    handleCalculateScore,
    handleLoadingComplete,
    handleHomeClick,
    handleTabChange,

    // User data
    user,
    isSDKLoaded,
  }

  return (
    <CreatorScoreContext.Provider value={value}>
      {children}
    </CreatorScoreContext.Provider>
  )
}
