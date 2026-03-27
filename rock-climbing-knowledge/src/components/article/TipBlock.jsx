import { Icon } from '../../utils/icons'

export default function TipBlock({ children }) {
  return (
    <div className="my-6 rounded-xl bg-blue-50 border-l-4 border-blue-400 p-5">
      <div className="flex items-center gap-2 mb-2 text-blue-600 font-medium text-sm">
        <Icon name="lightbulb" size={16} />
        <span>小贴士</span>
      </div>
      <div className="text-sm leading-relaxed text-text-primary">
        {children}
      </div>
    </div>
  )
}
