<!-- app/components/dashboard/offers/OfferForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from '~/composables/useForm'

const props = defineProps<{
  offerId?: string | null
}>()

const router = useRouter()
const categoryStore = useCategoryStore()
const offerStore = useOfferStore()
const itemStore = useItemStore()

const isEditMode = computed(() => Boolean(props.offerId))

// 1. تهيئة نسخة مستقلة من useForm وحقنها لـ UiBaseForm
const formInstance = useForm()
const { setFormConfig, formDataPayload, isSubmitting, resetForm } = formInstance
provide('current_form_instance', formInstance)

// 2. الحقول الخاصة خارج الحقول النصية القياسية
const startsAt = ref('')
const endsAt = ref('')
const isActive = ref(true)
const errorMessage = ref('')
const items = ref<{
  menu_item_id?: string
  custom_label?: string
  selected_category_id?: string
  quantity: number
}[]>([])

// 3. هيكل الحقول القياسية لـ UiBaseForm
const offerFieldsConfig: FormField[] = [
  {
    column: 'title',
    value: '',
    label: 'عنوان العرض (مثال: عرض الويك إند الكبير)',
    required: true,
    type: 'text',
    colspan: 'col-span-3 md:col-span-2',
  },
  {
    column: 'offer_price',
    value: '',
    label: 'سعر العرض (ج.م) - اختياري',
    required: false,
    type: 'number',
    colspan: 'col-span-3 md:col-span-1',
  },
  {
    column: 'description',
    value: '',
    label: 'تفاصيل ووصف العرض',
    required: false,
    type: 'textarea',
    colspan: 'col-span-3',
  },
]

// 4. دوال إدارة بنود العرض
const addMenuItemToOffer = () => {
  items.value.push({ menu_item_id: '', selected_category_id: '', quantity: 1 })
}

const addCustomItemToOffer = () => {
  items.value.push({ custom_label: '', quantity: 1 })
}

const removeItemFromOffer = (index: number) => {
  items.value.splice(index, 1)
}

// 5. دالة موحدة لتعبئة البيانات في وضع التعديل (منع التكرار - DRY)
const populateOfferData = (offer: any) => {
  startsAt.value = offer.starts_at ? new Date(offer.starts_at).toISOString().slice(0, 16) : ''
  endsAt.value = offer.ends_at ? new Date(offer.ends_at).toISOString().slice(0, 16) : ''
  isActive.value = offer.is_active ?? true
  items.value = offer.items ? JSON.parse(JSON.stringify(offer.items)) : []

  setFormConfig(offerFieldsConfig, handleSubmit, {
    title: offer.title || '',
    offer_price: offer.offer_price ?? '',
    description: offer.description || '',
  })
}

// 6. دالة الحفظ والإرسال
const handleSubmit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const rawPrice = formDataPayload.value.offer_price
    const payload: any = {
      title: formDataPayload.value.title,
      description: formDataPayload.value.description || null,
      offer_price: rawPrice !== '' && rawPrice !== null ? Number(rawPrice) : null,
      ends_at: endsAt.value
        ? new Date(endsAt.value).toISOString()
        : new Date(Date.now() + 86400000).toISOString(),
      is_active: isActive.value,
      items: items.value
        .map((i) => {
          if ('menu_item_id' in i) {
            return { menu_item_id: i.menu_item_id, quantity: i.quantity }
          }
          return { custom_label: i.custom_label, quantity: i.quantity }
        })
        .filter((i) => i.menu_item_id || i.custom_label),
    }

    if (startsAt.value) {
      payload.starts_at = new Date(startsAt.value).toISOString()
    }

    let success = false
    if (isEditMode.value && props.offerId) {
      success = await offerStore.updateOffer(props.offerId, payload)
    } else {
      success = await offerStore.addOffer(payload)
    }

    if (success !== false) {
      resetForm()
      router.push('/dashboard/offers')
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'فشل حفظ العرض'
  } finally {
    isSubmitting.value = false
  }
}

