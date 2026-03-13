export default function Footer() {
  return (
    <footer className="border-t border-stone-border bg-stone-card py-4 px-6 text-center text-xs text-text-secondary">
      <p>攀岩知识库 / 攀岩名人堂 Climbing Knowledge Base / Hall of Fame</p>
      <p className="mt-1">基于三支柱内容架构 v1 构建</p>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>制作人：行之</span>
        <a
          href="https://xhslink.com/m/7LQ0G4Nh0oU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded border border-stone-border bg-stone-card px-2 py-1 text-text-secondary transition-colors hover:border-forest/40 hover:bg-stone-hover"
        >
          <img src="/images/xiaohongshu-logo.png" alt="小红书" className="h-4 w-4 rounded object-contain" />
          <span>小红书</span>
        </a>
      </p>
    </footer>
  )
}
