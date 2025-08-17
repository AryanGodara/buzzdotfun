'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useFrame } from '@/components/farcaster-provider'
import { UserMetrics } from '@/lib/hooks/useFarcaster'

interface CreatorScoreContextType {
  // State
  metrics: UserMetrics | null
  metricsLoading: boolean
  metricsError: string | null
  showScore: boolean
  showLoading: boolean
  activeTab: string

  // Actions
  calculateScore: () => number
  fetchUserMetrics: () => Promise<void>
  handleCalculateScore: () => Promise<void>
  handleLoadingComplete: () => Promise<void>
  handleHomeClick: () => void
  handleTabChange: (tab: string) => void

  // User data
  user: any
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

  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // Calculate a score based on metrics
  const calculateScore = (): number => {
    if (!metrics) return 0

    if (
      metrics.followers === undefined ||
      metrics.engagement_rate === undefined
    ) {
      return 0
    }

    const followersWeight = 0.3
    const engagementWeight = 0.7

    const followerScore = Math.min(100, metrics.followers / 10)
    const engagementScore = metrics.engagement_rate * 100

    const finalScore = Math.round(
      followerScore * followersWeight + engagementScore * engagementWeight,
    )

    return finalScore
  }

  // Generate mock data when backend is unavailable
  const generateMockMetrics = (fid: number): UserMetrics => {
    const fidSeed = fid % 100
    return {
      followers: 100 + fidSeed * 7,
      following: 50 + fidSeed * 3,
      casts: 30 + fidSeed * 2,
      reactions: 200 + fidSeed * 15,
      replies: 50 + fidSeed * 4,
      recasts: 30 + fidSeed * 3,
      engagement_rate: 0.05 + fidSeed / 1000,
      last_updated: new Date().toISOString(),
    }
  }

  const fetchUserMetrics = async (): Promise<void> => {
    if (!user?.fid) {
      setMetricsError('No user FID available')
      return
    }

    setMetricsLoading(true)
    setMetricsError(null)

    try {
      const response = await fetch(
        `http://localhost:4000/api/metrics/${user.fid}`,
        {
          signal: AbortSignal.timeout(3000),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`)
      }

      const data = await response.json()

      if (data?.metrics) {
        setMetrics(data.metrics)
        setMetricsLoading(false)
        setShowScore(true)
      } else {
        setMetrics(generateMockMetrics(user.fid))
        setMetricsLoading(false)
        setShowScore(true)
      }
    } catch (err) {
      console.error('Error fetching user metrics:', err)
      setMetrics(generateMockMetrics(user.fid))
      setMetricsLoading(false)
      setShowScore(true)
    }
  }

  const handleCalculateScore = async (): Promise<void> => {
    setShowLoading(true)
    // The loading component will handle the timeout and call onComplete
  }

  const handleLoadingComplete = async (): Promise<void> => {
    setShowLoading(false)
    await fetchUserMetrics()
  }

  const handleHomeClick = (): void => {
    setShowScore(false)
    setShowLoading(false)
    setMetrics(null)
    setMetricsError(null)
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
    metrics,
    metricsLoading,
    metricsError,
    showScore,
    showLoading,
    activeTab,

    // Actions
    calculateScore,
    fetchUserMetrics,
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
