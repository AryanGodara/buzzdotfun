'use client'

import { SimpleNFTMint } from '@/components/SimpleNFTMint'

export function TransactionCTA() {
  return (
    <div className="w-full">
      <SimpleNFTMint className="w-full border-4 border-black p-4 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-xl disabled:opacity-50">
        Mint Score NFT
      </SimpleNFTMint>
    </div>
  )
}
