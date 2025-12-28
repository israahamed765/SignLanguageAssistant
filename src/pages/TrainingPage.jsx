import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'

const RECORD_SECONDS = 5
const STORAGE_KEY = 'savedSignsList'

const readStoredSigns = () => {
  if (typeof window === 'undefined') return []
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function TrainingPage() {
  const [targetWord, setTargetWord] = useState('')
  const [status, setStatus] = useState('الرجاء كتابة الكلمة ثم اضغط تسجيل.')
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [canSave, setCanSave] = useState(false)
  const [savedSigns, setSavedSigns] = useState(() => readStoredSigns())
  const timerRef = useRef(null)
  const webcamRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSigns))
    } catch {
      // ignore storage errors
    }
  }, [savedSigns])

  const startRecording = () => {
    const trimmed = targetWord.trim()
    if (!trimmed) {
      setStatus('اكتب الكلمة أولاً قبل البدء بالتسجيل.')
      return
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(true)
    setProgress(0)
    setCanSave(false)
    setStatus('جاري التسجيل... قم بأداء الإشارة أمام الكاميرا.')

    const startedAt = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000
      const pct = Math.min(100, Math.round((elapsed / RECORD_SECONDS) * 100))
      setProgress(pct)
      if (elapsed >= RECORD_SECONDS) {
        clearInterval(timerRef.current)
        timerRef.current = null
        setIsRecording(false)
        setCanSave(true)
        setStatus('انتهى التسجيل. اضغط "حفظ الإشارة" لإضافتها للسجل.')
      }
    }, 200)
  }

  const handleSave = () => {
    const trimmed = targetWord.trim()
    if (!trimmed) {
      setStatus('لا يمكن الحفظ بدون كلمة.')
      return
    }
    const newEntry = {
      word: trimmed,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    }
    setSavedSigns((prev) => [newEntry, ...prev])
    setStatus(`تم حفظ الإشارة بنجاح للكلمة: "${trimmed}"`)
    setCanSave(false)
    setProgress(0)
  }

  const handleClear = () => {
    setTargetWord('')
    setStatus('تم مسح الحقل. اكتب كلمة جديدة للمتابعة.')
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm font-semibold text-blue-600">واجهة تدريب وجمع بيانات الإشارة</p>
        <h1 className="text-2xl font-bold text-slate-900">مرحلة جمع البيانات (محاكاة)</h1>
        <p className="text-sm text-slate-600">
          اكتب الكلمة العربية، ثم ابدأ التسجيل الوهمي لمدة {RECORD_SECONDS} ثوانٍ، وبعدها احفظ الإشارة لإضافتها إلى السجل.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-3xl bg-white p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">الكلمة المستهدفة</label>
                <input
                  type="text"
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                  placeholder='مثال: "جائع" أو "عطشان"'
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition ${
                    isRecording ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'
                  }`}
                >
                  بدء التسجيل
                </button>
                <button
                  onClick={handleClear}
                  className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  مسح
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>مدة التسجيل: {RECORD_SECONDS} ثوانٍ</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">شريط تقدّم وهمي يحاكي التقاط الإشارة.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
              <p className="text-sm font-semibold text-slate-700">منطقة الكاميرا (محاكاة)</p>
              <div className="mt-3 overflow-hidden rounded-2xl bg-slate-900/80">
                <Webcam
                  ref={webcamRef}
                  className="aspect-video w-full object-cover"
                  mirrored
                  audio={false}
                  screenshotFormat="image/jpeg"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                الكاميرا قيد التشغيل للتدريب الوهمي؛ في التطبيق الفعلي سيتم التقاط الفيديو وإرساله للخادم.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition ${
                  canSave ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                حفظ الإشارة
              </button>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                {status}
              </span>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-bold text-slate-900">الكلمات المحفوظة</h3>
            <p className="text-sm text-slate-500">سجل الإشارات التي تمت إضافتها (وهمياً).</p>
            {savedSigns.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                لم يتم حفظ أي كلمة بعد.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {savedSigns.map((item, idx) => (
                  <li
                    key={`${item.word}-${idx}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.word}</p>
                      <p className="text-xs text-slate-500">تم الحفظ في {item.time}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      محفوظ
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TrainingPage

