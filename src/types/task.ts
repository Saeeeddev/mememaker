export interface Task {
  id: string
  title: string
  title_ru?: string
  description: string
  description_ru?: string
  reward: number          // Reward amount
  rewardType: 'stars' | 'ton' | 'energy'
  type: 'social' | 'invite' | 'daily' | 'special'
  link?: string
  completed: boolean
  icon?: string
}
