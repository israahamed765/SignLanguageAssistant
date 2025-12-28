function AboutPage() {
  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-card">
      <p className="text-sm font-semibold text-blue-600">عن المشروع</p>
      <h2 className="text-2xl font-bold text-slate-900">منصة توعوية لدعم لغة الإشارة العربية</h2>
      <p className="text-slate-700 leading-relaxed">
        تم بناء هذا النموذج كجزء من مشروع جامعي/تعليمي لتجربة واجهة تساعد الصم وضعاف السمع على
        فهم المحتوى العربي. يعتمد التطبيق على بيانات وهمية (Mock Data) لتمثيل روابط فيديوهات
        الإشارات دون الحاجة إلى أي واجهات برمجية حقيقية.
      </p>
      <ul className="list-disc space-y-2 pr-5 text-slate-700">
        <li>ترجمة نصية بسيطة تربط كل كلمة بإشارة من البيانات الوهمية.</li>
        <li>محاكاة لتسجيل صوتي يملأ النص تلقائياً بعبارة جاهزة.</li>
        <li>مكتبة تعلم تضم الحروف والأرقام والكلمات الشائعة في بطاقات تفاعلية.</li>
        <li>تصميم RTL باستخدام Tailwind CSS مع خط عربي مريح للقراءة.</li>
      </ul>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
        ملاحظة: جميع روابط الفيديو المستخدمة في الواجهة هي عناوين وهمية (Mock URLs) يمكن
        استبدالها لاحقاً بروابط حقيقية أو بدمج خدمة فيديو مناسبة.
      </div>
    </div>
  )
}

export default AboutPage

