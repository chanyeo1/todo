export type Priority = 'high' | 'medium' | 'low'

export type FilterStatus = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  category: string
  createdAt: string
  order: number
}

export interface FilterState {
  status: FilterStatus
  priority: Priority | 'all'
  category: string
  search: string
}
