import { Link } from 'react-router-dom'

const labProducts = [
  {
    emoji: '🧪',
    name: '攀岩人格测试 (SBTI)',
    description: '12道题，测出你的攀岩人格类型',
    link: '/climbing-mbti',
  },
  {
    emoji: '🎯',
    name: '攀岩微任务',
    description: '每日小挑战，解锁攀岩成就卡',
    link: '/quests',
  },
  {
    emoji: '🩺',
    name: '能力诊断',
    description: '分析你的攀岩瓶颈，推荐针对性知识',
    link: '/diagnosis',
  },
]

export default function LabPage() {
  return (
    <div className="min-h-screen bg-stone-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-primary">实验室</h1>
          <p className="mt-2 text-secondary">攀岩社区的小功能们</p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {labProducts.map((product) => (
            <div
              key={product.link}
              className="rounded-2xl border border-stone-border bg-stone-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-5xl">{product.emoji}</div>
              <h2 className="mb-2 text-lg font-bold text-primary">
                {product.name}
              </h2>
              <p className="mb-5 text-sm text-secondary">
                {product.description}
              </p>
              <Link
                to={product.link}
                className="inline-block font-medium text-forest transition-colors hover:text-forest-dark"
              >
                去体验 →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
