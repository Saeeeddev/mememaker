import { useState, useEffect } from 'react'
import type { Task } from '@/types/task'

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Подписаться на @RabbitsGift', description: 'Подпишитесь на наш основной канал', reward: 0.1, rewardType: 'ton', type: 'social', completed: false, link: 'https://t.me/RabbitsGift' },
  { id: '2', title: 'Вступить в @RabbitsChat', description: 'Присоединяйтесь к нашему чату', reward: 0.05, rewardType: 'ton', type: 'social', completed: false, link: 'https://t.me/RabbitsChat' },
  { id: '3', title: 'Qcold crypto', description: 'Follow our crypto partner', reward: 0.1, rewardType: 'ton', type: 'social', completed: false, link: 'https://t.me/qcoldcrypto' },
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
