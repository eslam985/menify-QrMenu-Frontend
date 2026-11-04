<!-- app/pages/dashboard/offers/[id].vue -->
<script setup lang="ts">
import { useOfferStore } from '~/stores/offer'
import { useCategoryStore } from '~/stores/category'
import { useItemStore } from '~/stores/item'
import { useNotificationStore } from '~/stores/notification'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const route = useRoute()
const router = useRouter()
const offerStore = useOfferStore()
const categoryStore = useCategoryStore()
const itemStore = useItemStore()
const notiStore = useNotificationStore()

const isEditMode = computed(() => route.params.id !== 'new')
const offerId = computed(() => (isEditMode.value ? (route.params.id as string) : null))

const form = reactive({
  title: '',
  description: '',
  offer_price: null as number | null,
  starts_at: '',
  ends_at: '',
  is_active: true,
  items: [] as { 
    menu_item_id?: string; 
    custom_label?: string; 
    selected_category_id?: string; 
    quantity: number 
  }[],
})

const errorMessage = ref('')
const isSubmitting = ref(false)

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    itemStore.fetchItems(),
  ])

  if (isEditMode.value && offerId.value) {
    // لو وضع تعديل، نجيب بيانات العرض
    const existingOffer = offerStore.offers.find((o) => o.id === offerId.value)
    if (existingOffer) {
      form.title = existingOffer.title || ''
      form.description = existingOffer.description || ''
      form.offer_price = existingOffer.offer_price ?? null
      form.starts_at = existingOffer.starts_at ? new Date(existingOffer.starts_at).toISOString().slice(0, 16) : ''
      form.ends_at = existingOffer.ends_at ? new Date(existingOffer.ends_at).toISOString().slice(0, 16) : ''
      form.is_active = existingOffer.is_active ?? true
      form.items = existingOffer.items ? JSON.parse(JSON.stringify(existingOffer.items)) : []
    } else {
      await offerStore.fetchOffers()
      const fetched = offerStore.offers.find((o) => o.id === offerId.value)
      if (fetched) {
        form.title = fetched.title || ''
        form.description = fetched.description || ''
        form.offer_price = fetched.offer_price ?? null
        form.starts_at = fetched.starts_at ? new Date(fetched.starts_at).toISOString().slice(0, 16) : ''
        form.ends_at = fetched.ends_at ? new Date(fetched.ends_at).toISOString().slice(0, 16) : ''
        form.is_active = fetched.is_active ?? true
        form.items = fetched.items ? JSON.parse(JSON.stringify(fetched.items)) : []
      }
    }
  }
})

const addMenuItemToOffer = () => {
  form.items.push({ menu_item_id: '', selected_category_id: '', quantity: 1 })
}

const addCustomItemToOffer = () => {
  form.items.push({ custom_label: '', quantity: 1 })
}

