import { useEffect, useState } from 'react'
import { signData } from '../data/signLanguageData.js'

const mockVoiceText = 'مرحباً كيف الحال اليوم'

function TranslationPage() {
  const [inputText, setInputText] = useState('')
  const [translatedWords, setTranslatedWords] = useState([])
  const [status, setStatus] = useState('')

  const translateText = (text) => {
    const cleaned = text.trim()
    if (!cleaned) {
      setTranslatedWords([])
      setStatus('')
      return
    }

    const words = cleaned.split(/\s+/)
    const results = words.map((word) => ({
      word,
      videoUrl: signData[word],
    }))

    setTranslatedWords(results)
    setStatus('تم تحديث الترجمة.')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        translateText(inputText)
      } else {
        setTranslatedWords([])
        setStatus('')
      }
    }, 600)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText])

  const handleVoiceMock = () => {
    setStatus('جارٍ التسجيل...')
    setTimeout(() => {
      setInputText(mockVoiceText)
      translateText(mockVoiceText)
      setStatus('تم إدخال النص الصوتي التجريبي.')
    }, 800)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">ترجمة النص إلى لغة الإشارة</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">أدخل نصاً عربياً للحصول على إشارات فيديو</h2>
            <p className="mt-2 text-sm text-slate-600">
              يتم تجزئة النص تلقائياً وإظهار فيديو لكل كلمة موجودة في البيانات الوهمية.
            </p>
          </div>
          {status && (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
              {status}
            </span>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <textarea
            className="w-full min-h-[140px] rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-base text-slate-900 shadow-inner focus:border-primary focus:bg-white focus:outline-none"
            placeholder="اكتب هنا النص العربي المراد تحويله..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => translateText(inputText)}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              ترجمة الآن
            </button>
            <button
              onClick={handleVoiceMock}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              تسجيل صوتي (محاكاة)
            </button>
            <button
              onClick={() => {
                setInputText('')
                setTranslatedWords([])
                setStatus('')
              }}
              className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              مسح الحقل
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900">الإشارات الناتجة</h3>
          <p className="text-sm text-slate-500">
            يتم العرض من اليمين إلى اليسار طبقاً لاتجاه اللغة العربية.
          </p>
        </div>

        {!translatedWords.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500">
            اكتب نصاً أو استخدم المحاكاة لعرض إشارات الفيديو.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {translatedWords.map(({ word, videoUrl }, idx) => (
              <div
                key={`${word}-${idx}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-slate-900">{word}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-inner">
                    كلمة
                  </span>
                </div>

                {videoUrl ? (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black/5"
                  >
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-400">
                    لا توجد إشارة لهذه الكلمة
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TranslationPage

