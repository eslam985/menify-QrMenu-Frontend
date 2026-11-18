<script setup lang="ts">
const { siteName, supportTelegram } = useBrand();
const telegram = supportTelegram || "+201013080898";
</script>

<template>
  <div id="pricing" class="w-full text-right">
    <div class="mb-section-fluid">
      <h2 class="text-primary text-(length:--text-fluid-h2) font-bold">
        باقات الأسعار والاشتراكات
      </h2>
      <p class="text-text/60 text-fluid-sm mt-1">
        اختر الباقة المناسبة لمطعمك وابدأ رحلتك الرقمية معنا
      </p>
    </div>

    <div class="gap-fluid grid w-full grid-cols-1 md:grid-cols-3">
      <div
        class="bg-card p-fluid border-primary/10 shadow-soft relative flex flex-col justify-between overflow-hidden rounded-xl border"
      >
        <div
          class="bg-primary/20 text-primary px-fluid text-fluid-xs absolute top-0 left-0 rounded-br-xl py-1 font-bold"
        >
          تجربة مرنة
        </div>
        <div class="flex flex-col items-center">
          <h3 class="mb-2 text-(length:--text-fluid-h3) font-bold">
            الاشتراك الشهري
          </h3>
          <p class="text-text/60 mb-fluid text-fluid-xs">
            مثالي للبدء السريع بدون التزام طويل
          </p>
          <div class="mb-fluid flex items-baseline gap-2">
            <span class="text-primary text-3xl font-black">مجاناً</span>
            <span class="text-text/40 text-fluid-sm line-through">
              {{ formatPrice(300) }} ج
            </span>
            <span class="text-text/60 text-fluid-xs font-normal">
              / الشهر الأول
            </span>
          </div>
          <ul class="text-text/80 text-fluid-xs space-y-2 text-right">
            <li>✓ أول شهر مجاناً بالكامل</li>
            <li>✓ منيو إلكتروني غير محدود</li>
            <li>✓ QR كود دائم ومخصص للمطعم</li>
            <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
          </ul>
        </div>
        <a
          :href="`https://t.me/${telegram}?text=${encodeURIComponent(`مرحباً، أرغب في الاشتراك في الباقة الشهرية (أول شهر مجاناً) لبرنامج ${siteName}`)}`"
          target="_blank"
          class="btn-primary p-fluid text-center"
        >
          اختر الشهري
        </a>
      </div>

      <div
        class="bg-card p-fluid border-primary/20 shadow-soft relative flex flex-col justify-between overflow-hidden rounded-xl border"
      >
        <div
          class="bg-primary/70 px-fluid text-fluid-xs absolute top-0 left-0 rounded-br-xl py-1 font-bold text-white"
        >
          الأكثر توفيراً
        </div>
        <div>
          <h3 class="mb-2 text-(length:--text-fluid-h3) font-bold">
            اشتراك نصف سنوي
          </h3>
          <p class="text-text/60 mb-fluid text-fluid-xs">
            خصم شهرين كاملين (وفر 600 ج)
          </p>
          <div class="mb-fluid flex items-baseline gap-2">
            <span class="text-primary text-3xl font-black"
              >{{ formatPrice(1200) }} ج</span
            >
            <span class="text-text/40 text-fluid-sm line-through"
              >{{ formatPrice(1800) }} ج</span
            >
            <span class="text-text/60 text-fluid-xs font-normal">/ 6 شهور</span>
          </div>
          <ul
            class="text-text/80 mb-section-fluid text-fluid-xs space-y-2 text-right"
          >
            <li>✓ إجمالي (300 × 6) - خصم شهرين</li>
            <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
            <li>✓ QR كود دائم ومخصص للمطعم</li>
            <li>✓ منيو إلكتروني غير محدود</li>
            <li>✓ دعم فني أول بأول</li>
          </ul>
        </div>
        <a
          :href="`https://t.me/${telegram}?text=${encodeURIComponent(`مرحباً، أرغب في الاشتراك في باقة النصف سنوي (1200 ج) لبرنامج ${siteName}`)}`"
          target="_blank"
          class="btn-primary p-fluid text-center"
        >
          اختر النصف سنوي
        </a>
      </div>

      <div
        class="bg-card p-fluid border-primary shadow-soft relative flex flex-col justify-between overflow-hidden rounded-xl border-2"
      >
        <div
          class="bg-primary px-fluid text-fluid-xs absolute top-0 left-0 rounded-br-xl py-1 font-bold text-white"
        >
          العضوية المميزة
        </div>
        <div>
          <h3 class="mb-2 text-(length:--text-fluid-h3) font-bold">
            اشتراك سنوي
          </h3>
          <p class="text-text/60 mb-fluid text-fluid-xs">
            خصم 3 شهور كاملة (وفر 900 ج)
          </p>
          <div class="mb-fluid flex items-baseline gap-2">
            <span class="text-primary text-3xl font-black"
              >{{ formatPrice(2700) }} ج</span
            >
            <span class="text-text/40 text-fluid-sm line-through"
              >{{ formatPrice(3600) }} ج</span
            >
            <span class="text-text/60 text-fluid-xs font-normal">/ سنوياً</span>
          </div>
          <ul
            class="text-text/80 mb-section-fluid text-fluid-xs space-y-2 text-right"
          >
            <li>✓ إجمالي (300 × 12) - خصم 3 شهور</li>
            <li>✓ أولوية قصوى في الدعم الفني والتطويرات</li>
            <li>✓ تصميم QR كود احترافي جاهز للطباعة</li>
            <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
            <li>✓ QR كود دائم ومخصص للمطعم</li>
            <li>✓ منيو إلكتروني غير محدود</li>
          </ul>
        </div>
        <a
          :href="`https://t.me/${telegram}?text=${encodeURIComponent(`مرحباً، أرغب في الاشتراك في الباقة السنوية (2700 ج) لبرنامج ${siteName}`)}`"
          target="_blank"
          class="btn-primary p-fluid text-center"
        >
          اختر السنوي
        </a>
      </div>
    </div>
  </div>
</template>
