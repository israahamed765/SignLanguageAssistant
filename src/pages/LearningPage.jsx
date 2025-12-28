import { useMemo, useState } from 'react'
import { alphabetData, numbersData, signData } from '../data/signLanguageData.js'

const categoryCards = [
  { id: 'letters', title: 'الأحرف العربية', desc: 'تعرّف على إشارات الحروف الأساسية.', color: 'from-blue-500 to-cyan-500' },
  { id: 'numbers', title: 'الأرقام', desc: 'الأرقام من ١ إلى ١٠ بإشارات واضحة.', color: 'from-emerald-500 to-teal-400' },
  { id: 'words', title: 'الكلمات الشائعة', desc: 'عبارات متداولة في المحادثات اليومية.', color: 'from-indigo-500 to-purple-500' },
  { id: 'apps', title: 'التطبيقات المعروفة', desc: 'أسماء تطبيقات ومنصات مع إشارات وهمية.', color: 'from-orange-500 to-amber-400' },
]

const appData = [
  { label: 'واتساب', videoUrl: 'https://mock-video-url/apps/whatsapp.mp4', type: 'تطبيق' },
  { label: 'يوتيوب', videoUrl: 'https://mock-video-url/apps/youtube.mp4', type: 'تطبيق' },
  { label: 'تيك توك', videoUrl: 'https://mock-video-url/apps/tiktok.mp4', type: 'تطبيق' },
  { label: 'إنستغرام', videoUrl: 'https://mock-video-url/apps/instagram.mp4', type: 'تطبيق' },
]

function LearningPage() {
  const [activeCategory, setActiveCategory] = useState('letters')
  const [selectedClip, setSelectedClip] = useState(null)
  const [progress, setProgress] = useState({ current: 20, total: 100 })
  const [badges, setBadges] = useState([
    { id: 'alpha', label: 'هاوي الأبجدية', unlocked: true, icon: '🔠', tip: 'تفاعل مع 10 أحرف.' },
    { id: 'numbers', label: 'بطل الأرقام', unlocked: false, icon: '🔢', tip: 'أكمل جميع الأرقام.' },
  ])
  const [daily, setDaily] = useState({ target: 5, done: 0, status: 'جاهز للتحدي' })
  const [toast, setToast] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const commonWords = useMemo(
    () =>
      Object.entries(signData).map(([word, videoUrl]) => ({
        label: word,
        videoUrl,
        type: 'كلمة',
      })),
    [],
  )

  const sections = {
    letters: alphabetData.map((item) => ({ ...item, label: item.letter, type: 'حرف' })),
    numbers: numbersData.map((item) => ({ ...item, label: item.number, type: 'رقم' })),
    words: commonWords,
    apps: appData,
  }

  const handleSelect = (item) => {
    setSelectedClip(item)
    setShowModal(true)
    setToast('عمل رائع! أنت تتقن الإشارات 👏')
    setProgress((prev) => {
      const next = Math.min(prev.total, prev.current + 2)
      return { ...prev, current: next }
    })
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'numbers' && activeCategory === 'numbers' && progress.current + 2 >= progress.total) {
          return { ...b, unlocked: true }
        }
        return b
      }),
    )
    setDaily((prev) => {
      const updated = Math.min(prev.target, prev.done + 1)
      const status = updated >= prev.target ? 'أحسنت! أنهيت تحدي اليوم.' : 'استمر، خطوة رائعة.'
      return { ...prev, done: updated, status }
    })
    setTimeout(() => setToast(null), 1800)
  }

  const handleDailyStart = () => {
    setDaily({ target: 5, done: 0, status: 'التحدي بدأ، لننطلق!' })
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">مسار التعلم التفاعلي</p>
          <h1 className="text-2xl font-bold text-slate-900">اختر المسار واستكشف إشاراته</h1>
          <p className="text-sm text-slate-600">بطاقات منظمة + تلعيب بسيط لرحلة تعلم ممتعة.</p>
        </div>
        <ProgressWidget progress={progress} />
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categoryCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveCategory(card.id)}
            className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-card transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeCategory === card.id ? 'ring-2 ring-primary/50' : ''
            }`}
          >
            <div className={`absolute inset-0 opacity-90 bg-gradient-to-br ${card.color}`} />
            <div className="relative space-y-2 text-white drop-shadow-md">
              <span className="text-sm font-semibold">مسار التعلم</span>
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="text-sm text-white/80">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <ContentGrid
            title="عرض المحتوى"
            description="اختر أي بطاقة لعرض الفيديو الوهمي."
            items={sections[activeCategory]}
            onSelect={handleSelect}
          />
        </div>
        <div className="space-y-4">
          <BadgesPanel badges={badges} />
          <DailyChallenge daily={daily} onStart={handleDailyStart} />
          {toast ? <MotivationToast message={toast} /> : null}
        </div>
      </div>

      {showModal && selectedClip ? (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">إشارة مختارة</p>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedClip.label}{' '}
                  <span className="text-sm text-slate-500">({selectedClip.type})</span>
                </h3>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                مشاهدة
              </span>
            </div>
            <video
              key={selectedClip.videoUrl}
              src={selectedClip.videoUrl}
              controls
              className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black/5"
            >
              متصفحك لا يدعم تشغيل الفيديو
            </video>
            <p className="text-sm text-slate-600">روابط الفيديو وهمية لأغراض العرض.</p>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

function ProgressWidget({ progress }) {
  const percent = Math.round((progress.current / progress.total) * 100)
  return (
    <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>التقدم</span>
        <span>
          {progress.current}/{progress.total} إشارة
        </span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">يتحدث التطبيق عن تقدم وهمي قابل للتعديل.</p>
    </div>
  )
}

function ContentGrid({ title, description, items, onSelect }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} عنصر
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelect(item)}
            className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-slate-900">{item.label}</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-inner">
                {item.type}
              </span>
            </div>
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xs text-slate-400">
              معاينة الإشارة
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function BadgesPanel({ badges }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900">شارات الإنجاز</h4>
        <span className="text-xs text-slate-500">وهمية للتحفيز</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              badge.unlocked ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">{badge.icon}</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{badge.label}</p>
              <p className="text-xs text-slate-500">{badge.unlocked ? 'مفعلة 🎉' : badge.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyChallenge({ daily, onStart }) {
  const completed = daily.done >= daily.target
  const percent = Math.min(100, Math.round((daily.done / daily.target) * 100))
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900">تحدي اليوم</h4>
        <span className="text-xs text-slate-500">تدريب سريع</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">تعلم إشارات {daily.target} كلمات جديدة اليوم.</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${completed ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
        <span>
          {daily.done}/{daily.target} مكتملة
        </span>
        <span>{daily.status}</span>
      </div>
      <button
        onClick={onStart}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
      >
        بدء التحدي
      </button>
    </div>
  )
}

function MotivationToast({ message }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-card">
      {message}
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          إغلاق
        </button>
        {children}
      </div>
    </div>
  )
}

export default LearningPage

