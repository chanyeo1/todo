import { Sun, Moon, CheckSquare } from 'lucide-react'

interface HeaderProps {
  dark: boolean
  onToggleDark: () => void
  total: number
  completed: number
}

export function Header({ dark, onToggleDark, total, completed }: HeaderProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-violet-600 dark:text-violet-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Todo
            </h1>
          </div>
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="다크모드 전환"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {total > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {completed}/{total} 완료
              </span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 dark:bg-violet-400 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
