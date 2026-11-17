<script setup lang="ts">
const restaurantsStore = usePublicRestaurantsStore();
const { restaurants, isLoading } = storeToRefs(restaurantsStore);
const loadRestaurants = async () => await restaurantsStore.fetchRestaurants();

await useAsyncData("home-restaurants", async () => {
  await loadRestaurants();
  return true;
});
</script>
<template>
  <div
    class="bg-card p-fluid shadow-soft border-primary/10 gap-fluid flex w-full flex-col rounded-xl border"
  >
    <div class="text-right">
      <h3 class="text-(length:--text-fluid-h3) font-bold">
        اختـر المطاعـم أو الكـافيهات الممـيزه لـدينــا
      </h3>
      <p class="text-text/60 text-fluid-xs mt-1">
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
          <div class="gap-fluid flex items-center">
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
        <div class="gap-fluid flex items-center text-right">
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
            <span class="text-text/60 text-fluid-xs">{{
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
</template>
