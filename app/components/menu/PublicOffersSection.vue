<!-- app/components/menu/PublicOffersSection.vue -->
<script setup lang="ts">
import type { OfferItemResponse } from "@/types/dataType/offerType";
import type { PublicOffer } from "@/types/dataType/publicMenuType";
const publicMenuStore = usePublicMenuStore();

const getOriginalTotal = (offer: PublicOffer) => {
  if (offer.original_total) return offer.original_total;

  if (!offer.items || !offer.items.length) return 0;

  return offer.items.reduce((sum: number, item: OfferItemResponse) => {
    const unitPrice = item.unit_price || 0;
    const qty = item.quantity || 0;
    return sum + unitPrice * qty;
  }, 0);
};
</script>

<template>
  <div
    dir="rtl"
    v-if="publicMenuStore.offers && publicMenuStore.offers.length > 0"
    class="mb-section-fluid"
  >
    <div class="gap-fluid mb-fluid flex flex-wrap items-center justify-between">
      <h2
        class="text-fluid-h3 text-primary flex items-center gap-2.5 font-black"
      >
        <div
          class="bg-primary/10 border-primary/20 text-primary rounded-xl border p-2"
        >
          <Icon name="lucide:sparkles" class="h-6 w-6 animate-pulse" />
        </div>
        <span>العروض والخصومات الحصرية</span>
      </h2>
      <span
        class="text-fluid-xs text-primary/60 bg-card border-primary/10 px-fluid rounded-xl border py-1.5 font-bold"
      >
        العروض المتاحة {{ publicMenuStore.offers.length }}
      </span>
    </div>

    <div
      class="scrollbar-thumb-primary/20 gap-fluid flex snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent overflow-x-auto pt-1 pb-4"
    >
      <div
        v-for="offer in publicMenuStore.offers"
        :key="offer.id"
        class="bg-card border-primary/20 p-fluid group hover:border-primary/50 relative flex w-[90%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border shadow-xl duration-300 sm:w-[480px] md:w-[520px]"
      >
        <div
          class="md:top-section-fluid absolute top-2 left-2 z-10 flex flex-col items-end gap-1.5"
        >
          <div
            v-if="offer.savings && offer.savings > 0"
            class="text-fluid-xs px-fluid flex items-center gap-1 rounded-full bg-green-500 py-1 font-black text-white shadow-md"
          >
            <Icon name="lucide:trending-down" class="h-3.5 w-3.5" />
            <span>وفّر {{ formatPrice(offer.savings) }} ج.م</span>
          </div>

          <div
            :class="[
              'text-fluid-xs rounded-full border px-2.5 py-0.5 font-bold shadow-xs',
              offer.all_items_available
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-500',
            ]"
          >
            {{ offer.all_items_available ? "✓ متوفر" : "⚠ بعض الأصناف ناقصة" }}
          </div>
        </div>

        <div>
          <div
            v-if="offer.image_url"
            class="border-primary/10 mb-fluid relative h-44 w-full overflow-hidden rounded-2xl border shadow-inner"
          >
            <img
              :src="offer.image_url"
              :alt="offer.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
            ></div>
          </div>

          <div class="mb-fluid gap-fluid flex flex-wrap justify-between">
            <div class="w-full">
              <h3
                class="text-fluid-h3 text-primary mb-section-fluid font-bold tracking-wide"
              >
                {{ offer.title }}
              </h3>
              <p
                v-if="offer.description"
                class="text-fluid-sm text-text/70 leading-relaxed"
              >
                {{ offer.description }}
              </p>
            </div>

            <div
              v-if="offer.ends_at"
              class="gap-fluid text-fluid-sm text-text/50 bg-bg/60 border-primary/10 px-fluid mt-2 mb-2 flex w-full flex-wrap justify-between rounded-xl border py-2"
            >
              <span class="self-center">ينتهي العرض في:</span>

              <div class="flex gap-1">
                <Icon
                  name="lucide:clock"
                  class="text-primary h-3.5 w-3.5 self-center text-center"
                />
                <strong class="text-text/80 self-center font-semibold">
                  {{ formatDate(offer.ends_at) }}
                </strong>
              </div>
            </div>
          </div>

          <div
            v-if="offer.items?.length > 0"
            class="bg-bg/40 p-fluid border-primary/10 mb-fluid md:p-section-fluid rounded-2xl border"
          >
            <div class="mb-2.5 flex items-center justify-between">
              <span
                class="text-primary text-fluid-xs flex items-center gap-1.5 font-bold"
              >
                <Icon name="lucide:list-tree" class="h-4 w-4" />
                <span
                  >محتويات العرض ({{ offer.items?.length || 0 }} اصناف):</span
                >
              </span>
            </div>

            <ul class="flex flex-col gap-2">
              <li
                v-for="(item, idx) in offer.items"
                :key="idx"
                class="bg-card/60 border-primary/5 text-fluid-xs flex items-center justify-between rounded-xl border p-2.5"
              >
                <div class="gap-fluid flex items-center overflow-hidden">
                  <div
                    v-if="
                      item.image_url || publicMenuStore.restaurant?.logo_url
                    "
                    class="border-primary/10 h-20 w-20 shrink-0 overflow-hidden rounded-lg border"
                  >
                    <img
                      :src="
                        item.image_url ||
                        publicMenuStore.restaurant?.logo_url ||
                        undefined
                      "
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="flex flex-col gap-1 truncate px-2">
                    <span class="text-text text-fluid-p truncate font-bold">
                      <span class="text-primary font-black">{{
                        item.quantity
                      }}</span>
                      {{ item.title || item.custom_label }}
                    </span>

                    <span
                      v-if="item.unit_price"
                      class="text-fluid-xs text-text/60"
                    >
                      الإجمالي:
                      <strong class="text-primary font-bold"
                        >{{
                          formatPrice(item.unit_price * item.quantity)
                        }}
                        ج.م</strong
                      >
                      <span class="text-text/40">
                        ({{ formatPrice(item.unit_price) }} للقطعة)
                      </span>
                    </span>
                    <span
                      v-else
                      class="text-fluid-xs text-primary font-semibold"
                    >
                      مجاناً
                    </span>
                  </div>
                </div>

                <div class="flex shrink-0 items-center gap-2">
                  <span
                    :class="[
                      'h-2.5 w-2.5 rounded-full',
                      item.is_available ? 'bg-emerald-500' : 'bg-danger',
                    ]"
                    :title="item.is_available ? 'متوفر' : ' غير متوفر حالياً'"
                  >
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border-primary/10 mt-auto flex flex-col gap-2 border-t pt-4"
        >
          <div
            v-if="offer.original_total"
            class="bg-bg/60 border-primary/10 p-fluid text-fluid-xs flex flex-col gap-1.5 rounded-xl border"
          >
            <div class="text-text/70 flex items-center justify-between">
              <span>السعر الإجمالي قبل العرض:</span>
              <span class="text-text/50 font-bold line-through"
                >{{ formatPrice(offer.original_total) }} ج.م</span
              >
            </div>
            <div
              class="text-primary flex items-center justify-between font-bold"
            >
              <span>سعر العرض النهائي:</span>
              <span class="text-base font-black">
                {{
                  offer.offer_price !== null && offer.offer_price !== undefined
                    ? `${formatPrice(offer.offer_price)}
                ج.م`
                    : "مجاني"
                }}
              </span>
            </div>
            <div
              v-if="offer.savings && offer.savings > 0"
              class="border-primary/5 flex items-center justify-between border-t pt-1 font-bold text-green-500"
            >
              <span>وفرت معنا:</span>
              <span>{{ formatPrice(offer.savings) }} ج.م</span>
            </div>
          </div>

          <div
            v-if="offer.offer_price !== null && offer.offer_price !== undefined"
            class="border-primary/10 mt-auto flex flex-col gap-2 border-t pt-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-fluid-xs text-text/50 mb-0.5 block font-bold"
                >سعر العرض الخاص</span
              >
              <div class="flex items-baseline gap-2.5">
                <span class="text-primary text-fluid-p font-black">
                  {{ formatPrice(offer.offer_price) }}
                  <span v-if="offer.offer_price" class="text-fluid-xs font-bold"
                    >ج.م</span
                  >
                </span>

                <span
                  v-if="getOriginalTotal(offer) > (offer.offer_price || 0)"
                  class="text-text/40 text-fluid-xs font-semibold line-through"
                >
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
