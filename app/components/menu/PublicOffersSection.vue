<!-- app/components/menu/PublicOffersSection.vue -->
<script setup lang="ts">
import { usePublicMenuStore } from '~/stores/publicMenu'

const publicMenuStore = usePublicMenuStore()

// دالة حساب السعر الأصلي تلقائياً من محتويات العرض (سعر القطعة × الكمية) لو لم يأتِ جاهزاً
const getOriginalTotal = (offer: any) => {
  if (offer.original_total) return offer.original_total
  if (!offer.items || !offer.items.length) return 0
  return offer.items.reduce((sum: number, item: any) => {
    const unitPrice = item.unit_price || 0
    const qty = item.quantity || 0
    return sum + (unitPrice * qty)
  }, 0)
}
</script>

<template>
  <div dir="rtl" v-if="publicMenuStore.offers && publicMenuStore.offers.length > 0" class="mb-10">
    <!-- هيدر القسم -->
    <div class="flex items-center flex-wrap gap-fluid justify-between mb-fluid">
      <h2 class="text-fluid-h3 font-black text-primary flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Icon name="lucide:sparkles" class="w-6 h-6 animate-pulse" />
        </div>
        <span>العروض والخصومات الحصرية</span>
      </h2>
      <span class="text-fluid-xs font-bold text-primary/60 bg-card px-3 py-1.5 rounded-xl border border-primary/10">
        العروض المتاحة {{ publicMenuStore.offers.length }}
      </span>
    </div>

    <!-- حاوية العروض الأفقية (Horizontal Scroll) -->
    <div
      class="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
      <div v-for="offer in publicMenuStore.offers" :key="offer.id"
        class="bg-card rounded-3xl border border-primary/20 p-fluid shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shrink-0 w-[90%] sm:w-[480px] md:w-[520px] snap-start">

        <!-- شارات أقصى اليمين واليسار (التوفير وحالة التوفر) -->
        <div class="absolute top-4 md:top-6 left-6 z-10 flex flex-col items-end gap-1.5">
          <!-- شارة التوفير -->
          <div v-if="offer.savings && offer.savings > 0"
            class="bg-green-500 text-white text-fluid-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Icon name="lucide:trending-down" class="w-3.5 h-3.5" />
            <span>وفّر {{ formatPrice(offer.savings) }} ج.م</span>
          </div>

          <!-- شارة حالة توفر الأصناف -->
          <div :class="[
            'text-fluid-xs font-bold px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-md',
            offer.all_items_available
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
          ]">
            {{ offer.all_items_available ? '✓ متوفر' : '⚠ بعض الأصناف ناقصة' }}
          </div>
        </div>

        <div>
          <!-- صورة العرض الرئيسية -->
          <div v-if="offer.image_url"
            class="mb-4 w-full h-44 rounded-2xl overflow-hidden border border-primary/10 relative shadow-inner">
            <img :src="offer.image_url" :alt="offer.title"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <!-- العنوان والوصف -->
          <div class="mb-fluid flex justify-between gap-fluid flex-wrap">
            <div class="w-full">
              <h3 class="text-fluid-h3 font-bold text-primary mb-fluid tracking-wide">{{ offer.title }}</h3>
              <p v-if="offer.description" class="text-fluid-sm text-text/70 leading-relaxed">
                {{ offer.description }}
              </p>
            </div>
            <!-- فترة صلاحية العرض -->
            <div v-if="offer.ends_at"
              class="flex w-full gap-fluid justify-between flex-wrap text-fluid-sm text-text/50 bg-bg/60 px-3 py-2 rounded-xl border border-primary/10 mt-2 mb-2">
              <span class="self-center">ينتهي العرض في:</span>

              <div class="flex gap-1">
                <Icon name="lucide:clock" class="w-3.5 h-3.5 text-primary self-center text-center" />
                <strong class="text-text/80 font-semibold self-center">
                  {{ formatDate(offer.ends_at) }}
                </strong>
              </div>
            </div>
          </div>

          <!-- اصناف ومكونات العرض التفصيلية -->
          <div v-if="offer.items?.length > 0"
            class="bg-bg/40 rounded-2xl p-fluid md:p-6 border border-primary/10 mb-fluid">
            <div class="flex items-center justify-between mb-2.5">
              <span class="text-xs font-bold text-primary flex items-center gap-1.5">
                <Icon name="lucide:list-tree" class="w-4 h-4" />
                <span>محتويات العرض ({{ offer.items?.length || 0 }} اصناف):</span>
              </span>
            </div>

            <ul class="flex flex-col gap-2">
              <li v-for="(item, idx) in offer.items" :key="idx"
                class="flex items-center justify-between bg-card/60 p-2.5 rounded-xl border border-primary/5 text-xs">
                <div class="flex items-center gap-fluid overflow-hidden">
                  <!-- صورة مصغرة للبند لو متوفرة -->
                  <div v-if="item.image_url || publicMenuStore.restaurant?.logo_url"
                    class="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-primary/10">
                    <img :src="item.image_url || publicMenuStore.restaurant?.logo_url"
                      class="w-full h-full object-cover" />
                  </div>
                  <div class="flex flex-col px-2 gap-1 truncate">
                    <!-- صياغة الجملة بشكل منطقي: (العدد + اسم الصنف) -->
                    <span class="font-bold text-text text-fluid-p truncate">
                      <span class="text-primary font-black">{{ item.quantity }}</span>
                      {{ item.title || item.custom_label }}
                    </span>

                    <!-- عرض السعر الإجمالي للبند لو متوفر السعر الفردي -->
                    <span v-if="item.unit_price" class="text-fluid-xs text-text/60">
                      الإجمالي: <strong class="text-primary font-bold">{{ formatPrice(item.unit_price * item.quantity)
                        }} ج.م</strong>
                      <span class="text-text/40">
                        ({{ formatPrice(item.unit_price) }} للقطعة)
                      </span>
                    </span>
                    <span v-else class="text-fluid-xs text-primary font-semibold">
                      مجاناً
                    </span>
                  </div>
                </div>

                <!-- مؤشر توفر البند الفردي (بدون تكرار الكمية) -->
                <div class="flex items-center gap-2 shrink-0">
                  <span :class="[
                    'w-2.5 h-2.5 rounded-full',
                    item.is_available ? 'bg-emerald-500' : 'bg-red-500'
                  ]" :title="item.is_available ? 'البند متوفر' : 'البند غير متوفر حالياً'"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- footer البطاقة: مقارنة الأسعار الواضحة (قبل وبعد العرض) -->
        <div class="pt-4 border-t border-primary/10 mt-auto flex flex-col gap-2">
          <!-- صندوق المقارنة الجاهز للعميل -->
          <div v-if="offer.original_total"
            class="bg-bg/60 p-3 rounded-xl border border-primary/10 flex flex-col gap-1.5 text-xs">
            <div class="flex items-center justify-between text-text/70">
              <span>السعر الإجمالي قبل العرض:</span>
              <span class="line-through font-bold text-text/50">{{ formatPrice(offer.original_total) }} ج.م</span>
            </div>
            <div class="flex items-center justify-between text-primary font-bold">
              <span>سعر العرض النهائي:</span>
              <span class="text-base font-black">
                {{ offer.offer_price !== null && offer.offer_price !== undefined ? `${formatPrice(offer.offer_price)}
                ج.م` : 'مجاني' }}
              </span>
            </div>
            <div v-if="offer.savings && offer.savings > 0"
              class="flex items-center justify-between text-green-500 font-bold pt-1 border-t border-primary/5">
              <span>وفرت معنا:</span>
              <span>{{ formatPrice(offer.savings) }} ج.م</span>
            </div>
          </div>

          <!-- footer البطاقة: سعر العرض الخاص بجوار السعر الأصلي المشطوب (المحسوب تلقائياً) -->
          <div v-if=" offer.offer_price !== null && offer.offer_price !== undefined"  class="pt-4 border-t border-primary/10 mt-auto flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-fluid-xs text-text/50 font-bold block mb-0.5">سعر العرض الخاص</span>
              <div class="flex items-baseline gap-2.5">
                <!-- السعر النهائي الجديد -->
                <span class="text-2xl font-black text-primary">
                  {{ formatPrice(offer.offer_price) }}
                  <span v-if="offer.offer_price" class="text-xs font-bold">ج.م</span>
                </span>
                <!-- السعر الأصلي المشطوب (محسوب تلقائياً) -->
                <span v-if="getOriginalTotal(offer) > (offer.offer_price || 0)"
                  class="text-xs text-text/40 line-through font-semibold">
                  {{ formatPrice(getOriginalTotal(offer)) }} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>