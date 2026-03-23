import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://xinlibrary.com'
const DEFAULT_TITLE = '攀岩知识库'
const DEFAULT_DESC = '系统化的攀岩知识库——涵盖技术动作、训练方法、伤痛预防、装备指南和攀岩名人堂。帮助攀岩者从入门到进阶，科学提升攀岩水平。'
const DEFAULT_IMAGE = `${BASE_URL}/images/og-cover.png`

export default function PageSEO({ title, description, path, image }) {
  const fullTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const url = path ? `${BASE_URL}${path}` : BASE_URL
  const img = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}
