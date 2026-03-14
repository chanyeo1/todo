import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Check, GripVertical, X, Calendar } from 'lucide-react'
import type { Todo, Priority } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, changes: Partial<Todo>) => void
}

const priorityConfig: Record<Priority, { dot: string; badge: string; label: string }> = {
  high: { dot: 'bg-red-500', badge: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800', label: '높음' },
  medium: { dot: 'bg-yellow-500', badge: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800', label: '보통' },
  low: { dot: 'bg-green-500', badge: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800', label: '낮음' },
}

function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date(new Date().toDateString())
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return '오늘'
  if (diff === 1) return '내일'
  if (diff === -1) return '어제'
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  const pc = priorityConfig[todo.priority]
  const overdue = isOverdue(todo.dueDate, todo.completed)

  const commitEdit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.text) onUpdate(todo.id, { text: trimmed })
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setEditText(todo.text)
      setEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-fade-in ${
        isDragging ? 'shadow-lg rounded-lg' : ''
      }`}
    >
      {/* Drag handle */}
      <button
        className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        {...attributes}
        {...listeners}
        aria-label="순서 변경"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-violet-500 dark:bg-violet-400 border-violet-500 dark:border-violet-400'
            : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-400'
        }`}
        aria-label={todo.completed ? '완료 취소' : '완료 표시'}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-0.5 rounded border border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        ) : (
          <p
            onDoubleClick={() => {
              setEditText(todo.text)
              setEditing(true)
            }}
            className={`text-sm leading-snug break-words cursor-text select-none ${
              todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-100'
            }`}
          >
            {todo.text}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {/* Priority badge */}
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${pc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
            {pc.label}
          </span>

          {/* Category */}
          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            {todo.category}
          </span>

          {/* Due date */}
          {todo.dueDate && (
            <span
              className={`flex items-center gap-1 text-xs ${
                overdue
                  ? 'text-red-500 dark:text-red-400 font-medium'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Calendar className="w-3 h-3" />
              {formatDate(todo.dueDate)}
              {overdue && ' (기한 초과)'}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!editing && (
          <button
            onClick={() => {
              setEditText(todo.text)
              setEditing(true)
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
            aria-label="수정"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        {editing && (
          <button
            onClick={() => {
              setEditText(todo.text)
              setEditing(false)
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="취소"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="삭제"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
