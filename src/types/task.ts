export interface Task {
  id: string
  title: string
  description: string
  reward: number          // Stars reward
  rewardType: 'stars' | 'ton'
  type: 'social' | 'invite' | 'daily' | 'special'
  link?: string
  completed: boolean
  icon?: string
}
