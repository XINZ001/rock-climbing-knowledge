import { Helmet } from 'react-helmet-async'
import { useApp } from '../context/AppContext'

const BASE_URL = 'https://xinlibrary.com'

const DEFAULTS = {
  zh: {
    title: '攀岩知识库',
    desc: '系统化的攀岩知识库——涵盖技术动作、训练方法、伤痛预防、装备指南和攀岩名人堂。帮助攀岩者从入门到进阶，科学提升攀岩水平。',
    locale: 'zh_CN'
  },
  en: {
    title: 'Xin Library',
    desc: 'A systematic rock climbing knowledge base — covering techniques, training, injury prevention, gear guides and Hall of Fame. Helping climbers progress from beginner to advanced.',
    locale: 'en_US'
  },
  ko: {
    title: '클라이밍 라이브러리',
    desc: '체계적인 클라이밍 지식 라이브러리 — 기술, 훈련, 부상 예방, 장비 가이드, 명예의 전당을 다룹니다. 초보자부터 상급자까지 과학적으로 클라이밍 실력을 향상시킵니다.',
    locale: 'ko_KR'
  }
}

const DEFAULT_IMAGE = `${BASE_URL}/images/og-cover.png`

export default function PageSEO({ title, description, path, image }) {
  const { lang } = useApp()
  const d = DEFAULTS[lang] || DEFAULTS.zh
  const fullTitle = title ? `${title} — ${d.title}` : d.title
  const desc = description || d.desc
  const url = path ? `${BASE_URL}${path}` : BASE_URL
  const img = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <html lang={lang === 'zh' ? 'zh-CN' : lang === 'ko' ? 'ko' : 'en'} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={d.locale} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}