// 7. التحميل الذكي مع الكاش عند الفتح
onMounted(async () => {
  const tasks: Promise<any>[] = []
  if (categoryStore.categoriesCount < 1) tasks.push(categoryStore.fetchCategories())
  if (itemStore.items?.length < 1) tasks.push(itemStore.fetchItems())
  if (tasks.length > 0) await Promise.all(tasks)

  if (isEditMode.value && props.offerId) {
    let targetOffer = offerStore.offers.find((o) => o.id === props.offerId)
    if (!targetOffer) {
      await offerStore.fetchOffers()
      targetOffer = offerStore.offers.find((o) => o.id === props.offerId)
    }
    if (targetOffer) populateOfferData(targetOffer)
  } else {
    resetForm()
    setFormConfig(offerFieldsConfig, handleSubmit)
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto pb-12">
    <!-- الهيدر وزر العودة -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-fluid-h3 font-bold text-primary">
          {{ isEditMode ? 'تعديل العرض' : 'إضافة عرض جديد' }}
        </h1>
        <p class="text-xs text-text/60 mt-1">قم بملء البيانات وتحديد بنود العرض بدقة</p>
      </div>
      <NuxtLink to="/dashboard/offers"
        class="px-4 py-2 rounded-xl bg-card border border-primary/10 text-text text-xs font-bold hover:bg-primary/5 transition">
        ← العودة للعروض
      </NuxtLink>
    </div>

    <!-- حاوية الفورم الموحد -->
    <div class="bg-card p-6 md:p-8 rounded-card border border-primary/10 shadow-lg">
      <UiBaseForm>
        <!-- حقن التواريخ، حالة العرض، وبنود العرض قبل أزرار الحفظ -->
        <template #extra-fields>
          <div class="flex flex-col gap-6 mt-2">
            <!-- تواريخ البداية والنهاية + حالة التفعيل -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label class="block text-fluid-xs font-medium text-primary mb-1.5">يبدأ في (اختياري)</label>
                <input v-model="startsAt" type="datetime-local"
                  class="w-full p-fluid rounded-xl bg-bg border border-primary/10 text-text/80 text-fluid-p focus:outline-none focus:border-primary transition-colors" />
              </div>

              <div>
                <label class="block text-fluid-xs font-medium text-primary mb-1.5">
                  ينتهي في <span class="text-denger">*</span>
                </label>
                <input v-model="endsAt" type="datetime-local" required
                  class="w-full p-fluid rounded-xl bg-bg border border-primary/10 text-text/80 text-fluid-p focus:outline-none focus:border-primary transition-colors" />
              </div>

              <div class="flex items-center gap-2.5 pb-3">
                <input v-model="isActive" type="checkbox" id="is_active"
                  class="w-4 h-4 accent-primary rounded border-primary/20 cursor-pointer" />
                <label for="is_active" class="text-fluid-xs font-bold text-text cursor-pointer select-none">
                  العرض نشط حالياً للعملاء
                </label>
              </div>
            </div>

            <!-- قسم بنود ومكونات العرض الذكي -->
            <div class="border-t border-primary/10 pt-6">
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 class="text-sm font-bold text-primary">بنود ومكونات العرض</h3>
                  <p class="text-[11px] text-text/60">أضف الأصناف المرتبطة من القائمة أو نصوص مخصصة</p>
                </div>
                <div class="flex gap-2">
                  <button type="button" @click="addMenuItemToOffer"
                    class="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer">
                    + صنف من المنيو
                  </button>
                  <button type="button" @click="addCustomItemToOffer"
                    class="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer">
                    + نص مخصص
                  </button>
                </div>
              </div>

              <div v-if="items.length === 0"
                class="text-center py-8 bg-bg rounded-2xl border border-dashed border-primary/20 text-text/40 text-xs">
                لا توجد بنود مضافة لهذا العرض بعد. استخدم الأزرار بالأعلى لإضافة محتويات العرض.
              </div>

              <div class="flex flex-col gap-3">
                <div v-for="(item, index) in items" :key="index"
                  class="flex flex-col md:flex-row items-center gap-3 bg-bg p-4 rounded-2xl border border-primary/10 shadow-2xs">
                  <!-- إذا كان صنف من المنيو -->
                  <template v-if="'menu_item_id' in item">
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      <select v-model="item.selected_category_id"
                        class="w-full p-3 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary">
                        <option value="">جميع التصنيفات ({{ categoryStore.categories.length }})</option>
                        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                          {{ cat.name }} — ({{ cat.section }})
                        </option>
                      </select>

                      <select v-model="item.menu_item_id" required
                        class="w-full p-3 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary">
                        <option value="" disabled>اختر الصنف المطلوب</option>
                        <option
                          v-for="menuItem in itemStore.items.filter(i => !item.selected_category_id || i.category_id === item.selected_category_id)"
                          :key="menuItem.id" :value="menuItem.id">
                          {{ menuItem.title }} — ({{ menuItem.price }} ج.م)
                        </option>
                      </select>
                    </div>
                  </template>

                  <!-- إذا كان نص مخصص -->
                  <template v-else>
                    <div class="flex-1 w-full">
                      <input v-model="item.custom_label" type="text" required
                        placeholder="مثال: مشروب غازي مجاني، توصيل مجاني..."
                        class="w-full p-3 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </template>

                  <!-- الكمية وحذف البند -->
                  <div class="flex items-center gap-3 w-full md:w-auto justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-text/70 font-bold">الكمية:</span>
                      <input v-model.number="item.quantity" type="number" min="1" max="99" required
                        class="w-20 p-3 rounded-xl bg-card border border-primary/10 text-text text-xs text-center focus:outline-none focus:border-primary font-bold" />
                    </div>

                    <button type="button" @click="removeItemFromOffer(index)"
                      class="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs cursor-pointer transition">
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- رسالة الخطأ إن وجدت -->
            <p v-if="errorMessage" class="text-red-500 text-xs bg-red-500/10 p-3 rounded-xl">
              {{ errorMessage }}
            </p>
          </div>
        </template>

        <!-- زر الإلغاء بجانب زر الحفظ -->
        <template #actions>
          <NuxtLink to="/dashboard/offers"
            class="px-5 py-2.5 rounded-xl bg-bg border border-primary/10 text-text font-bold text-xs hover:bg-primary/5 transition">
            إلغاء
          </NuxtLink>
        </template>
      </UiBaseForm>
    </div>
  </div>
</template>
