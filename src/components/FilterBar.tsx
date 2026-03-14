import { Search, X } from 'lucide-react'
import type { FilterState, FilterStatus, Priority } from '../types'

interface FilterBarProps {
  filter: FilterState
  onChange: (f: FilterState) => void
  categories: string[]
  completedCount: number
  onClearCompleted: () => void
}

const statusTabs: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

const priorityFilters: { value: Priority | 'all'; label: string; dot?: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'high', label: '높음', dot: 'bg-red-500' },
  { value: 'medium', label: '보통', dot: 'bg-yellow-500' },
  { value: 'low', label: '낮음', dot: 'bg-green-500' },
]

export function FilterBar({ filter, onChange, categories, completedCount, onClearCompleted }: FilterBarProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filter, ...patch })

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 space-y-3">
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="검색..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          {filter.search && (
            <button
              onClick={() => set({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => set({ status: tab.value })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter.status === tab.value
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex gap-1">
            {priorityFilters.map((pf) => (
              <button
                key={pf.value}
                onClick={() => set({ priority: pf.value })}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  filter.priority === pf.value
                    ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-400 dark:border-violet-500 text-violet-700 dark:text-violet-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {pf.dot && <span className={`w-1.5 h-1.5 rounded-full ${pf.dot}`} />}
                {pf.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={filter.category}
              onChange={(e) => set({ category: e.target.value })}
              className="px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">모든 카테고리</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Clear completed */}
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="ml-auto text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              완료 항목 삭제 ({completedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
