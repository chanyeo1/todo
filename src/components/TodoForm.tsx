import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import type { Priority } from '../types'

interface TodoFormProps {
  onAdd: (text: string, priority: Priority, dueDate: string | null, category: string) => void
  categories: string[]
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '높음', color: 'text-red-500' },
  { value: 'medium', label: '보통', color: 'text-yellow-500' },
  { value: 'low', label: '낮음', color: 'text-green-500' },
]

export function TodoForm({ onAdd, categories }: TodoFormProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text, priority, dueDate || null, category)
    setText('')
    setDueDate('')
    setCategory('')
    setPriority('medium')
    setExpanded(false)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="할 일을 입력하세요..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-2.5 bg-violet-600 dark:bg-violet-500 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 font-medium"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        {expanded && (
          <div className="flex flex-wrap gap-3 animate-slide-in">
            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">우선순위</span>
              <div className="flex gap-1">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                      priority === opt.value
                        ? 'bg-violet-100 dark:bg-violet-900/40 border-violet-400 dark:border-violet-500 text-violet-700 dark:text-violet-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className={opt.color}>●</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">마감일</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Category */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">카테고리</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categories"
                placeholder="업무, 개인..."
                className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 w-28"
              />
              <datalist id="categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
