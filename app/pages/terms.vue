<!-- app/pages/terms.vue -->
<script setup lang="ts">
const { siteName } = useBrand();

useSeoMeta({
  title: `الشروط والأحكام - ${siteName}`,
  description: `الشروط والأحكام المنظمة لاستخدام منصة ${siteName} وباقات الاشتراك.`,
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
          <Icon name="lucide:file-text" class="h-5 w-5" />
          <span>الوثائق القانونية</span>
        </div>
        <h1 class="text-text text-fluid-h1 font-black">الشروط والأحكام</h1>
        <p class="text-text/60 text-fluid-xs mt-2">آخر تحديث: نوفمبر 2026</p>
      </div>

      <div class="space-y-6 leading-relaxed">
        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            1. قبول الشروط
          </h2>
          <p class="text-text/80 text-fluid-sm">
            باستخدامك لمنصة <strong>{{ siteName }}</strong> أو تسجيل مطعمك أو
            الكافيه الخاص بك، فإنك توافق على الالتزام الكامل بهذه الشروط
            والأحكام.
          </p>
        </section>

        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            2. طبيعة الخدمة وحسابات المطاعم
          </h2>
          <p class="text-text/80 text-fluid-sm">
            توفر المنصة نظام منيو إلكتروني عبر رمز الاستجابة السريعة (QR) ولوحة
            تحكم لإدارة الأصناف والأسعار. يتحمل صاحب الحساب المسؤولية الكاملة عن
            دقة الأسعار، الصور، والبيانات المعروضة لعملائه.
          </p>
        </section>

        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            3. الاشتراكات والتجديد وإيقاف الخدمة
          </h2>
          <ul
            class="text-text/80 text-fluid-sm list-inside list-disc space-y-1.5"
          >
            <li>
              تُقدم الخدمة بنظام الباقات (شهرية، نصف سنوية، أو سنوية) مع فترة
              تجريبية مجانية للمشتركين الجدد وفق العرض المعلن.
            </li>
            <li>
              في حال انتهاء مدة الاشتراك وعدم التجديد، يتم إيقاف لوحة التحكم
              ورابط المنيو العام مؤقتاً مع الاحتفاظ ببيانات المطعم لحين إعادة
              التفعيل.
            </li>
            <li>
              يحق لإدارة المنصة إيقاف أي حساب ينشر محتوى مخالفاً للقوانين أو
              ينتهك حقوق الملكية الفكرية للغير.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-primary text-fluid-h3 mb-2 font-bold">
            4. سياسة الإلغاء والاسترجاع
          </h2>
          <p class="text-text/80 text-fluid-sm">
            يمكنك طلب إلغاء الاشتراك قبل موعد التجديد التالي في أي وقت. نظراً
            لطبيعة الخدمة الرقمية، لا تُسترد رسوم الفترات الزمنية التي تم
            تفعيلها واستخدامها بالفعل، بينما يمكن دراسة طلبات الاسترجاع للباقات
            السنوية خلال أول 7 أيام من التفعيل في حال وجود عطل تقني حال دون
            الاستفادة من الخدمة.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
