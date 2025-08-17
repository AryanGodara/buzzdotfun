'use client'

import { Home, TrendingUp, CreditCard, UserSearch } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      disabled: false,
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: TrendingUp,
      disabled: false,
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: CreditCard,
      disabled: false,
    },
    {
      id: 'search',
      label: 'Find Score',
      icon: UserSearch,
      disabled: false,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isDisabled = tab.disabled

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{tab.label}</span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
