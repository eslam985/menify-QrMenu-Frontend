<script setup lang="ts">
const restaurantsStore = usePublicRestaurantsStore();
const { restaurants, isLoading } = storeToRefs(restaurantsStore);
const loadRestaurants = () => restaurantsStore.fetchRestaurants();

onMounted(() => {
  loadRestaurants();
});
</script>

<template>
  <div class="bg-bg text-text flex min-h-screen flex-col justify-between">
    <main
      class="px-fluid p-section-fluid gap-section mx-auto my-auto flex w-full flex-col items-center text-center 2xl:max-w-[80%]"
    >
      

      <div class="flex max-w-3xl flex-col gap-4">
        <h1
          class="text-(length:--text-fluid-h1) leading-tight font-black tracking-tighter"
        >
          ودّع المنيوهات الورقية، <br />
          <span class="text-primary">وابدأ المستقبل مع tabloz</span>
        </h1>
        <p
          class="text-text/80 mx-auto max-w-2xl text-(length:--text-fluid-p) leading-relaxed"
        >
          وفر لعملائك تجربة تصفح سريعة ومرنة، وعدّل أسعارك أو أصناف طعامك او
          مشروباتك في ثوانٍ معدودة دون الحاجة لإعادة طباعة المنيو الورقي أبداً.
        </p>
      </div>

      <div
        class="bg-card p-fluid shadow-soft border-primary/10 flex w-full flex-col gap-4 rounded-xl border 2xl:max-w-[80%]"
      >
        <div class="text-right">
          <h3 class="text-(length:--text-fluid-h3) font-bold">
            اختـر المطاعـم أو الكـافيهات الممـيزه لـدينــا
          </h3>
          <p class="text-text/60 mt-1 text-xs">
            تصفح القوائم الرقمية للمطاعم أو الكـافيهات المتاحة فوراً
          </p>
        </div>
        
        <div
          v-if="!isLoading && restaurants.length === 0"
          class="flex justify-center gap-1"
        >
          <button @click="loadRestaurants" class="text-primary">
            حاول مجددا من هنا
          </button>
          <span
            class="text-text/50 py-fluid text-fluid-xs col-span-full text-center"
          >
            لا توجد مطاعم متاحة حالياً</span
          >
        </div>
        <div class="gap-fluid grid grid-cols-1 sm:grid-cols-2">
          
          <template v-if="isLoading">
            <div
              v-for="i in 2"
              :key="i"
              class="p-fluid bg-bg animate-pulse rounded-xl border border-white/5 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="bg-primary/10 h-10 w-10 rounded-lg" />
                <div class="flex-1 space-y-2">
                  <div class="bg-primary/10 h-3 w-2/3 rounded" />
                  <div class="bg-primary/5 h-2 w-1/2 rounded" />
                </div>
              </div>
            </div>
          </template>

          
          <nuxt-link
            v-for="res in restaurants"
            v-else
            :key="res.slug"
            :to="`/menu/${res.slug}`"
            class="p-fluid bg-bg hover:border-primary group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 shadow-sm transition"
          >
            <div class="flex items-center gap-3 text-right">
              <div
                class="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold"
              >
                <img
                  v-if="res.logo_url"
                  :src="res.logo_url"
                  :alt="res.name"
                  class="h-10 w-10 rounded-lg object-cover"
                />
                <Icon v-else name="lucide:store" class="h-5 w-5" />
              </div>
              <div>
                <h4
                  class="group-hover:text-primary text-(length:--text-fluid-sm) font-bold transition"
                >
                  {{ res.name }}
                </h4>
                <span class="text-text/60 text-xs">{{
                  res.description ?? "تصفح القائمة الآن"
                }}</span>
              </div>
            </div>
            <Icon
              name="lucide:chevron-left"
              class="text-text/40 group-hover:text-primary h-5 w-5 transition"
            />
          </nuxt-link>
        </div>
      </div>

      <div class="mt-12 w-full text-right">
        <div class="mb-8">
          <h2 class="text-primary text-(length:--text-fluid-h2) font-bold">
            باقات الأسعار والاشتراكات
          </h2>
          <p class="text-text/60 mt-1 text-sm">
            اختر الباقة المناسبة لمطعمك وابدأ رحلتك الرقمية معنا
          </p>
        </div>

        <div class="gap-fluid grid w-full grid-cols-1 md:grid-cols-3">
          <div
            class="bg-card p-fluid border-primary/10 shadow-soft relative flex flex-col justify-between overflow-hidden rounded-xl border"
          >
            <div
              class="bg-primary/20 text-primary absolute top-0 left-0 rounded-br-xl px-3 py-1 text-xs font-bold"
            >
              تجربة مرنة
            </div>
            <div>
              <h3 class="mb-2 text-(length:--text-fluid-h3) font-bold">
                الاشتراك الشهري
              </h3>
              <p class="text-text/60 mb-4 text-xs">
                مثالي للبدء السريع بدون التزام طويل
              </p>
              <div class="mb-4 flex items-baseline justify-end gap-2">
                <span class="text-text/40 text-sm line-through"
                  >{{ formatPrice(300) }} ج</span
                >
                <span class="text-primary text-3xl font-black">مجاناً</span>
                <span class="text-text/60 text-xs font-normal"
                  >/ الشهر الأول</span
                >
              </div>
              <ul class="text-text/80 mb-6 space-y-2 text-right text-xs">
                <li>✓ أول شهر مجاناً بالكامل</li>
                <li>✓ منيو إلكتروني غير محدود</li>
                <li>✓ QR كود دائم ومخصص للمطعم</li>
                <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
              </ul>
            </div>
            <a
              href="https://t.me/+201013080898?text=مرحباً، أرغب في الاشتراك في الباقة الشهرية (أول شهر مجاناً) لبرنامج tabloz"
              target="_blank"
              class="bg-primary block w-full cursor-pointer rounded-xl py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
            >
              اختر الشهري
            </a>
          </div>

          <div
            class="bg-card p-fluid border-primary/20 shadow-soft relative flex flex-col justify-between overflow-hidden rounded-xl border"
          >
            <div
              class="bg-primary/70 absolute top-0 left-0 rounded-br-xl px-3 py-1 text-xs font-bold text-white"
            >
              الأكثر توفيراً
            </div>
            <div>
              <h3 class="mb-2 text-(length:--text-fluid-h3) font-bold">
                اشتراك نصف سنوي
              </h3>
              <p class="text-text/60 mb-4 text-xs">
                خصم شهرين كاملين (وفر 600 ج)
              </p>
              <div class="mb-4 flex items-baseline justify-end gap-2">
                <span class="text-text/40 text-sm line-through"
                  >{{ formatPrice(1800) }} ج</span
                >
                <span class="text-primary text-3xl font-black"
                  >{{ formatPrice(1200) }} ج</span
                >
                <span class="text-text/60 text-xs font-normal">/ 6 شهور</span>
              </div>
              <ul class="text-text/80 mb-6 space-y-2 text-right text-xs">
                <li>✓ إجمالي (300 × 6) - خصم شهرين</li>
                <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
                <li>✓ QR كود دائم ومخصص للمطعم</li>
                <li>✓ منيو إلكتروني غير محدود</li>
                <li>✓ دعم فني أول بأول</li>
              </ul>
            </div>
            <a
              href="https://t.me/+201013080898?text=مرحباً، أرغب في الاشتراك في باقة النصف سنوي (1200 ج) لبرنامج tabloz"
              target="_blank"
              class="bg-primary block w-full cursor-pointer rounded-xl py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
            >
              اختر النصف سنوي
            </a>
          </div>

          <div
            class="bg-card p-fluid border-primary shadow-soft relative flex flex-col justify-between overflow-hidden rounded-xl border-2"
          >
            <div
              class="bg-primary absolute top-0 left-0 rounded-br-xl px-3 py-1 text-xs font-bold text-white"
            >
              العضوية المميزة
            </div>
            <div>
              <h3 class="mb-2 text-(length:--text-fluid-h3) font-bold">
                اشتراك سنوي
              </h3>
              <p class="text-text/60 mb-4 text-xs">
                خصم 3 شهور كاملة (وفر 900 ج)
              </p>
              <div class="mb-4 flex items-baseline justify-end gap-2">
                <span class="text-text/40 text-sm line-through"
                  >{{ formatPrice(3600) }} ج</span
                >
                <span class="text-primary text-3xl font-black"
                  >{{ formatPrice(2700) }} ج</span
                >
                <span class="text-text/60 text-xs font-normal">/ سنوياً</span>
              </div>
              <ul class="text-text/80 mb-6 space-y-2 text-right text-xs">
                <li>✓ إجمالي (300 × 12) - خصم 3 شهور</li>
                <li>✓ أولوية قصوى في الدعم الفني والتطويرات</li>
                <li>✓ تصميم QR كود احترافي جاهز للطباعة</li>
                <li>✓ لوحة تحكم كاملة وتعديل لحظي</li>
                <li>✓ QR كود دائم ومخصص للمطعم</li>
                <li>✓ منيو إلكتروني غير محدود</li>
              </ul>
            </div>
            <a
              href="https://t.me/+201013080898?text=مرحباً، أرغب في الاشتراك في الباقة السنوية (2700 ج) لبرنامج tabloz"
              target="_blank"
              class="bg-primary block w-full cursor-pointer rounded-xl py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
            >
              اختر السنوي
            </a>
          </div>
        </div>
      </div>

      <div
        class="gap-fluid mt-12 grid w-full grid-cols-1 text-right md:grid-cols-3"
      >
        <div
          class="bg-card p-fluid border-primary/10 shadow-soft flex flex-col gap-3 rounded-xl border"
        >
          <div
            class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl font-bold"
          >
            <Icon name="lucide:barcode" class="h-6 w-6" />
          </div>
          <h3 class="text-(length:--text-fluid-h3) font-bold">QR كود دائم</h3>
          <p class="text-text/70 text-(length:--text-fluid-sm)">
            اطبع كود واحد للطاولة واستمتع بتحديثات فورية دون تغيير الكود أبداً.
          </p>
        </div>

        <div
          class="bg-card p-fluid border-primary/10 shadow-soft flex flex-col gap-3 rounded-xl border"
        >
          <div
            class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl font-bold"
          >
            <Icon name="lucide:receipt" class="h-6 w-6" />
          </div>
          <h3 class="text-(length:--text-fluid-h3) font-bold">
            حاسبة فاتورة ذكية
          </h3>
          <p class="text-text/70 text-(length:--text-fluid-sm)">
            يستطيع العميل تجميع طلبه ومعرفة الإجمالي لحظياً قبل طلب الحساب.
          </p>
        </div>

        <div
          class="bg-card p-fluid border-primary/10 shadow-soft flex flex-col gap-3 rounded-xl border"
        >
          <div
            class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl font-bold"
          >
            <Icon name="lucide:zap" class="h-6 w-6" />
          </div>
          <h3 class="text-(length:--text-fluid-h3) font-bold">
            تحكم لحظي (CRUD)
          </h3>
          <p class="text-text/70 text-(length:--text-fluid-sm)">
            لوحة تحكم كاملة لصاحب المطعم او الكافية لتعديل الأسعار وإضافة
            الأقسام بسهولة.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
