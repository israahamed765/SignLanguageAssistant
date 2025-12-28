import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-10 rounded-3xl bg-white p-8 shadow-card md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            منصة عربية - دعم لغة الإشارة
          </p>
          <h1 className="text-3xl font-bold leading-relaxed text-slate-900 md:text-4xl">
            مساعدة الصم وضعاف السمع على فهم المحتوى العربي بسهولة عبر ترجمة النصوص
            إلى لغة الإشارة.
          </h1>
          <p className="text-lg text-slate-600">
            اكتب أو قم بمحاكاة التسجيل الصوتي لتحصل على سلسلة من إشارات الفيديو، أو
            استكشف مكتبة التعلم لتتعرف على الحروف والأرقام والكلمات الشائعة.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/translation"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              ابدأ الترجمة
            </Link>
            <Link
              to="/learning"
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              استعرض دروس التعلم
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-100 via-cyan-100 to-white blur-2xl" />
          <div className="flex flex-col gap-4 rounded-2xl bg-white/90 p-6 shadow-card">
            <p className="text-sm font-semibold text-blue-600">مسار الترجمة البسيط</p>
            <div className="space-y-3 text-slate-700">
              <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-blue-600">
                  1
                </span>
                <div>
                  <p className="font-semibold">أدخل النص العربي</p>
                  <p className="text-sm text-slate-500">كتابة أو محاكاة تسجيل صوتي.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-cyan-600">
                  2
                </span>
                <div>
                  <p className="font-semibold">تحويل فوري</p>
                  <p className="text-sm text-slate-500">تجزئة الكلمات وربطها بإشارات الفيديو.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-emerald-600">
                  3
                </span>
                <div>
                  <p className="font-semibold">مشاهدة أو تعلم</p>
                  <p className="text-sm text-slate-500">
                    استعرض الإشارات أو انتقل للدروس التفصيلية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="ترجمة النص إلى لغة الإشارة"
          description="فك تجزئة النص العربي وعرض سلسلة فيديوهات وهمية تمثل كل كلمة."
          accent="bg-blue-500"
        />
        <FeatureCard
          title="محاكاة التسجيل الصوتي"
          description="زر واحد لملء النص بعبارة جاهزة ومحاكاة تحويل الكلام إلى نص."
          accent="bg-emerald-500"
        />
        <FeatureCard
          title="مكتبة تعلم منظمة"
          description="حروف، أرقام، وكلمات شائعة ببطاقات تفاعلية لتسهيل التعلم."
          accent="bg-cyan-500"
        />
      </section>
    </div>
  )
}

function FeatureCard({ title, description, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent} text-white`}>
        ★
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  )
}

export default HomePage