const removeItemFromOffer = (index: number) => {
  form.items.splice(index, 1)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    const payload: any = {
      title: form.title,
      description: form.description || null,
      offer_price: form.offer_price !== null ? Number(form.offer_price) : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      is_active: form.is_active,
      items: form.items.map((i) => {
        if ('menu_item_id' in i) {
          return { menu_item_id: i.menu_item_id, quantity: i.quantity }
        }
        return { custom_label: i.custom_label, quantity: i.quantity }
      }).filter((i) => i.menu_item_id || i.custom_label),
    }

    if (form.starts_at) {
      payload.starts_at = new Date(form.starts_at).toISOString()
    }

    let success = false
    if (isEditMode.value && offerId.value) {
      success = await offerStore.updateOffer(offerId.value, payload)
    } else {
      success = await offerStore.addOffer(payload)
    }

    if (success !== false) {
      router.push('/dashboard/offers')
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'فشل حفظ العرض'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-12">
    <!-- الهيدر وعودة للخلف -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-primary">
          {{ isEditMode ? 'تعديل العرض' : 'إضافة عرض جديد' }}
        </h1>
        <p class="text-xs text-text/60 mt-1">قم بملء البيانات وتحديد بنود العرض بدقة</p>
      </div>
      <NuxtLink
        to="/dashboard/offers"
        class="px-4 py-2 rounded-xl bg-card border border-primary/10 text-text text-xs font-bold hover:bg-primary/5 transition"
      >
        ← العودة للعروض
      </NuxtLink>
    </div>

    <!-- نموذج النموذج في صفحة كاملة -->
    <form @submit.prevent="handleSubmit" class="bg-card p-6 md:p-8 rounded-2xl border border-primary/10 shadow-lg flex flex-col gap-6">
      
      <!-- عنوان العرض -->
      <div>
        <label class="block text-xs font-bold text-text/80 mb-2">عنوان العرض</label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="مثال: عرض الويك إند الكبير"
          class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary shadow-xs" 
          required 
        />
      </div>

      <!-- السعر والحالة -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-bold text-text/80 mb-2">سعر العرض (ج.م) - اختياري</label>
          <input 
            v-model.number="form.offer_price" 
            type="number" 
            step="0.01" 
            min="0" 
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary shadow-xs" 
            placeholder="اتركه فارغاً إذا لم يوجد سعر محدد" 
          />
        </div>

        <div class="flex items-center gap-3 pt-8">
          <input v-model="form.is_active" type="checkbox" id="is_active" class="w-5 h-5 accent-primary cursor-pointer" />
          <label for="is_active" class="text-sm font-bold text-text cursor-pointer">العرض نشط حالياً للعملاء</label>
        </div>
      </div>

      <!-- تواريخ البداية والنهاية -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-bold text-text/80 mb-2">يبدأ في (اختياري)</label>
          <input 
            v-model="form.starts_at" 
            type="datetime-local" 
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary shadow-xs" 
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-text/80 mb-2">ينتهي في</label>
          <input 
            v-model="form.ends_at" 
            type="datetime-local" 
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary shadow-xs" 
            required 
          />
        </div>
      </div>

      <!-- الوصف -->
      <div>
        <label class="block text-xs font-bold text-text/80 mb-2">تفاصيل ووصف العرض</label>
        <textarea 
          v-model="form.description" 
          rows="4" 
          class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary shadow-xs" 
          placeholder="اكتب تفاصيل العرض وما يشمله..."
        ></textarea>
      </div>

      <!-- قسم بنود العرض الذكي -->
      <div class="border-t border-primary/10 pt-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-bold text-primary">بنود ومكونات العرض</h3>
            <p class="text-[11px] text-text/60">أضف الأصناف المرتبطة من القائمة أو نصوص مخصصة</p>
          </div>
          <div class="flex gap-2">
            <button type="button" @click="addMenuItemToOffer" class="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer">
              + صنف من المنيو
            </button>
            <button type="button" @click="addCustomItemToOffer" class="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer">
              + نص مخصص
            </button>
          </div>
        </div>

        <div v-if="form.items.length === 0" class="text-center py-8 bg-bg rounded-2xl border border-dashed border-primary/20 text-text/40 text-xs">
          لا توجد بنود مضافة لهذا العرض بعد. استخدم الأزرار بالاعلى لإضافة محتويات العرض.
        </div>

        <div class="flex flex-col gap-3">
          <div v-for="(item, index) in form.items" :key="index" class="flex flex-col md:flex-row items-center gap-3 bg-bg p-4 rounded-2xl border border-primary/10 shadow-2xs">
            
            <!-- إذا كان صنف من المنيو -->
            <template v-if="'menu_item_id' in item">
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <!-- اختيار التصنيف -->
                <select 
                  v-model="item.selected_category_id" 
                  class="w-full p-3 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary"
                >
                  <option value="">جميع التصنيفات ({{ categoryStore.categories.length }})</option>
                  <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }} — ({{ cat.section }})
                  </option>
                </select>

                <!-- اختيار الصنف -->
                <select 
                  v-model="item.menu_item_id" 
                  class="w-full p-3 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary"
                  required
                >
                  <option value="" disabled>اختر الصنف المطلوب</option>
                  <option 
                    v-for="menuItem in itemStore.items.filter(i => !item.selected_category_id || i.category_id === item.selected_category_id)" 
                    :key="menuItem.id" 
                    :value="menuItem.id"
                  >
                    {{ menuItem.title }} — ({{ menuItem.price }} ج.م)
                  </option>
                </select>
              </div>
            </template>

            <!-- إذا كان نص مخصص -->
            <template v-else>
              <div class="flex-1 w-full">
                <input 
                  v-model="item.custom_label" 
                  type="text" 
                  placeholder="مثال: مشروب غازي مجاني، توصيل مجاني..." 
                  class="w-full p-3 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </template>

            <!-- الكمية وحذف البند -->
            <div class="flex items-center gap-3 w-full md:w-auto justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs text-text/70 font-bold">الكمية:</span>
                <input 
                  v-model.number="item.quantity" 
                  type="number" 
                  min="1" 
                  max="99" 
                  class="w-20 p-3 rounded-xl bg-card border border-primary/10 text-text text-xs text-center focus:outline-none focus:border-primary font-bold" 
                  required
                />
              </div>

              <button type="button" @click="removeItemFromOffer(index)" class="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs cursor-pointer transition">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-xs bg-red-500/10 p-3 rounded-xl">{{ errorMessage }}</p>

      <!-- أزرار الحفظ الثابتة والواضحة -->
      <div class="flex items-center gap-4 pt-6 border-t border-primary/10">
        <button 
          type="submit" 
          :disabled="isSubmitting" 
          class="px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-md"
        >
          {{ isEditMode ? 'حفظ التعديلات' : 'إضافة العرض الآن' }}
        </button>
        <NuxtLink 
          to="/dashboard/offers" 
          class="px-6 py-3.5 rounded-xl bg-card border border-primary/10 text-text font-bold text-sm hover:bg-primary/5 transition text-center"
        >
          إلغاء
        </NuxtLink>
      </div>

    </form>
  </div>
</template>