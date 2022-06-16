import React, { forwardRef, InputHTMLAttributes } from 'react'
import { SearchIcon, XCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'

export type Props = {
  onClearText: () => void
} & InputHTMLAttributes<HTMLInputElement>

export default forwardRef<HTMLInputElement, Props>(({ onClearText, ...props }, ref) => {
  return (
    <div
      className={clsx(
        'rounded-full bg-gray-200 dark:bg-gray-800 w-full flex items-center border border-transparent transition focus-within:border-blue-400 focus-within:text-blue-400 text-gray-500'
      )}
    >
      <SearchIcon className="w-6 h-6 ml-4" />
      <input
        ref={ref}
        className="bg-transparent w-full focus:outline-none px-4 py-2 text-gray-900 dark:text-gray-100"
        placeholder="Search..."
        {...props}
      />
      <XCircleIcon
        onClick={() => onClearText()}
        className={clsx(props.value ? 'w-6 h-6 mr-4' : 'hidden w-6 h-6 mr-4')}
      />
    </div>
  )
})
