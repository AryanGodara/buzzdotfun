'use client'

import { useState, useEffect } from 'react'
import { base } from 'wagmi/chains'
import {
  useAccount,
  useConnect,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { useFrame } from '@/components/farcaster-provider'
import { useCreatorScore } from '@/components/CreatorScoreProvider'
import { NFTSuccessModal } from './NFTSuccessModal'

// BuzzCreatorNFT Contract ABI - mintCreatorScore function
const MINT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'overallScore', type: 'uint256' },
      { name: 'engagement', type: 'uint256' },
      { name: 'consistency', type: 'uint256' },
      { name: 'growth', type: 'uint256' },
      { name: 'quality', type: 'uint256' },
      { name: 'network', type: 'uint256' },
      { name: 'fid', type: 'uint256' },
      { name: 'username', type: 'string' },
    ],
    name: 'mintCreatorScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const CONTRACT_ADDRESS = '0x008b89E347471a27D4D1F1754Bf37CD02D13BEb3'

interface SimpleNFTMintProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onViewProfile?: () => void
}

export function SimpleNFTMint({
  className = '',
  style,
  children,
  onViewProfile,
}: SimpleNFTMintProps) {
  const [status, setStatus] = useState<
    'idle' | 'minting' | 'confirming' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [transactionHash, setTransactionHash] = useState<string>('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { isEthProviderAvailable } = useFrame()
  const { isConnected, chainId, address } = useAccount()
  const { connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract()
  const { scoreData, user } = useCreatorScore()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  console.log('🔧 SimpleNFTMint render:', {
    isEthProviderAvailable,
    isConnected,
    chainId,
    address,
    scoreData: !!scoreData,
    userFid: user?.fid,
    status,
    hash,
    isConfirming,
    isConfirmed,
    writeError: writeError?.message,
    receiptError: receiptError?.message,
  })

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      console.error('❌ Write contract error:', writeError)
      setStatus('error')
      setErrorMessage(writeError.message || 'Failed to initiate transaction')
    }
  }, [writeError])

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('❌ Receipt error:', receiptError)
      setStatus('error')
      setErrorMessage(receiptError.message || 'Transaction failed')
    }
  }, [receiptError])

  // Handle transaction state changes
  useEffect(() => {
    if (hash) {
      console.log('📝 Transaction hash received:', hash)
      setTransactionHash(hash)
      setStatus('confirming')
    }
  }, [hash])

  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('✅ Transaction confirmed!')
      handleTransactionSuccess(hash)
    }
  }, [isConfirmed, hash])

  const handleTransactionSuccess = async (txHash: string) => {
    try {
      console.log('🎉 NFT minted successfully! Hash:', txHash)
      console.log('🔗 View on BaseScan:', `https://basescan.org/tx/${txHash}`)

      // Store NFT data in localStorage for profile page
      const nftData = {
        transactionHash: txHash,
        contractAddress: CONTRACT_ADDRESS,
        timestamp: Date.now(),
        scoreData: scoreData,
        userFid: user?.fid,
        username: user?.username,
      }

      const existingNFTs = JSON.parse(
        localStorage.getItem('mintedNFTs') || '[]',
      )
      existingNFTs.push(nftData)
      localStorage.setItem('mintedNFTs', JSON.stringify(existingNFTs))

      // Store metadata in backend
      if (user?.fid) {
        console.log('💾 Storing NFT metadata for FID:', user.fid)
        const response = await fetch(
          'https://buzzfunbackend.buzzdotfun.workers.dev/api/nft/store',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fid: user.fid,
              transactionHash: txHash,
              contractAddress: CONTRACT_ADDRESS,
            }),
          },
        )

        if (response.ok) {
          console.log('✅ Metadata stored successfully')
        } else {
          console.warn('⚠️ Failed to store metadata:', response.status)
        }
      }

      setStatus('success')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('❌ Error in post-mint processing:', error)
      setStatus('success') // Still show success since mint worked
      setShowSuccessModal(true)
    }
  }

  const handleMint = async () => {
    console.log('🚀 MINT BUTTON CLICKED - handleMint function called!')
    console.log('📊 Current component state:', {
      status,
      isConnected,
      chainId,
      baseChainId: base.id,
      hasScoreData: !!scoreData,
      userFid: user?.fid,
      address,
    })
    setErrorMessage('')

    try {
      // Check wallet availability
      if (!isEthProviderAvailable) {
        setErrorMessage('Wallet only available via Warpcast')
        return
      }

      // Connect wallet if needed
      if (!isConnected) {
        console.log('🔗 Connecting wallet...')
        await connect({ connector: miniAppConnector() })
        return
      }

      // Switch to Base if needed
      if (chainId !== base.id) {
        console.log('🔄 Switching to Base network...')
        await switchChain({ chainId: base.id })
        return
      }

      // Check requirements
      if (!scoreData) {
        setErrorMessage('Please calculate your creator score first')
        return
      }

      if (!user?.fid) {
        setErrorMessage('User FID not available')
        return
      }

      if (!address) {
        setErrorMessage('Wallet address not available')
        return
      }

      console.log('✅ All checks passed, starting mint...')
      try {
        console.log('⏳ Setting status to minting...')
        setStatus('minting')
        setErrorMessage('')

        // Truncate decimal scores to integers for BigInt conversion
        const truncatedOverallScore = Math.floor(scoreData.overallScore)
        const truncatedEngagement = Math.floor(scoreData.components.engagement)
        const truncatedConsistency = Math.floor(
          scoreData.components.consistency,
        )
        const truncatedGrowth = Math.floor(scoreData.components.growth)
        const truncatedQuality = Math.floor(scoreData.components.quality)
        const truncatedNetwork = Math.floor(scoreData.components.network)

        console.log('🔢 Truncated scores:', {
          overall: truncatedOverallScore,
          engagement: truncatedEngagement,
          consistency: truncatedConsistency,
          growth: truncatedGrowth,
          quality: truncatedQuality,
          network: truncatedNetwork,
        })

        const mintArgs = [
          address,
          BigInt(truncatedOverallScore),
          BigInt(truncatedEngagement),
          BigInt(truncatedConsistency),
          BigInt(truncatedGrowth),
          BigInt(truncatedQuality),
          BigInt(truncatedNetwork),
          BigInt(user.fid),
          user.username || `user-${user.fid}`,
        ] as const

        console.log('📝 Final mint arguments:', mintArgs)
        console.log('📞 Calling writeContract with ABI and args...')

        const result = writeContract({
          address: CONTRACT_ADDRESS,
          abi: MINT_ABI,
          functionName: 'mintCreatorScore',
          args: mintArgs,
        })

        console.log('✅ writeContract result:', result)
        console.log(
          '✅ writeContract call initiated - waiting for transaction hash...',
        )

        // Add a timeout to detect if the transaction is stuck
        setTimeout(() => {
          if (status === 'minting' && !hash) {
            console.warn(
              '⚠️ Transaction seems stuck - no hash received after 10 seconds',
            )
            console.log('🔍 Current state:', {
              status,
              hash,
              isPending,
              writeError,
            })
            setStatus('error')
            setErrorMessage(
              'Transaction timed out. Please check your wallet and try again.',
            )
          }
        }, 10000)
      } catch (error) {
        console.error('❌ Error in handleMint:', error)
        setStatus('error')
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to mint NFT',
        )
      }
    } catch (error) {
      console.error('❌ Outer handleMint error:', error)
      setStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to mint NFT',
      )
    }
  }

  const getButtonText = () => {
    if (status === 'minting' || isPending) return 'Minting...'
    if (status === 'confirming' || isConfirming) return 'Confirming...'
    if (status === 'success') return 'Mint Another NFT'
    if (status === 'error') return 'Try Again'
    if (!isEthProviderAvailable) return 'Wallet Unavailable'
    if (!isConnected) return 'Connect Wallet'
    if (chainId !== base.id) return 'Switch to Base'
    if (!scoreData) return 'Calculate Score First'
    return children || 'Mint NFT'
  }

  const isDisabled =
    status === 'minting' || isPending || status === 'confirming' || isConfirming

  // Reset status if it gets stuck
  useEffect(() => {
    if (status === 'minting' && !isPending && !hash && !writeError) {
      console.log('🔄 Resetting stuck minting status')
      setStatus('idle')
    }
  }, [status, isPending, hash, writeError])

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleMint}
        disabled={isDisabled}
        className={`${className} disabled:opacity-50`}
        style={style}
      >
        {getButtonText()}
      </button>

      {errorMessage && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {errorMessage}
        </div>
      )}

      {status === 'confirming' && transactionHash && (
        <div className="text-blue-500 text-sm p-2 bg-blue-50 rounded space-y-2">
          <div>Confirming transaction...</div>
          <div className="text-xs">
            <div>
              Hash: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
            </div>
            <a
              href={`https://basescan.org/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View on BaseScan
            </a>
          </div>
        </div>
      )}

      <NFTSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transactionHash={transactionHash}
        onViewProfile={onViewProfile}
      />
    </div>
  )
}
