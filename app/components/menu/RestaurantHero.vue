<script setup lang="ts">
const publicMenuStore = usePublicMenuStore()

// خريطة تحويل مفاتيح الأيام مع تعريف نوع البيانات لـ TypeScript
const daysMap: Record<string, string> = {
  sun: 'الأحد',
  mon: 'الإثنين',
  tue: 'الثلاثاء',
  wed: 'الأربعاء',
  thu: 'الخميس',
  fri: 'الجمعة',
  sat: 'السبت'
}

// دالة لمعرفة مواعيد اليوم الحالي
const todayHours = computed(() => {
  const hours = publicMenuStore.restaurant?.working_hours as Record<string, any> | null
  if (!hours || typeof hours !== 'object') return null

  const daysKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  const currentDayKey = daysKeys[new Date().getDay()]

  // التحقق من أن المفتاح موجود وغير فارغ لتجنب خطأ الـ undefined
  if (!currentDayKey) return null

  const todayData = hours[currentDayKey]
  const dayName = daysMap[currentDayKey]

  if (!todayData || !todayData.open || !todayData.close) {
    return { dayName, text: 'مغلق اليوم', isOpen: false }
  }

  return {
    dayName,
    text: `${todayData.open} ${todayData.close}`,
    isOpen: true
  }
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="publicMenuStore.isLoading" class="flex items-center justify-center py-fluid self-center m-auto">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Error -->
    <div v-else-if="publicMenuStore.error"
      class="max-w-7xl mx-auto my-fluid bg-denger/10 border border-denger/20 text-denger p-fluid rounded-xl text-center  self-center m-auto">
      <p class="font-bold">حدث خطأ أثناء تحميل بيانات المطعم.</p>
      <p class="text-sm opacity-80 mt-1">{{ publicMenuStore.error || 'حاول تاني' }}</p>
    </div>

    <!-- Hero -->
    <section  dir="rtl" v-else-if="publicMenuStore.restaurant"
      class="relative  mx-auto mb-fluid md:rounded-b-md overflow-hidden min-h-[380px] flex items-end shadow-soft">
      <!-- الخلفية -->
      <div class="absolute inset-0 bg-cover bg-center"
        :style="publicMenuStore.restaurant?.logo_url ? { backgroundImage: `url(${publicMenuStore.restaurant?.logo_url})` } : { background: 'var(--color-card)' }" />
      <!-- التدرجات اللونية والضباب -->
      <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/20 backdrop-blur-[2px]" />
      <div class="absolute inset-0 bg-linear-to-br from-primary/30 via-transparent to-transparent" />

      <!-- المحتوى -->
      <div
        class="relative z-10 w-full p-fluid flex flex-col-reverse md:flex-row self-center items-start md:items-end justify-between gap-fluid-section">

        <!-- Left -->
        <div class="flex-1 flex flex-col gap-fluid">
          <div dir="ltr">
            <h1 class="text-fluid-h1 font-black tracking-tighter leading-[0.9] bg-linear-to-br from-white via-orange-300 to-primary bg-clip-text text-transparent">
            {{ publicMenuStore.restaurant.name }}
          </h1>
            <p v-if="publicMenuStore.restaurant.slug" class="text-white/60 text-sm mt-1">@{{
              publicMenuStore.restaurant.slug }}</p>
          </div>

          <p v-if="publicMenuStore.restaurant.description"
            class="text-white/80 max-w-xl text-right italic font-semibold text-fluid-p leading-relaxed">
            {{ publicMenuStore.restaurant.description }}
            
          </p>

          <!-- Badges (Address, Timezone, Working Hours) -->
          <div class="flex max-w-xl flex-wrap items-center gap-3 text-sm text-white/80">
            <!-- Address -->
            <span v-if="publicMenuStore.restaurant.address"
              class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-primary/15 px-fluid py-1.5 rounded-full">
              <Icon name="lucide:map-pin" class="w-4 h-4 text-primary" /> {{ publicMenuStore.restaurant.address }}
            </span>

            <!-- Today's Hours -->
            <span v-if="todayHours"
              class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-primary/15 px-fluid py-1.5 rounded-full">
              <Icon name="lucide:clock" class="w-4 h-4 text-primary" />
              <span>{{ todayHours.dayName }}:</span>
              <span :class="todayHours.isOpen ? 'text-white font-medium' : 'text-red-400'">{{ todayHours.text }}</span>
            </span>

            <!-- Timezone -->
            <span v-if="publicMenuStore.restaurant.timezone"
              class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-primary/15 px-fluid py-1.5 rounded-full">
              <Icon name="lucide:globe" class="w-4 h-4 text-primary" /> {{ publicMenuStore.restaurant.timezone }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-2.5 pt-2">
            <a v-if="publicMenuStore.restaurant.phone" :href="`tel:${publicMenuStore.restaurant.phone}`"
              class="px-fluid py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition flex items-center gap-2 shadow-lg">
              <Icon name="lucide:phone" class="w-4 h-4" /> اتصال
            </a>
            <a v-if="publicMenuStore.restaurant.whatsapp" :href="`https://wa.me/${publicMenuStore.restaurant.whatsapp}`"
              target="_blank"
              class="px-fluid py-2.5 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition flex items-center gap-2 shadow-lg">
              <Icon name="simple-icons:whatsapp" class="w-4 h-4" /> واتساب
            </a>
            <a v-if="publicMenuStore.restaurant.maps_url" :href="publicMenuStore.restaurant.maps_url" target="_blank"
              class="flex self-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-primary/20 text-white hover:bg-white/20 transition"
              title="الخريطة">
              <Icon name="lucide:navigation" class="w-5 h-5" />
            </a>
            <a v-if="publicMenuStore.restaurant.instagram_url" :href="publicMenuStore.restaurant.instagram_url"
              target="_blank"
              class="flex self-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-primary/20 text-white hover:bg-white/20 transition"
              title="Instagram">
              <Icon name="simple-icons:instagram" class="w-5 h-5" />
            </a>
            <a v-if="publicMenuStore.restaurant.facebook_url" :href="publicMenuStore.restaurant.facebook_url"
              target="_blank"
              class="flex self-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-primary/20 text-white hover:bg-white/20 transition"
              title="Facebook">
              <Icon name="simple-icons:facebook" class="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>