import { Icon } from '../../utils/icons'

export default function WarningBlock({ children }) {
  return (
    <div className="my-6 warning-block border-l-4 rounded-r-lg p-5">
      <div className="flex items-center gap-2 mb-2 warning-block-title font-semibold text-xs">
        <Icon name="alertTriangle" size={16} />
        <span>注意</span>
      </div>
      <div className="text-sm leading-relaxed text-text-primary/90">
        {children}
      </div>
    </div>
  )
}
