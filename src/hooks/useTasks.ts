import { useState, useEffect } from 'react'
import type { Task } from '@/types/task'

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Subscribe to @MemeticChannel', description: 'Join our main channel', reward: 0.1, rewardType: 'ton', type: 'social', completed: false, link: 'https://t.me/MemeticChannel' },
  { id: '2', title: 'Join @MemeticChat', description: 'Join our community chat', reward: 0.05, rewardType: 'ton', type: 'social', completed: false, link: 'https://t.me/MemeticChat' },
  { id: '3', title: 'Follow on X', description: 'Follow us on X/Twitter', reward: 0.1, rewardType: 'ton', type: 'social', completed: false, link: 'https://x.com/Memetic' },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        // TODO: fetch('/api/tasks') — replace with real endpoint
        // TODO: fetch('/api/tasks') — replace with real endpoint
        setTasks(MOCK_TASKS)
      } catch (err) {
        setError('Failed to load tasks')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  return { tasks, loading, error }
}
