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
import HallOfFameCategoryPage from './pages/HallOfFameCategoryPage'
import AthletePage from './pages/AthletePage'

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
          <Route path="hall-of-fame/browse/:categoryKey" element={<HallOfFameCategoryPage />} />
          <Route path="hall-of-fame/:athleteSlug" element={<AthletePage />} />
          <Route path="section/:sectionSlug" element={<SectionPage />} />
          <Route path="section/:sectionSlug/:subSlug" element={<TopicPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="admin/feedback" element={<FeedbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
