<script setup lang="ts">
const router = useRouter()
const searchSlug = ref('')

// الانتقال لصفحة المنيو الخاصة بالمطعم
const goToMenu = () => {
  if (!searchSlug.value.trim()) return
  router.push(`/menu/${searchSlug.value.trim().toLowerCase()}`)
}

// مطاعم تجريبية للاختيار السريع (يمكن ربطها لاحقاً بالـ API)
const sampleRestaurants = [
  { name: 'Case Cafe', slug: 'case-cafe-1', desc: 'أفضل قهوة في المدينة' },
  { name: 'Restaurant Lamera', slug: 'restaurant-lamera', desc: 'أشهى المأكولات والمشروبات' }
]

</script>

<template>
  <div class="min-h-screen bg-bg text-text flex flex-col justify-between">
    <!-- Main Hero Section -->
    <main
      class="w-full 2xl:max-w-[80%] mx-auto px-fluid p-section-fluid flex flex-col items-center text-center gap-section my-auto">

      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 p-fluid text-start py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-(length:--text-fluid-sm) font-bold">
        (QR Code) منيو إلكتروني ذكي بالـباركوود لمطعمك
        <Icon name="lucide:sparkles" class="w-4 h-4" />

      </div>

      <!-- Title & Desc -->
      <div class="max-w-3xl flex flex-col gap-4">
        <h1 class="text-(length:--text-fluid-h1) font-black tracking-tighter leading-tight">
          ودّع المنيوهات الورقية، <br />
          <span class="text-primary">وابدأ المستقبل مع Menify</span>
        </h1>
        <p class="text-(length:--text-fluid-p) text-text/80 max-w-2xl mx-auto leading-relaxed">
          وفر لعملائك تجربة تصفح سريعة ومرنة، وعدّل أسعارك أو أصناف طعامك او مشروباتك في ثوانٍ معدودة دون الحاجة لإعادة
          طباعة المنيو الورقي أبداً.
        </p>
      </div>

      <!-- Restaurant Selector Box -->
      <div
        class="w-full 2xl:max-w-[80%] bg-card p-fluid rounded-xl shadow-soft border border-primary/10 flex flex-col gap-4">
        <div class="text-right">
          <h3 class="text-(length:--text-fluid-h3) font-bold">اختـر المطاعـم أو الكـافيهات الممـيزه لـدينــا</h3>
          <p class="text-xs text-text/60 mt-1">تصفح القوائم الرقمية للمطاعم أو الكـافيهات المتاحة فوراً</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-fluid">
          <nuxt-link v-for="res in sampleRestaurants" :key="res.slug" :to="`/menu/${res.slug}`"
            class="p-fluid rounded-xl bg-bg border border-white/5 hover:border-primary transition flex items-center justify-between group cursor-pointer shadow-sm">
            <div class="flex items-center gap-3 text-right">
              <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Icon name="lucide:store" class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-(length:--text-fluid-sm) group-hover:text-primary transition">{{ res.name }}
                </h4>
                <span class="text-xs text-text/60">{{ res.desc }}</span>
              </div>
            </div>
            <Icon name="lucide:chevron-left" class="w-5 h-5 text-text/40 group-hover:text-primary transition" />
          </nuxt-link>
        </div>
      </div>

