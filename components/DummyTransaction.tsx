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
const TRANSFER_AMOUNT = '0.000001' // 0.000001 ETH

export function DummyTransaction() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const {
    data: hash,
    sendTransaction,
    isPending,
    isSuccess,
  } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  const handleDummyTransaction = async () => {
    try {
      sendTransaction({
        to: TARGET_ADDRESS,
        value: parseEther(TRANSFER_AMOUNT),
      })
    } catch (error) {
      console.error('Transaction failed:', error)
    }
  }

  if (!isEthProviderAvailable) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-600">
          Wallet connection only available via Warpcast
        </p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg">
        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={() => connect({ connector: miniAppConnector() })}
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  if (chainId !== base.id) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg">
        <p className="text-sm text-gray-600 mb-3">
          Please switch to Base Mainnet network
        </p>
        <button
          type="button"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={() => switchChain({ chainId: base.id })}
        >
          Switch to Base Mainnet
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="w-full border-4 border-black p-4 text-center text-base font-bold text-black hover:bg-gray-100 transition-all rounded-xl disabled:opacity-50"
      style={{
        backgroundColor: 'white',
        boxShadow: '8px 8px 0px rgba(0,0,0,1)',
      }}
      onClick={handleDummyTransaction}
      disabled={isPending}
    >
      {isSuccess
        ? 'Pool Joined!'
        : isPending
          ? 'Processing...'
          : 'Join Creator Pool'}
    </button>
  )
}
