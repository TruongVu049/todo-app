import { Check } from 'lucide-react'

import { cn } from '@/utils/cn'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  label?: string
  'aria-label'?: string
}

export const Checkbox = ({
  checked,
  onChange,
  className,
  label,
  'aria-label': ariaLabel,
}: CheckboxProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center justify-center w-7 h-7 rounded-lg border-2 transition-all flex-shrink-0 hover:scale-105',
        checked
          ? 'bg-[#00a85a] border-[#00a85a] shadow-sm'
          : 'border-gray-300 hover:border-[#00a85a] hover:bg-green-50',
        className,
      )}
    >
      {checked && <Check className="w-4 h-4 text-white" />}
    </button>
  )
}
