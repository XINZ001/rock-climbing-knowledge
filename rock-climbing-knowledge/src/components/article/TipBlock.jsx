import { Icon } from '../../utils/icons'

export default function TipBlock({ children }) {
  return (
    <div className="my-6 tip-block border-l-4 rounded-r-lg p-5">
      <div className="flex items-center gap-2 mb-2 tip-block-title font-semibold text-xs">
        <Icon name="lightbulb" size={16} />
        <span>小贴士</span>
      </div>
      <div className="text-sm leading-relaxed text-text-primary/90">
        {children}
      </div>
    </div>
  )
}
