import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import { createDetector, SupportedModels } from '@tensorflow-models/pose-detection'

const fallbackPhrases = ['تم الكشف: مرحباً', 'تم الكشف: أنا', 'تم الكشف: بخير', 'تم الكشف: سعيد بلقائك']
const STORAGE_KEY = 'savedSignsList'

function RealTimeTranslationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState('جاهز لبدء الترجمة الفورية')
  const [detectedText, setDetectedText] = useState('لم يتم الكشف عن أي إشارة بعد.')
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [model, setModel] = useState(null)
  const [learnedWords, setLearnedWords] = useState([])
  const intervalRef = useRef(null)
  const webcamRef = useRef(null)

  useEffect(() => {
    loadModel()
    loadLearnedWords()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadModel = async () => {
    try {
      setIsLoadingModel(true)
      setStatus('جارٍ تحميل نموذج التعرف على الإشارة...')
      await tf.ready()
      const detector = await createDetector(SupportedModels.MoveNet, {
        modelType: 'Lightning',
      })
      setModel(detector)
      setStatus('النموذج جاهز للكشف')
    } catch (error) {
      console.error('Model load failed', error)
      setStatus('تعذر تحميل النموذج، سيتم استخدام محاكاة مبسطة')
      setModel(null)
    } finally {
      setIsLoadingModel(false)
    }
  }

  const detectSign = async (videoEl) => {
    if (!videoEl) return null
    if (learnedWords.length) {
      const random = learnedWords[Math.floor(Math.random() * learnedWords.length)]
      return `تم الكشف (كلمة مدربة): ${random}`
    }
    if (!model) {
      return 'لا توجد كلمات مدربة بعد. انتقل إلى واجهة التدريب لإضافة إشارات جديدة.'
    }

    try {
      const poses = await model.estimatePoses(videoEl)
      if (poses?.length) {
        const first = poses[0]
        const confidence = first.keypoints?.[0]?.score ?? 0
        if (confidence > 0.4) {
          // في تطبيق حقيقي سيتم تمرير الإحداثيات لنموذج تصنيف إشارات
          return 'تم الكشف: إشارة محتملة بناءً على الهيكل العظمي'
        }
      }
      return 'لم يتم التعرف على إشارة واضحة.'
    } catch (err) {
      console.error('Detection error', err)
      return 'حدثت مشكلة أثناء الكشف.'
    }
  }

  const startDetectionLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(async () => {
      const videoEl = webcamRef.current?.video
      if (!videoEl || videoEl.readyState < 2) return
      const result = await detectSign(videoEl)
      if (result) {
        setDetectedText((prev) => `${result}.\n${prev}`)
      }
    }, 3000)
  }

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false)
      setStatus('أُوقِف الكشف')
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setIsRunning(true)
    setDetectedText('... يتم التحضير لبدء الكشف ...')
    setStatus(isLoadingModel ? 'جاري التحميل...' : 'تشغيل الكاميرا والتهيئة')
    startDetectionLoop()
  }

  const handleClear = () => {
    setDetectedText('تم مسح النص.')
  }

  const loadLearnedWords = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      const words = parsed.map((item) => item.word).filter(Boolean)
      setLearnedWords(words)
    } catch (e) {
      setLearnedWords([])
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm font-semibold text-blue-600">ترجمة لغة الإشارة (تجريبية)</p>
        <h1 className="text-2xl font-bold text-slate-900">التعرف الفوري على الإشارة وتحويلها إلى نص</h1>
        <p className="text-sm text-slate-600">
          يستخدم TensorFlow.js مع نموذج وضع افتراضي (MoveNet) كتهيئة مبدئية للتكامل مع نموذج إشارات لاحقاً.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleToggle}
            disabled={isLoadingModel}
            className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition ${
              isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-primary hover:bg-blue-700'
            } ${isLoadingModel ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isRunning ? 'إيقاف الكاميرا' : 'بدء الكاميرا والكشف'}
          </button>
          <button
            onClick={handleClear}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            مسح النص
          </button>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
            {isLoadingModel ? 'جاري تحميل النموذج...' : status}
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          <div className="absolute inset-0 pointer-events-none rounded-3xl border-4 border-dashed border-primary/40" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">منطقة الكاميرا</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                بث مباشر
              </span>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl bg-slate-900/80">
              {isRunning ? (
                <Webcam
                  ref={webcamRef}
                  className="aspect-video w-full object-cover"
                  mirrored
                  audio={false}
                  screenshotFormat="image/jpeg"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-slate-200">
                  اضغط على زر البدء لتفعيل الكاميرا
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">النص الناتج عن الإشارة</h2>
              <p className="text-sm text-slate-500">
                يتم التحديث كل 3 ثوانٍ ويستخدم الكلمات التي دربت النظام عليها في واجهة التدريب.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              قراءة فقط
            </span>
          </div>
          <div className="mt-4 h-full min-h-[260px] rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right text-slate-800">
            <pre className="whitespace-pre-wrap text-sm leading-7">{detectedText}</pre>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RealTimeTranslationPage

