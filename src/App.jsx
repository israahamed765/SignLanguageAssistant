import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import TranslationPage from './pages/TranslationPage.jsx'
import LearningPage from './pages/LearningPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import RealTimeTranslationPage from './pages/RealTimeTranslationPage.jsx'
import TrainingPage from './pages/TrainingPage.jsx'

const navLinkClasses = ({ isActive }) =>
  [
    'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
    isActive
      ? 'bg-primary text-white shadow-md shadow-blue-200'
      : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
            <span className="text-lg font-bold">إشارة</span>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">منصة ترجمة الإشارة</p>
            <p className="text-sm text-slate-500">جامعة افتراضية · مشروع توعوي</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClasses}>
            الرئيسية
          </NavLink>
          <NavLink to="/translation" className={navLinkClasses}>
            الترجمة
          </NavLink>
          <NavLink to="/learning" className={navLinkClasses}>
            التعلم
          </NavLink>
          <NavLink to="/real-time-translation" className={navLinkClasses}>
            الترجمة الفورية
          </NavLink>
          <NavLink to="/training" className={navLinkClasses}>
            واجهة التدريب
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            عن المشروع
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/translation" element={<TranslationPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/real-time-translation" element={<RealTimeTranslationPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 bg-white/70 py-6 text-center text-sm text-slate-500">
          تم بناء هذا النموذج لأغراض تعليمية لدعم دمج الصم وضعاف السمع.
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
