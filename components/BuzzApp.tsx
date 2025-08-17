"use client";

// import { FarcasterProfile } from '@/components/FarcasterProfile'; // Unused - moved to .unused
// import { FarcasterUserInfo } from '@/components/FarcasterUserInfo'; // Unused - moved to .unused
import { ClientOnlyWallet } from "@/components/ClientOnlyWallet";
import Link from 'next/link';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { Confetti } from '@/components/Confetti';
import { useCreatorScore } from '@/components/CreatorScoreProvider';
import { sdk } from "@farcaster/miniapp-sdk"

// Component to display app name/logo
function AppHeader({ onHomeClick }: { onHomeClick: () => void }) {
  return (
    <button onClick={onHomeClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
      <img 
        src="/logo.png"
        alt="Logo" 
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="text-xl font-bold">buzz.fun</span>
    </button>
  );
}

// Main app component with integrated creator score functionality
export function BuzzApp() {
  const {
    metrics,
    metricsLoading,
    metricsError,
    showScore,
    showConfetti,
    calculateScore,
    handleCalculateScore,
    handleHomeClick,
    user
  } = useCreatorScore();

  const handleShareScore = async () => {
    const score = calculateScore();
    const shareText = `Just calculated my Creator Score: ${score}/100! 🚀\n\nGet better loan rates based on your social activity at buzz.fun 💰\n\n#CreatorEconomy #DeFi`;
    
    try {
      await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`);
    } catch (error) {
      console.error('Failed to compose cast:', error);
    }
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#D7FF7B'}}>
      <header className="flex justify-between items-center p-4 border-b border-gray-200">
        <AppHeader onHomeClick={handleHomeClick} />
        <ClientOnlyWallet />
      </header>

      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full flex flex-col">
        {!showScore ? (
          <>
            {/* Main Heading */}
            <div className="mt-6 mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2" style={{textShadow: '4px 4px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black, 6px 6px 0px black'}}>
                CALCULATE YOUR CREATOR SCORE!
              </h1>
              <p className="text-sm text-gray-700">
                Join 2,847 creators who've unlocked better loan rates
              </p>
            </div>
            
            {!user?.fid && (
              <p className="mt-3 text-center text-red-500 text-sm">
                Connect your Farcaster account first to calculate your score
              </p>
            )}

            {/* Spacer to push button to bottom */}
            <div className="flex-1"></div>

            {/* Calculate Button - Fixed at Bottom */}
            <div className="mb-4">
              <button
                onClick={handleCalculateScore}
                disabled={metricsLoading || !user?.fid}
                className="block w-full border-2 border-black p-4 text-center text-lg font-bold text-white hover:brightness-110 transition-all rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#4D61F4', boxShadow: '3px 3px 0px rgba(0,0,0,0.3)'}}
              >
                {metricsLoading ? "Calculating your vibes..." : "Show me my creator power!"}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <Confetti trigger={showConfetti} />
            <div className="text-center mb-6">
            </div>

            {metricsError ? (
              <div className="text-red-500 text-center">
                <p className="mb-2 text-sm">Failed to fetch your metrics</p>
                <button 
                  onClick={handleCalculateScore}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="w-full text-center">
                <MetricsDisplay metrics={metrics} score={score} />
                
                <div className="border-2 border-black p-4 mb-4 rounded-md" style={{backgroundColor: '#D7FF7B', boxShadow: '3px 3px 0px rgba(0,0,0,0.3)'}}>
                  <h3 className="text-base font-bold mb-3 text-white" style={{textShadow: '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black'}}>TODAY'S TOP CREATORS</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-black pb-1">
                      <span className="font-bold">@alice.eth</span>
                      <span className="font-black">94</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black pb-1">
                      <span className="font-bold">@bob.lens</span>
                      <span className="font-black">91</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">@charlie</span>
                      <span className="font-black">89</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm mb-4 font-bold text-center">
                  Join {Math.floor(Math.random() * 5000)} creators who've unlocked better loan rates
                </p>
                
                <div className="text-center mb-4 border-2 border-black p-3 rounded-md" style={{backgroundColor: '#D7FF7B'}}>
                  <p className="text-sm font-bold mb-1">
                    {Math.floor(Math.random() * 10)} friends are already playing
                  </p>
                  <p className="text-gray-800 text-xs font-medium">
                    @friend1 @friend2 @friend3
                  </p>
                </div>
                
                <button
                  onClick={handleShareScore}
                  className="w-full border-2 border-black p-3 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-md mb-3"
                  style={{backgroundColor: '#FF6B35', boxShadow: '3px 3px 0px rgba(0,0,0,0.3)'}}
                >
                  🚀 SHARE MY SCORE
                </button>
                
                <Link href="/waitlist">
                  <button
                    className="w-full border-2 border-black p-3 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-md mb-4"
                    style={{backgroundColor: '#4D61F4', boxShadow: '3px 3px 0px rgba(0,0,0,0.3)'}}
                  >
                    BIG THINGS COMING SOON
                  </button>
                </Link>
                
              </div>
            )}
          </div>
        )}
        
      </main>

      <footer className="mt-auto py-4 flex justify-center w-full border-t border-gray-100">
        <div className="text-[var(--app-foreground-muted)] text-xs">
          Somurie ~Aryan
        </div>
      </footer>
    </div>
  );
}
