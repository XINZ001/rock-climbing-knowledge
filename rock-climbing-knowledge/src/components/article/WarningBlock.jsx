import { Icon } from '../../utils/icons'

export default function WarningBlock({ children }) {
  return (
    <div className="my-6 rounded-xl bg-red-50 border-l-4 border-red-400 p-5">
      <div className="flex items-center gap-2 mb-2 text-red-600 font-medium text-sm">
        <Icon name="alertTriangle" size={16} />
        <span>注意</span>
      </div>
      <div className="text-sm leading-relaxed text-text-primary">
        {children}
      </div>
    </div>
  )
}
