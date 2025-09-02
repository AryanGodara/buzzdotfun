'use client'

import { parseEther } from 'viem'
import { base } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useSwitchChain,
} from 'wagmi'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { useFrame } from '@/components/farcaster-provider'

const TARGET_ADDRESS = '0x74637F06a8914beB5D00079681c48494FbccBdB9'
const TRANSFER_AMOUNT = '0.000004' // ~$0.01 worth of ETH (approximate)

interface TransactionCTAProps {
  className?: string
  children?: React.ReactNode
}

export function TransactionCTA({
  className = '',
  children,
}: TransactionCTAProps) {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, chainId } = useAccount()
  const { sendTransaction, isPending } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  const handleTransactionCTA = async () => {
    try {
      if (!isEthProviderAvailable) {
        alert('Wallet connection only available via Warpcast')
        return
      }

      if (!isConnected) {
        connect({ connector: miniAppConnector() })
        return
      }

      if (chainId !== base.id) {
        switchChain({ chainId: base.id })
        return
      }

      sendTransaction({
        to: TARGET_ADDRESS,
        value: parseEther(TRANSFER_AMOUNT),
      })
    } catch (error) {
      console.error('Transaction CTA failed:', error)
    }
  }

  const getButtonText = () => {
    if (isPending) return 'Joining Pool...'
    if (!isEthProviderAvailable) return 'Wallet Unavailable'
    if (!isConnected) return 'Connect Wallet'
    if (chainId !== base.id) return 'Switch Network'
    return children || 'Join Creator Pool'
  }

  return (
    <button
      type="button"
      className={`border-4 border-black p-4 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-xl disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: '#4D61F4',
        boxShadow: '8px 8px 0px rgba(0,0,0,1)',
      }}
      onClick={handleTransactionCTA}
      disabled={isPending || !isEthProviderAvailable}
    >
      {getButtonText()}
    </button>
  )
}