<!-- Subscription Plans Section -->
      <div class="w-full mt-12 text-right">
        <div class="mb-8">
          <h2 class="text-(length:--text-fluid-h2) font-bold text-primary">باقات الأسعار والاشتراكات</h2>
          <p class="text-sm text-text/60 mt-1">اختر الباقة المناسبة لمطعمك وابدأ رحلتك الرقمية معنا</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-fluid w-full">
          <!-- باقة شهرية -->
          <div class="bg-card p-fluid rounded-xl border border-primary/10 shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 left-0 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-br-xl">تجربة مرنة</div>
            <div>
              <h3 class="text-(length:--text-fluid-h3) font-bold mb-2">الاشتراك الشهري</h3>
              <p class="text-xs text-text/60 mb-4">مثالي للبدء السريع بدون التزام طويل</p>
              <div class="flex items-baseline gap-2 mb-4 justify-end">
                <span class="text-sm text-text/40 line-through">{{ formatPrice(300) }} ج</span>
                <span class="text-3xl font-black text-primary">مجاناً</span>
                <span class="text-xs font-normal text-text/60">/ الشهر الأول</span>
              </div>
              <ul class="text-xs text-text/80 space-y-2 mb-6 text-right">
                <li>✓ أول شهر مجاناً بالكامل</li>
                <li>✓ منيو إلكتروني غير محدود</li>
                <li>✓ QR كود دائم ومخصص للمطعم</li>
                <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
              </ul>
            </div>
            <a 
              href="https://t.me/+201013080898?text=مرحباً، أرغب في الاشتراك في الباقة الشهرية (أول شهر مجاناً) لبرنامج Menify" 
              target="_blank" 
              class="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition cursor-pointer text-center block"
            >
              اختر الشهري
            </a>
          </div>

          <!-- اشتراك نصف سنوي -->
          <div class="bg-card p-fluid rounded-xl border border-primary/20 shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 left-0 bg-primary/70 text-white text-xs font-bold px-3 py-1 rounded-br-xl">الأكثر توفيراً</div>
            <div>
              <h3 class="text-(length:--text-fluid-h3) font-bold mb-2">اشتراك نصف سنوي</h3>
              <p class="text-xs text-text/60 mb-4">خصم شهرين كاملين (وفر 600 ج)</p>
              <div class="flex items-baseline gap-2 mb-4 justify-end">
                <span class="text-sm text-text/40 line-through">{{ formatPrice(1800) }} ج</span>
                <span class="text-3xl font-black text-primary">{{ formatPrice(1200) }} ج</span>
                <span class="text-xs font-normal text-text/60">/ 6 شهور</span>
              </div>
              <ul class="text-xs text-text/80 space-y-2 mb-6 text-right">
                <li>✓ إجمالي (300 × 6) - خصم شهرين</li>
                <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
                <li>✓ QR كود دائم ومخصص للمطعم</li>
                <li>✓ منيو إلكتروني غير محدود</li>
                <li>✓ دعم فني أول بأول</li>
              </ul>
            </div>
            <a 
              href="https://t.me/+201013080898?text=مرحباً، أرغب في الاشتراك في باقة النصف سنوي (1200 ج) لبرنامج Menify" 
              target="_blank" 
              class="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition cursor-pointer text-center block"
            >
              اختر النصف سنوي
            </a>
          </div>

          <!-- اشتراك سنوي -->
          <div class="bg-card p-fluid rounded-xl border-2 border-primary  shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 left-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-br-xl"> العضوية المميزة</div>
            <div>
              <h3 class="text-(length:--text-fluid-h3) font-bold mb-2">اشتراك سنوي</h3>
              <p class="text-xs text-text/60 mb-4">خصم 3 شهور كاملة (وفر 900 ج)</p>
              <div class="flex items-baseline gap-2 mb-4 justify-end">
                <span class="text-sm text-text/40 line-through">{{ formatPrice(3600) }} ج</span>
                <span class="text-3xl font-black text-primary">{{ formatPrice(2700) }} ج</span>
                <span class="text-xs font-normal text-text/60">/ سنوياً</span>
              </div>
              <ul class="text-xs text-text/80 space-y-2 mb-6 text-right">
                <li>✓ إجمالي (300 × 12) - خصم 3 شهور</li>
                <li>✓ أولوية قصوى في الدعم الفني والتطويرات</li>
                <li>✓ تصميم QR كود احترافي جاهز للطباعة</li>
                <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
                <li>✓ QR كود دائم ومخصص للمطعم</li>
                <li>✓ منيو إلكتروني غير محدود</li>
              </ul>
            </div>
              <a 
                href="https://t.me/+201013080898?text=مرحباً، أرغب في الاشتراك في الباقة السنوية (2700 ج) لبرنامج Menify" 
                target="_blank" 
                class="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition cursor-pointer text-center block"
              >
                اختر السنوي
              </a>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-fluid w-full mt-12 text-right">
        <div class="bg-card p-fluid rounded-xl border border-primary/10 shadow-soft flex flex-col gap-3">
          <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Icon name="lucide:barcode" class="w-6 h-6" />
          </div>
          <h3 class="text-(length:--text-fluid-h3) font-bold">QR كود دائم</h3>
          <p class="text-(length:--text-fluid-sm) text-text/70">اطبع كود واحد للطاولة واستمتع بتحديثات فورية دون تغيير
            الكود أبداً.</p>
        </div>

        <div class="bg-card p-fluid rounded-xl border border-primary/10 shadow-soft flex flex-col gap-3">
          <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Icon name="lucide:receipt" class="w-6 h-6" />
          </div>
          <h3 class="text-(length:--text-fluid-h3) font-bold">حاسبة فاتورة ذكية</h3>
          <p class="text-(length:--text-fluid-sm) text-text/70">يستطيع العميل تجميع طلبه ومعرفة الإجمالي لحظياً قبل طلب
            الحساب.</p>
        </div>

        <div class="bg-card p-fluid rounded-xl border border-primary/10 shadow-soft flex flex-col gap-3">
          <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Icon name="lucide:zap" class="w-6 h-6" />
          </div>
          <h3 class="text-(length:--text-fluid-h3) font-bold">تحكم لحظي (CRUD)</h3>
          <p class="text-(length:--text-fluid-sm) text-text/70">
            لوحة تحكم كاملة لصاحب المطعم او الكافية لتعديل الأسعار وإضافة الأقسام بسهولة.
          </p>
        </div>
      </div>

    </main>

  </div>
</template>