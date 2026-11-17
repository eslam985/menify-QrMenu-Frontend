<!-- app/pages/about.vue -->
<script setup lang="ts">
useSeoMeta({
  title: "من نحن - Tabloz",
  description: "تعرف على منصة Tabloz للتحول الرقمي وإدارة المنيو الإلكتروني للمطاعم والكافيهات.",
});
</script>

<template>
  <div dir="rtl" class="px-fluid mx-auto w-full max-w-5xl py-12">
    <div class="bg-card border-primary/15 shadow-soft p-section-fluid rounded-3xl border">
      <div class="mb-8 text-center">
        <span class="bg-primary/10 text-primary text-fluid-xs mb-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold">
          <Icon name="lucide:sparkles" class="h-4 w-4" />
          <span>قصتنا ورؤيتنا</span>
        </span>
        <h1 class="text-text text-fluid-h1 font-black">من نحن</h1>
        <p class="text-text/70 text-fluid-p mx-auto mt-3 max-w-2xl leading-relaxed">
          نحن في <strong class="text-primary">Tabloz</strong> نساعد المطاعم والكافيهات على التحول الرقمي الكامل وتقديم تجربة طلب عصرية وسريعة لعملائهم.
        </p>
      </div>

      <div class="gap-fluid grid grid-cols-1 md:grid-cols-2">
        <div class="bg-bg border-primary/10 p-fluid rounded-2xl border">
          <div class="bg-primary/10 text-primary mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
            <Icon name="lucide:target" class="h-6 w-6" />
          </div>
          <h2 class="text-text text-fluid-h3 mb-2 font-bold">رسالتنا</h2>
          <p class="text-text/70 text-fluid-sm leading-relaxed">
            توفير حلول تقنية ذكية وبسيطة تغني أصحاب المطاعم عن تكاليف الطباعة المتكررة، وتمكّنهم من تحديث أسعارهم وأصنافهم لحظياً بضغطة زر واحدة.
          </p>
        </div>

        <div class="bg-bg border-primary/10 p-fluid rounded-2xl border">
          <div class="bg-primary/10 text-primary mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
            <Icon name="lucide:eye" class="h-6 w-6" />
          </div>
          <h2 class="text-text text-fluid-h3 mb-2 font-bold">رؤيتنا</h2>
          <p class="text-text/70 text-fluid-sm leading-relaxed">
            أن نكون الشريك التقني الأول للمطاعم والكافيهات في المنطقة العربية عبر تقديم منيو تفاعلي سريع يجمع بين سهولة الاستخدام للزائر وقوة التحكم للإدارة.
          </p>
        </div>
      </div>

      <div class="bg-primary/5 border-primary/20 p-fluid mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border sm:flex-row">
        <div>
          <h3 class="text-text text-fluid-p font-bold">هل أنت مستعد لتطوير مطعمك؟</h3>
          <p class="text-text/70 text-fluid-xs mt-1">ابدأ تجربتك المجانية الآن لأول شهر بدون أي التزام.</p>
        </div>
        <NuxtLink to="/#pricing" class="btn-primary p-fluid shrink-0">
          استكشف الباقات
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
