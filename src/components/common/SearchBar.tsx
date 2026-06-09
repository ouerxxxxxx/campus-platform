import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  onSearch: (keyword: string) => void
  className?: string
}

export function SearchBar({ placeholder = '搜索...', onSearch, className = '' }: SearchBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`
        flex items-center rounded-xl overflow-hidden transition-all duration-200
        ${focused ? 'bg-white ring-2 ring-primary/20' : 'bg-[#E5E5EA]/60'}
      `}>
        <Search className="w-4 h-4 text-text-tertiary ml-3 flex-shrink-0" strokeWidth={2} />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full px-2.5 py-2.5 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        {value && (
          <button type="button" onClick={handleClear} className="mr-2 p-1 rounded-full hover:bg-gray-300/50 transition-all">
            <X className="w-4 h-4 text-text-tertiary" strokeWidth={2} />
          </button>
        )}
      </div>
    </form>
  )
}
