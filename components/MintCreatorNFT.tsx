'use client'

import { useEffect, useState } from 'react'
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

// NFT Contract Address (deployed on Base mainnet)
const CONTRACT_ADDRESS = '0x008b89E347471a27D4D1F1754Bf37CD02D13BEb3'
const BACKEND_API_URL = 'https://buzzfunbackend.buzzdotfun.workers.dev'

// NFT Contract ABI (minimal for minting)
const NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'overallScore', type: 'uint256' },
      { name: 'engagement', type: 'uint256' },
      { name: 'consistency', type: 'uint256' },
      { name: 'growth', type: 'uint256' },
      { name: 'quality', type: 'uint256' },
      { name: 'network', type: 'uint256' },
      { name: 'metadataURI', type: 'string' },
    ],
    name: 'mintCreatorNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * Store NFT token mapping in backend after successful mint
 */
const storeNFTMetadata = async (
  tokenId: number,
  fid: number,
  contractAddress: string,
  ownerAddress: string,
) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/nft/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: Number.parseInt(tokenId.toString()),
        fid: Number.parseInt(fid.toString()),
        contractAddress: contractAddress,
        ownerAddress: ownerAddress,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to store NFT metadata')
    }

    const result = await response.json()
    console.log('✅ NFT metadata stored:', result.metadataUrl)
    return result
  } catch (error) {
    console.error('❌ Failed to store NFT metadata:', error)
    throw error
  }
}

/**
 * Preview what the NFT will look like before minting
 */
const previewNFTMetadata = async (fid: number) => {
  try {
    const scoreResponse = await fetch(
      `${BACKEND_API_URL}/api/score/creator/${fid}`,
    )
    const scoreData = await scoreResponse.json()

    if (!scoreData.success) {
      throw new Error('No creator score found')
    }

    return {
      canMint: true,
      preview: {
        name: 'Buzz Creator Score NFT',
        description: `Creator Score NFT for ${scoreData.data.username || 'User'} with score ${scoreData.data.overallScore}/100`,
        tier: scoreData.data.tierInfo.tier,
        score: scoreData.data.overallScore,
        username: scoreData.data.username,
        pfpUrl: scoreData.data.pfpUrl,
      },
    }
  } catch (error) {
    return {
      canMint: false,
      error: 'User must have a creator score to mint NFT',
    }
  }
}

/**
 * Handle minting errors with user-friendly messages
 */
const handleMintError = (error: Error, fid: number) => {
  if (error.message.includes('Creator score not found')) {
    return {
      title: 'Score Required',
      message: `FID ${fid} doesn't have a creator score yet. Please ensure the user has activity on Farcaster and try again later.`,
      action: 'Check Score',
    }
  }

  if (error.message.includes('Invalid token ID')) {
    return {
      title: 'Invalid Token',
      message:
        'There was an issue with the token ID. Please try minting again.',
      action: 'Retry',
    }
  }

  return {
    title: 'Minting Failed',
    message: 'Unable to mint NFT. Please check your connection and try again.',
    action: 'Retry',
  }
}

