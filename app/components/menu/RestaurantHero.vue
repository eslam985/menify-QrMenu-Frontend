<script setup lang="ts">
const publicMenuStore = usePublicMenuStore();

const daysMap: Record<string, string> = {
  sun: "الأحد",
  mon: "الإثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
  sat: "السبت",
};

const todayHours = computed(() => {
  const hours = publicMenuStore.restaurant?.working_hours;
  if (!hours || typeof hours !== "object") return null;

  const daysKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const currentDayKey = daysKeys[new Date().getDay()];

  if (!currentDayKey) return null;

  const todayData = hours[currentDayKey];
  const dayName = daysMap[currentDayKey];

  if (!todayData || !todayData.open || !todayData.close) {
    return { dayName, text: "مغلق اليوم", isOpen: false };
  }

  return {
    dayName,
    text: `${todayData.open} ${todayData.close}`,
    isOpen: true,
  };
});
</script>

<template>
  <div>
    <div
      v-if="publicMenuStore.isLoading"
      class="py-fluid m-auto flex items-center justify-center self-center"
    >
      <div
        class="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>

    <div
      v-else-if="publicMenuStore.error"
      class="my-fluid bg-denger/10 border-denger/20 text-denger p-fluid m-auto mx-auto max-w-7xl self-center rounded-xl border text-center"
    >
      <p class="font-bold">حدث خطأ أثناء تحميل بيانات المطعم.</p>
      <p class="mt-1 text-sm opacity-80">
        {{ publicMenuStore.error || "حاول تاني" }}
      </p>
    </div>

    <section
      dir="rtl"
      v-else-if="publicMenuStore.restaurant"
      class="mb-fluid shadow-soft relative mx-auto flex min-h-[380px] items-end overflow-hidden md:rounded-b-md"
    >
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="
          publicMenuStore.restaurant?.logo_url
            ? {
                backgroundImage: `url(${publicMenuStore.restaurant?.logo_url})`,
              }
            : { background: 'var(--color-card)' }
        "
      />

      <div
        class="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/20 backdrop-blur-[2px]"
      />
      <div
        class="from-primary/30 absolute inset-0 bg-linear-to-br via-transparent to-transparent"
      />

      <div
        class="p-fluid gap-fluid-section relative z-10 flex w-full flex-col-reverse items-start justify-between self-center md:flex-row md:items-end"
      >
        <div class="gap-fluid flex flex-1 flex-col">
          <div dir="ltr">
            <h1
              class="text-fluid-h1 to-primary bg-linear-to-br from-white via-orange-300 bg-clip-text leading-[0.9] font-black tracking-tighter text-transparent"
            >
              {{ publicMenuStore.restaurant.name }}
            </h1>
            <p
              v-if="publicMenuStore.restaurant.slug"
              class="mt-1 text-sm text-white/60"
            >
              @{{ publicMenuStore.restaurant.slug }}
            </p>
          </div>

          <p
            v-if="publicMenuStore.restaurant.description"
            class="text-fluid-p max-w-xl text-right leading-relaxed font-semibold text-white/80 italic"
          >
            {{ publicMenuStore.restaurant.description }}
          </p>

          <div
            class="flex max-w-xl flex-wrap items-center gap-3 text-sm text-white/80"
          >
            <span
              v-if="publicMenuStore.restaurant.address"
              class="border-primary/15 px-fluid flex items-center gap-1.5 rounded-full border bg-white/10 py-1.5 backdrop-blur-md"
            >
              <Icon name="lucide:map-pin" class="text-primary h-4 w-4" />
              {{ publicMenuStore.restaurant.address }}
            </span>

            <span
              v-if="todayHours"
              class="border-primary/15 px-fluid flex items-center gap-1.5 rounded-full border bg-white/10 py-1.5 backdrop-blur-md"
            >
              <Icon name="lucide:clock" class="text-primary h-4 w-4" />
              <span>{{ todayHours.dayName }}:</span>
              <span
                :class="
                  todayHours.isOpen ? 'font-medium text-white' : 'text-red-400'
                "
                >{{ todayHours.text }}</span
              >
            </span>

            <span
              v-if="publicMenuStore.restaurant.timezone"
              class="border-primary/15 px-fluid flex items-center gap-1.5 rounded-full border bg-white/10 py-1.5 backdrop-blur-md"
            >
              <Icon name="lucide:globe" class="text-primary h-4 w-4" />
              {{ publicMenuStore.restaurant.timezone }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 pt-2">
            <a
              v-if="publicMenuStore.restaurant.phone"
              :href="`tel:${publicMenuStore.restaurant.phone}`"
              class="px-fluid bg-primary flex items-center gap-2 rounded-xl py-2.5 font-bold text-white shadow-lg transition hover:opacity-90"
            >
              <Icon name="lucide:phone" class="h-4 w-4" /> اتصال
            </a>
            <a
              v-if="publicMenuStore.restaurant.whatsapp"
              :href="`https://wa.me/${publicMenuStore.restaurant.whatsapp}`"
              target="_blank"
              class="px-fluid flex items-center gap-2 rounded-xl bg-[#25D366] py-2.5 font-bold text-white shadow-lg transition hover:bg-[#20bd5a]"
            >
              <Icon name="simple-icons:whatsapp" class="h-4 w-4" /> واتساب
            </a>
            <a
              v-if="publicMenuStore.restaurant.maps_url"
              :href="publicMenuStore.restaurant.maps_url"
              target="_blank"
              class="border-primary/20 flex self-center rounded-xl border bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/20"
              title="الخريطة"
            >
              <Icon name="lucide:navigation" class="h-5 w-5" />
            </a>
            <a
              v-if="publicMenuStore.restaurant.instagram_url"
              :href="publicMenuStore.restaurant.instagram_url"
              target="_blank"
              class="border-primary/20 flex self-center rounded-xl border bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/20"
              title="Instagram"
            >
              <Icon name="simple-icons:instagram" class="h-5 w-5" />
            </a>
            <a
              v-if="publicMenuStore.restaurant.facebook_url"
              :href="publicMenuStore.restaurant.facebook_url"
              target="_blank"
              class="border-primary/20 flex self-center rounded-xl border bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/20"
              title="Facebook"
            >
              <Icon name="simple-icons:facebook" class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
