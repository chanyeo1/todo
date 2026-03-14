import { ClipboardList } from 'lucide-react'

interface EmptyStateProps {
  hasFilter: boolean
}

export function EmptyState({ hasFilter }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
      {hasFilter ? (
        <>
          <p className="text-gray-500 dark:text-gray-400 font-medium">검색 결과가 없습니다</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">필터를 변경해 보세요</p>
        </>
      ) : (
        <>
          <p className="text-gray-500 dark:text-gray-400 font-medium">할 일이 없습니다</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">위에서 새로운 할 일을 추가해 보세요</p>
        </>
      )}
    </div>
  )
}
