import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
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
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="hall-of-fame" element={<HallOfFamePage />} />
<Route path="hall-of-fame/:athleteSlug" element={<AthletePage />} />
          <Route path="articles" element={<ArticleListPage />} />
          <Route path="articles/category/:categoryId" element={<ArticleCategoryPage />} />
          <Route path="articles/:articleSlug" element={<ArticleDetailPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="section/:sectionSlug" element={<SectionPage />} />
          <Route path="section/:sectionSlug/:subSlug" element={<TopicPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="quests" element={<QuestPage />} />
          <Route path="diagnosis" element={<DiagnosisPage />} />
          <Route path="climbing-mbti" element={<ClimbingMbtiPage />} />
          <Route path="injuries" element={<InjuryListPage />} />
          <Route path="injuries/new" element={<InjuryFormPage />} />
          <Route path="injuries/:id" element={<InjuryDetailPage />} />
          <Route path="injuries/:id/edit" element={<InjuryFormPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="climbing-profile" element={<ClimbingProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route path="admin/feedback" element={<FeedbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