interface MintCreatorNFTProps {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

export function MintCreatorNFT({
  className = '',
  children,
  style,
}: MintCreatorNFTProps) {
  console.log('🔧 MintCreatorNFT component rendering...')

  const { isEthProviderAvailable } = useFrame()
  const { isConnected, chainId, address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { scoreData, user } = useCreatorScore()
  const [mintingState, setMintingState] = useState<
    'idle' | 'minting' | 'storing' | 'success' | 'error'
  >('idle')

  // Debug: Log when minting state changes
  console.log('🎯 Current mintingState:', mintingState)
  console.log('📋 Component props:', { className, children, style })
  const [errorMessage, setErrorMessage] = useState<string>('')

  const canMint = scoreData && user?.fid && scoreData.overallScore >= 1

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Handle successful transaction
  useEffect(() => {
    console.log('🔄 Transaction effect triggered:', {
      isConfirmed,
      hash: !!hash,
      userFid: user?.fid,
      address: !!address,
    })

    if (!isConfirmed || !hash || !user?.fid || !address) return

    const handleTransactionSuccess = async () => {
      try {
        console.log('📦 Setting state to storing...')
        setMintingState('storing')

        // Store metadata in backend
        const response = await fetch(`${BACKEND_API_URL}/api/nft/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fid: user.fid,
            address,
            tokenId: '1',
            transactionHash: hash,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('✅ Metadata stored successfully')
        setMintingState('success')
      } catch (error) {
        console.error('❌ Failed to store metadata:', error)
        setMintingState('error')
      }
    }

    handleTransactionSuccess()
  }, [isConfirmed, hash, user?.fid, address])

  const handleMintNFT = async () => {
    console.log('🚀 Starting NFT minting process...')
    console.log('📊 Score data:', scoreData)
    console.log('👤 Address:', address)
    console.log('🔗 Contract address:', CONTRACT_ADDRESS)

    try {
      if (!isEthProviderAvailable) {
        console.log('❌ Wallet not available via Warpcast')
        alert('Wallet connection only available via Warpcast')
        return
      }

      if (!isConnected) {
        console.log('❌ Wallet not connected, attempting to connect...')
        connect({ connector: miniAppConnector() })
        return
      }

      if (chainId !== base.id) {
        console.log('❌ Wrong network, switching to Base mainnet...')
        switchChain({ chainId: base.id })
        return
      }

      if (!scoreData || !user?.fid || !address) {
        console.error('❌ Missing required data:', {
          scoreData: !!scoreData,
          userFid: user?.fid,
          address: !!address,
        })
        alert('Please calculate your score first and connect your wallet')
        return
      }

      console.log('⏳ Setting minting state to "minting"')
      setMintingState('minting')

      const mintArgs = [
        address,
        BigInt(scoreData.overallScore),
        BigInt(scoreData.components.engagement),
        BigInt(scoreData.components.consistency),
        BigInt(scoreData.components.growth),
        BigInt(scoreData.components.quality),
        BigInt(scoreData.components.network),
        `https://buzzfunbackend.buzzdotfun.workers.dev/api/nft/metadata/${user.fid}`,
      ] as const

      console.log('📝 Mint arguments:', mintArgs)

      // Call the contract mint function
      console.log('📞 Calling writeContract...')
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mintCreatorNFT',
        args: mintArgs,
      })
    } catch (error: any) {
      console.error('❌ Minting failed with error:', error)
      console.error('📋 Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      })
      setMintingState('error')
    }
  }

  const getButtonText = () => {
    if (mintingState === 'storing') return 'Storing Metadata...'
    if (mintingState === 'success') return 'NFT Minted Successfully!'
    if (mintingState === 'error') return 'Minting Failed'
    if (isConfirming) return 'Confirming Transaction...'
    if (isPending) return 'Minting NFT...'
    if (isConfirmed) return 'Processing...'
    if (!isEthProviderAvailable) return 'Wallet Unavailable'
    if (!isConnected) return 'Connect Wallet'
    if (chainId !== base.id) return 'Switch to Base'
    if (!scoreData) return 'Calculate Score First'
    if (!canMint) return 'Score Required'
    return children || 'Mint Creator NFT'
  }

  // Debug logging for button state
  console.log('🔍 Button state debug:', {
    isPending,
    isConfirming,
    isEthProviderAvailable,
    scoreData: !!scoreData,
    canMint,
    mintingState,
    isConnected,
    chainId,
    baseChainId: base.id,
  })

  const isDisabled =
    isPending ||
    isConfirming ||
    !isEthProviderAvailable ||
    !scoreData ||
    !canMint ||
    mintingState === 'storing'

  return (
    <button
      type="button"
      className={`border-4 border-black p-4 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-xl disabled:opacity-50 ${className}`}
      style={{
        backgroundColor:
          mintingState === 'success'
            ? '#10B981'
            : mintingState === 'error'
              ? '#EF4444'
              : '#4D61F4',
        boxShadow: '8px 8px 0px rgba(0,0,0,1)',
        ...style,
      }}
      onClick={handleMintNFT}
      disabled={isDisabled}
    >
      {getButtonText()}
    </button>
  )
}
