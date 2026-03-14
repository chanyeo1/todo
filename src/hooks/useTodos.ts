import { useState, useCallback, useMemo } from 'react'
import type { Todo, Priority, FilterState } from '../types'

const STORAGE_KEY = 'todos-app-v1'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  const persist = useCallback((updater: (prev: Todo[]) => Todo[]) => {
    setTodos((prev) => {
      const next = updater(prev)
      saveTodos(next)
      return next
    })
  }, [])

  const addTodo = useCallback(
    (text: string, priority: Priority, dueDate: string | null, category: string) => {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        priority,
        dueDate,
        category: category.trim() || '기타',
        createdAt: new Date().toISOString(),
        order: Date.now(),
      }
      persist((prev) => [todo, ...prev])
    },
    [persist],
  )

  const updateTodo = useCallback(
    (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      persist((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
    },
    [persist],
  )

  const deleteTodo = useCallback(
    (id: string) => {
      persist((prev) => prev.filter((t) => t.id !== id))
    },
    [persist],
  )

  const toggleTodo = useCallback(
    (id: string) => {
      persist((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      )
    },
    [persist],
  )

  const clearCompleted = useCallback(() => {
    persist((prev) => prev.filter((t) => !t.completed))
  }, [persist])

  const reorder = useCallback(
    (activeId: string, overId: string) => {
      persist((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId)
        const overIndex = prev.findIndex((t) => t.id === overId)
        if (activeIndex === -1 || overIndex === -1) return prev
        const next = [...prev]
        const [item] = next.splice(activeIndex, 1)
        next.splice(overIndex, 0, item)
        return next
      })
    },
    [persist],
  )

  const categories = useMemo(() => {
    const cats = new Set(todos.map((t) => t.category))
    return Array.from(cats).sort()
  }, [todos])

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted, reorder, categories }
}

export function useFilteredTodos(todos: Todo[], filter: FilterState) {
  return useMemo(() => {
    return todos.filter((todo) => {
      if (filter.status === 'active' && todo.completed) return false
      if (filter.status === 'completed' && !todo.completed) return false
      if (filter.priority !== 'all' && todo.priority !== filter.priority) return false
      if (filter.category && todo.category !== filter.category) return false
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (!todo.text.toLowerCase().includes(q) && !todo.category.toLowerCase().includes(q))
          return false
      }
      return true
    })
  }, [todos, filter])
}
