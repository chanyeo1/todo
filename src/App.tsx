import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Header } from './components/Header'
import { TodoForm } from './components/TodoForm'
import { FilterBar } from './components/FilterBar'
import { TodoItem } from './components/TodoItem'
import { EmptyState } from './components/EmptyState'
import { useTodos, useFilteredTodos } from './hooks/useTodos'
import { useDarkMode } from './hooks/useDarkMode'
import type { FilterState } from './types'

const defaultFilter: FilterState = {
  status: 'all',
  priority: 'all',
  category: '',
  search: '',
}

export default function App() {
  const [dark, setDark] = useDarkMode()
  const [filter, setFilter] = useState<FilterState>(defaultFilter)

  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted, reorder, categories } =
    useTodos()

  const filtered = useFilteredTodos(todos, filter)
  const completedCount = todos.filter((t) => t.completed).length
  const hasFilter =
    filter.status !== 'all' ||
    filter.priority !== 'all' ||
    filter.category !== '' ||
    filter.search !== ''

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-2xl mx-auto shadow-sm min-h-screen flex flex-col">
        <Header
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          total={todos.length}
          completed={completedCount}
        />

        <TodoForm onAdd={addTodo} categories={categories} />

        <FilterBar
          filter={filter}
          onChange={setFilter}
          categories={categories}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />

        <main className="flex-1">
          {filtered.length === 0 ? (
            <EmptyState hasFilter={hasFilter} />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filtered.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {filtered.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </main>

        <footer className="text-center py-4 text-xs text-gray-400 dark:text-gray-600">
          {filtered.length > 0 && (
            <span>{filtered.length}개 항목</span>
          )}
        </footer>
      </div>
    </div>
  )
}
