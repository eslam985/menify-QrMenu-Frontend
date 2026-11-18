<!-- app/pages/privacy.vue -->
<script setup lang="ts">
const { siteName } = useBrand();

useSeoMeta({
  title: `سياسة الخصوصية - ${siteName}`,
  description: `كيف تقوم منصة ${siteName} بجمع وحماية بيانات المطاعم والزوار.`,
});
</script>

<template>
  <div dir="rtl" class="px-fluid mx-auto w-full max-w-4xl py-12">
    <div
      class="bg-card border-primary/15 shadow-soft p-section-fluid rounded-3xl border"
    >
      <div class="border-primary/10 mb-8 border-b pb-6">
        <div
          class="text-primary mb-2 flex items-center gap-2 text-sm font-bold"
        >
          <Icon name="lucide:shield-check" class="h-5 w-5" />
          <span>حماية البيانات</span>
        </div>
        <h1 class="text-text text-fluid-h1 font-black">سياسة الخصوصية</h1>
        <p class="text-text/60 text-fluid-xs mt-2">آخر تحديث: نوفمبر 2026</p>
      </div>

      <div class="space-y-6 leading-relaxed">
        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            1. البيانات التي نجمعها
          </h2>
          <p class="text-text/80 text-fluid-sm">
            نجمع فقط البيانات اللازمة لتشغيل الخدمة، وتشمل: اسم المطعم، بيانات
            التواصل الخاصة بصاحب الحساب (البريد الإلكتروني ورقم الهاتف)،
            بالإضافة إلى محتوى المنيو من أصناف وأسعار وصور.
          </p>
        </section>

        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            2. كيف نستخدم البيانات
          </h2>
          <ul
            class="text-text/80 text-fluid-sm list-inside list-disc space-y-1.5"
          >
            <li>إنشاء وعرض المنيو الإلكتروني ورمز الـ QR الخاص بمطعمك.</li>
            <li>التواصل معك بخصوص حالة الاشتراك، التحديثات، والدعم الفني.</li>
            <li>تحسين سرعة وأداء المنصة وتجربة تصفح الزوار.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            3. حماية البيانات وعدم مشاركتها
          </h2>
          <p class="text-text/80 text-fluid-sm">
            نلتزم بحماية بياناتك باستخدام تقنيات التشفير القياسية، ولا نقوم ببيع
            أو تأجير أو مشاركة بياناتك الشخصية أو بيانات مبيعاتك وأصنافك مع أي
            طرف ثالث لأغراض تسويقية.
          </p>
        </section>

        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            4. ملفات تعريف الارتباط (Cookies والتخزين المحلي)
          </h2>
          <p class="text-text/80 text-fluid-sm">
            تستخدم المنصة التخزين المحلي للمتصفح لحفظ جلسة تسجيل الدخول وتفضيلات
            المظهر (الوضع الليلي/النهاري) وسلة الطلبات المؤقتة للزائر لتحسين
            تجربة الاستخدام.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
