<!-- app/components/menu/CategorySection.vue -->
<script setup lang="ts">
const { publicMenuStore, filteredCategories, searchQuery } =
  usePublicMenuState();

import { useShowModal } from "#imports";
const { openModal: openItemModal } = useShowModal("item-model");
</script>

<template>
  <div v-if="publicMenuStore.categories?.length > 0" dir="rtl">
    <div class="mb-section-fluid relative">
      <div
        class="text-text/40 pointer-events-none absolute inset-y-0 right-0 flex w-full items-center pr-4"
      >
        <Icon name="lucide:search" class="h-5 w-5" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ابحث عن وجبتك المفضلة (مثل: برجر، بيتزا، مشروب...)"
        class="text-text focus:border-primary shadow-soft text-fluid-sm bg-card border-primary/10 placeholder:text-text/40 w-full rounded-2xl border py-3.5 pr-12 pl-10 transition focus:outline-none"
      />
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="text-text/40 hover:text-primary absolute inset-y-0 left-0 flex cursor-pointer items-center pl-4 transition"
        title="مسح البحث"
      >
        <Icon name="lucide:x" class="h-5 w-5" />
      </button>
    </div>

    <div class="mt-8 flex flex-col gap-10">
      <div
        v-if="publicMenuStore.isLoading"
        class="gap-fluid flex flex-col items-center justify-center py-20"
      >
        <div
          class="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        ></div>
        <p class="text-text/60 text-fluid-sm animate-pulse">
          جاري تحضير قائمة المطعم...
        </p>
      </div>

      <div
        v-else-if="searchQuery.trim() !== '' && filteredCategories.length === 0"
        class="bg-card border-primary/5 shadow-soft rounded-2xl border py-16 text-center"
      >
        <Icon
          name="lucide:search-x"
          class="text-text/30 mx-auto mb-3 h-12 w-12"
        />
        <h3 class="text-text text-fluid-p font-bold">
          عذراً، لم نجد نتائج مطابقة لـ "{{ searchQuery }}"
        </h3>
        <p class="text-text/60 text-fluid-sm mt-1">
          جرب البحث بكلمات أخرى أو مسح حقل البحث.
        </p>
      </div>

      <div
        v-else-if="publicMenuStore.isLoaded && filteredCategories.length === 0"
        class="text-text/60 py-16 text-center"
      >
        لا توجد أصناف في المنيو حالياً.
      </div>

      <template v-else>
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          :id="`category-${category.id}`"
          class="scroll-mt-24"
        >
          <h2
            class="text-fluid-h2 text-primary mb-fluid border-primary/10 border-b pb-2 font-bold"
          >
            {{ category.name }}
          </h2>

          <div
            class="scrollbar-thumb-primary/20 gap-fluid flex snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent overflow-x-auto pt-1 pb-4"
          >
            <div
              v-for="item in category.items"
              :key="item.id"
              @click="openItemModal(item)"
              :class="[
                'bg-card text-text p-fluid border-primary/25 group hover:border-primary/50 flex w-[260px] shrink-0 snap-start flex-col justify-between rounded-3xl border shadow-xl sm:w-[280px] md:w-[320px]',
                item.is_available
                  ? 'cursor-pointer hover:scale-[1.02]'
                  : 'cursor-not-allowed opacity-60',
              ]"
            >
              <div>
                <div
                  class="bg-bg border-primary/10 mb-fluid relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner md:h-40"
                >
                  <img
                    v-if="
                      item.image_url || publicMenuStore.restaurant?.logo_url
                    "
                    :src="
                      item.image_url ||
                      publicMenuStore.restaurant?.logo_url ||
                      undefined
                    "
                    :alt="item.title"
                    loading="lazy"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <Icon
                    v-else
                    name="lucide:utensils"
                    class="text-text/30 h-8 w-8"
                  />

                  <span
                    v-if="!item.is_available"
                    class="top-fluid bg-danger text-fluid-xs absolute left-3 rounded-full px-2.5 py-1 font-bold text-white shadow-md"
                  >
                    غير متوفر حاليا
                  </span>
                </div>

                <div class="flex flex-col gap-1">
                  <h3
                    class="text-text truncate text-(length:--text-fluid-h3) font-bold"
                  >
                    {{ item.title }}
                  </h3>
                  <p
                    v-if="item.description"
                    class="text-text/70 line-clamp-2 text-(length:--text-fluid-sm) leading-relaxed"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </div>

              <div
                class="border-primary/10 mt-fluid flex items-center justify-between border-t pt-3"
              >
                <span class="text-fluid-xs text-text/50 font-bold">السعر</span>
                <span class="text-primary text-xl font-black">
                  {{ formatPrice(item.price) }}
                  <span class="ext-fluid-xs">{{
                    publicMenuStore.restaurant?.currency || "ج.م"
                  }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
