'use client'

import { FrameProvider } from '@/components/farcaster-provider'
import { WalletProvider } from '@/components/wallet-provider'
import { CreatorScoreProvider } from '@/components/CreatorScoreProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <FrameProvider>
        <CreatorScoreProvider>
          {children}
        </CreatorScoreProvider>
      </FrameProvider>
    </WalletProvider>
  )
}
