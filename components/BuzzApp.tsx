'use client'

import { ClientOnlyWallet } from '@/components/ClientOnlyWallet'
import Link from 'next/link'
import { ScoreDisplay } from '@/components/ScoreDisplay'
import { ScoreLoading } from '@/components/ScoreLoading'
import { ComingSoonPage } from '@/components/ComingSoonPage'
import { LeaderboardPage } from '@/components/LeaderboardPage'
import { FindScorePage } from '@/components/FindScorePage'
import { BottomNavigation } from '@/components/BottomNavigation'
import { useCreatorScore } from '@/components/CreatorScoreProvider'
import { useCTAFrameShare } from '@/components/CTAFrame'
import { DummyTransaction } from '@/components/DummyTransaction'
import { TransactionCTA } from '@/components/TransactionCTA'
import Navbar from '@/components/Home/Navbar'
import { UserProfile } from '@/components/UserProfile'
import { sdk } from '@farcaster/miniapp-sdk'

// Component to display app name/logo
function AppHeader({ onHomeClick }: { onHomeClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onHomeClick}
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <img
        src="/logo.png"
        alt="Logo"
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="text-xl font-bold">buzz.fun</span>
    </button>
  )
}

// Main app component with integrated creator score functionality
export function BuzzApp() {
  const {
    scoreData,
    scoreLoading,
    scoreError,
    showScore,
    showLoading,
    activeTab,
    handleCalculateScore,
    handleLoadingComplete,
    handleHomeClick,
    handleTabChange,
    user,
  } = useCreatorScore()

  const { shareScoreFrame } = useCTAFrameShare()

  const handleShareScore = async () => {
    if (scoreData) {
      await shareScoreFrame(scoreData.overallScore)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white overflow-x-hidden max-w-full">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <AppHeader onHomeClick={handleHomeClick} />
        <div className="flex items-center space-x-4">
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-20 flex flex-col min-h-[calc(100vh-80px)] max-w-full overflow-x-hidden">
        {activeTab === 'loans' ? (
          <ComingSoonPage />
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardPage />
        ) : activeTab === 'search' ? (
          <FindScorePage />
        ) : showLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <ScoreLoading onComplete={handleLoadingComplete} />
          </div>
        ) : !showScore ? (
          <>
            {/* Main Heading */}
            <div className="mt-6 mb-8 text-center">
              <h1
                className="text-3xl font-bold text-white mb-2"
                style={{
                  textShadow:
                    '4px 4px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black, 6px 6px 0px black',
                }}
              >
                CALCULATE YOUR CREATOR SCORE!
              </h1>
              <p className="text-sm text-white font-medium drop-shadow-lg">
                Join 2,847 creators who've unlocked better loan rates
              </p>
            </div>

            {!user?.fid && (
              <p className="mt-3 text-center text-red-300 text-sm font-medium drop-shadow-lg">
                Connect your Farcaster account first to calculate your score
              </p>
            )}

            {/* Spacer to push button to bottom */}
            <div className="flex-1" />

            {/* CTA and Calculate Buttons - Fixed at Bottom */}
            <div className="space-y-3 mb-4">
              <TransactionCTA className="w-full">
                Join Creator Pool
              </TransactionCTA>

              <button
                type="button"
                onClick={handleCalculateScore}
                disabled={scoreLoading || !user?.fid}
                className="block w-full border-4 border-black p-4 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#4D61F4',
                  boxShadow: '8px 8px 0px rgba(0,0,0,1)',
                }}
              >
                {scoreLoading
                  ? 'Calculating your vibes...'
                  : 'Show me my creator power!'}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-1">
            <div className="text-center mb-6" />

            {scoreError ? (
              <div className="text-red-500 text-center">
                <p className="mb-2 text-sm">
                  Failed to fetch your creator score
                </p>
                <button
                  type="button"
                  onClick={handleCalculateScore}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : scoreData ? (
              <div className="w-full text-center">
                <ScoreDisplay scoreData={scoreData} />

                <p className="text-sm mb-4 font-bold text-center text-white drop-shadow-lg">
                  Join 2,847 creators who've unlocked better loan rates
                </p>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* Floating Bottom Buttons - Only show when score is displayed and not on loans tab */}
      {showScore && !scoreError && activeTab !== 'loans' && (
        <div className="fixed bottom-16 left-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={handleShareScore}
            className="flex-1 border-2 border-black py-2 px-4 text-center text-sm font-bold text-white hover:brightness-110 transition-all rounded-lg"
            style={{
              backgroundColor: '#FF6B35',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.8)',
            }}
          >
            Share Score
          </button>
          <div className="flex-1">
            <DummyTransaction />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
