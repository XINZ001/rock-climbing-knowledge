import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import FeedLayout from './components/layout/FeedLayout'
import Layout from './components/layout/Layout'
import FeedPage from './pages/FeedPage'
import LearnPage from './pages/LearnPage'
import TrainPage from './pages/TrainPage'
import HomePage from './pages/HomePage'
import SectionPage from './pages/SectionPage'
import TopicPage from './pages/TopicPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'
import FeedbackPage from './pages/FeedbackPage'
import HallOfFamePage from './pages/HallOfFamePage'

import AthletePage from './pages/AthletePage'
import InjuryListPage from './pages/InjuryListPage'
import InjuryFormPage from './pages/InjuryFormPage'
import InjuryDetailPage from './pages/InjuryDetailPage'
import SettingsPage from './pages/SettingsPage'
import ClimbingProfilePage from './pages/ClimbingProfilePage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import KnowledgePage from './pages/KnowledgePage'
import ArticleListPage from './pages/ArticleListPage'
import ArticleCategoryPage from './pages/ArticleCategoryPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import DiagnosisPage from './pages/DiagnosisPage'
import ClimbingMbtiPage from './pages/ClimbingMbtiPage'
import ProfilePage from './pages/ProfilePage'
import QuestPage from './pages/QuestPage'
import HallOfFameCategoryPage from './pages/HallOfFameCategoryPage'

function ScrollToTopOnNav() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTopOnNav />
      <Routes>
        {/* FeedLayout 包裹所有页面 — 底部 3-tab 导航永远在 */}
        <Route element={<FeedLayout />}>
          {/* Tab 1: 发现 */}
          <Route index element={<FeedPage />} />

          {/* Tab 2: 学 */}
          <Route path="learn" element={<HomePage />} />

          {/* Tab 3: 练 */}
          <Route path="train" element={<TrainPage />} />

          {/* 个人主页 (从右上角头像进入) */}
          <Route path="profile" element={<ProfilePage />} />

          {/* 知识库内容页 — 用 Layout 提供 Header + Sidebar */}
          <Route element={<Layout />}>
            {/* 知识库浏览 */}
            <Route path="knowledge" element={<HomePage />} />
            <Route path="knowledge-index" element={<KnowledgePage />} />
            <Route path="section/:sectionSlug" element={<SectionPage />} />
            <Route path="section/:sectionSlug/:subSlug" element={<TopicPage />} />
            <Route path="search" element={<SearchPage />} />

            {/* 专栏文章 */}
            <Route path="articles" element={<ArticleListPage />} />
            <Route path="articles/category/:categoryId" element={<ArticleCategoryPage />} />
            <Route path="articles/:articleSlug" element={<ArticleDetailPage />} />

            {/* 名人堂 */}
            <Route path="hall-of-fame" element={<HallOfFamePage />} />
            <Route path="hall-of-fame/:athleteSlug" element={<AthletePage />} />

            {/* 工具页 */}
            <Route path="quests" element={<QuestPage />} />
            <Route path="diagnosis" element={<DiagnosisPage />} />
            <Route path="climbing-mbti" element={<ClimbingMbtiPage />} />

            {/* 伤痛 */}
            <Route path="injuries" element={<InjuryListPage />} />
            <Route path="injuries/new" element={<InjuryFormPage />} />
            <Route path="injuries/:id" element={<InjuryDetailPage />} />
            <Route path="injuries/:id/edit" element={<InjuryFormPage />} />

            {/* 设置 */}
            <Route path="climbing-profile" element={<ClimbingProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="auth/callback" element={<AuthCallbackPage />} />
            <Route path="admin/feedback" element={<FeedbackPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
