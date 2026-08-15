export interface Task {
  id: string
  title: string
  title_ru?: string
  description: string
  description_ru?: string
  reward: number          // Stars reward
  rewardType: 'stars' | 'ton'
  type: 'social' | 'invite' | 'daily' | 'special'
  link?: string
  completed: boolean
  icon?: string
}
