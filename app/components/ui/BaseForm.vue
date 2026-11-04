<script setup lang="ts">

// 🌟 1. تحديد واجهة البيانات الخاصة بالحقول لمنع أخطاء الـ TypeScript
interface FormField {
  column: string
  value: any
  label: string
  required: boolean
  type: 'text' | 'tel' | 'file' | 'textarea' | 'select' // الأنواع المدعومة
  colspan: string
  options?: { label: string; value: string }[] // الخاصية اختيارية هُنا
}

// 🌟 2. تمرير الواجهة البرمجية للمصفوفة عبر <FormField[]>
const forms = ref<FormField[]>([
  { column: 'name', value: '', label: 'اسم المطعم او الكافية', required: true, type: 'text', colspan: 'col-span-3 md:col-span-1' },

  { column: 'phone', value: '', label: 'رقم الهاتف', required: true, type: 'tel', colspan: 'col-span-3 md:col-span-1' },
  { column: 'whatsapp', value: '', label: 'رقم واتساب', required: false, type: 'tel', colspan: 'col-span-3 md:col-span-1' },
  { column: 'currency', value: '', label: 'العملة مثل (EGP | جنيه)', required: true, type: 'text', colspan: 'col-span-3 md:col-span-1' },

  { column: 'address', value: '', label: 'عنوان المطعم او الكافية', required: false, type: 'text', colspan: 'col-span-3 md:col-span-2' },
  { column: 'maps_url', value: '', label: 'رابط عنوان المكان (GPS)', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },

  { column: 'instagram_url', value: '', label: 'رابط انستجرام', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'facebook_url', value: '', label: 'رابط فيسبوك', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'timezone', value: '', label: 'المنطقة او البلد', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },

  { column: 'logo_url', value: '', label: 'صورة المطعم او الكافية', required: false, type: 'file', colspan: 'col-span-3' },
  { column: 'description', value: '', label: 'الوصف', required: false, type: 'textarea', colspan: 'col-span-3' },
])

// 🌟 1. كائن مستقل لإدارة مواعيد العمل داخل السكريبت وترجمتها للعربية
const workingHours = ref<Record<string, { open: string; close: string } | null>>({
  sat: null, sun: null, mon: null, tue: null, wed: null, thu: null, fri: null
})

// أسماء الأيام للعرض في الواجهة
const daysTranslation: Record<string, string> = {
  sat: 'السبت', sun: 'الأحد', mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة'
}

const restaurantStore = useRestaurantStore()

// 🌟 2. تحديث دالة التعبئة لتجلب المواعيد وتقوم بتشريحها (Parsing)
const fillFormData = () => {
  const restaurantData = restaurantStore.restaurant as Record<string, any>

  if (restaurantData) {
    // تعبئة الحقول العادية
    forms.value.forEach((field) => {
      if (restaurantData[field.column] !== undefined) {
        field.value = restaurantData[field.column] ?? ''
      }
    })

    // تعبئة ساعات العمل إن وجدت
    if (restaurantData.working_hours) {
      Object.keys(workingHours.value).forEach((day) => {
        const dayData = restaurantData.working_hours[day]
        if (dayData) {
          workingHours.value[day] = { open: dayData.open || '09:00', close: dayData.close || '23:00' }
        } else {
          workingHours.value[day] = null // مغلق
        }
      })
    }
  }
}

// دالة سريعة للتحويل بين حالة (مفتوح / مغلق) في الواجهة عند الضغط على الـ Checkbox
const toggleDay = (day: string, checked: boolean) => {
  workingHours.value[day] = checked ? { open: '09:00', close: '23:00' } : null
}

const handleFileChange = async (event: Event, formItem: any) => {
  const target = event.target as HTMLInputElement

  if (target.files && target.files[0]) {
    const file = target.files[0]

    // 1. تجهيز الـ FormData (الباك إند يتوقع "file" لأنك تستخدم req.file)
    const formData = new FormData()
    formData.append('logo', file)

    // 2. استدعاء دالة الرفع من الـ Store
    const res = await restaurantStore.uploadLogo(formData)

    // 3. الباك-إند يرجع الكائن المحدث في res.data، نأخذ منه الـ logo_url الجديد
    const updatedRestaurant = res.data

    // 4. تحديث قيمة الحقل في الفورم لعرض الصورة الجديدة فوراً
    formItem.value = updatedRestaurant.logo_url

    // 5. تحديث كائن الستور بالبيانات الكاملة المحدثة القادمة من الباك-إند
    restaurantStore.restaurant = updatedRestaurant
  }
}

const handleDeleteLogo = async () => {
  await restaurantStore.deleteLogo()
}

// 🌟 3. دمج ساعات العمل والحقول النصية داخل كائن الـ Payload النهائي عند الإرسال
const formDataPayload = computed(() => {
  const payload = forms.value.reduce((acc, field) => {
    acc[field.column] = field.value
    return acc
  }, {} as Record<string, any>)

  // نرفق ساعات العمل المهيأة تماماً كـ Object للباك-إند
  payload['working_hours'] = workingHours.value
  return payload
})


const handleSubmit = async () => {
  // نأخذ نسخة عميقة من الـ payload لمنع التأثير على الواجهة
  const payload = { ...formDataPayload.value }

  // حذف كولوم الصورة تماماً من الطلب النصي لأن له مسار مخصص تم تنفيذه بنجاح
  delete payload.logo_url

  // إرسال البيانات النصية ومواعيد العمل فقط
  await restaurantStore.updateRestaurant(payload)
}

onMounted(async () => {
  await restaurantStore.fetchRestaurant()
  fillFormData()
})

</script>

<template>
  <div v-if="restaurantStore.isLoading">
    <span>Loading...</span>
  </div>
  
  <div v-else-if="restaurantStore.restaurant" class="max-w-5xl mx-auto">
    <form @submit.prevent="handleSubmit" class="grid grid-cols-3 gap-4">

      <!-- الحقول الديناميكية العادية -->
      <div v-for="form in forms" :key="form.column" :class="form.colspan" class="flex flex-col">
        <label class="block text-xs font-medium text-primary mb-1.5">
          {{ form.label }} <span v-if="form.required" class="text-red-500">*</span>
        </label>

        <textarea v-if="form.type === 'textarea'" v-model="form.value" :placeholder="form.label"
          :required="form.required" rows="3"
          class="w-full min-h-30 p-fluid rounded-xl bg-card border border-primary/10 text-text/80 text-sm focus:outline-none focus:border-primary resize-none"></textarea>

        <!-- خيار 2: إذا كان الحقل ملف/صورة -->
        <div v-else-if="form.type === 'file'"
          class="flex flex-col gap-fluid w-full bg-card/40 p-fluid rounded-2xl border border-primary/5">

          <!-- الجزء العلوي: إدارة الصورة الحالية (تظهر فقط إذا كان هناك لوجو مسجل) -->
          <div v-if="form.value && typeof form.value === 'string'"
            class="flex flex-wrap items-center justify-between gap-fluid bg-bg p-fluid rounded-xl border border-primary/10">
            <div class="flex items-center gap-3">
              <img :src="form.value" class="w-16 h-16 object-contain rounded-xl border border-primary/10 bg-card p-1 shadow-xs"
                alt="Logo" />
              <div class="flex flex-col gap-1">
                <p class="text-xs font-bold text-text">اللوجو الحالي للمطعم</p>
                <p class="text-[9px] text-text/80">صيغة الملف المدعومة: AVIF / PNG / JPG / WEB</p>
              </div>
            </div>

            <!-- زر حذف الصورة ملوّن باللون الأحمر ليعبر عن وظيفته بشكل صحيح -->
            <button type="button" @click="handleDeleteLogo" :disabled="restaurantStore.isLoading"
              class="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold text-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="restaurantStore.isLoading">جاري الحذف...</span>
              <span v-else class="flex items-center gap-1">
                <Icon name="lucide:trash-2" class="w-4 h-4" /> حذف الصورة
              </span>
            </button>
          </div>

          <!-- الجزء السفلي: حقل اختيار ملف جديد (يأخذ المساحة الكاملة بشكل منسق) -->
          <div class="flex flex-col gap-1.5 w-full">
            <p v-if="form.value && typeof form.value === 'string'" class="text-[11px] font-medium text-text/60">تغيير
              الصورة أو رفع لوجو جديد:</p>
            <input type="file" accept="image/*" @change="(e) => handleFileChange(e, form)" :required="form.required"
              class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text/80 text-sm focus:outline-none focus:border-primary file:ml-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer" />
          </div>

        </div>


        <select v-else-if="form.type === 'select'" v-model="form.value" :required="form.required"
          class="w-full p-fluid rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary">
          <option v-for="opt in form.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>

        <input v-else v-model="form.value" :type="form.type" :placeholder="form.label" :required="form.required"
          class="w-full p-fluid rounded-xl bg-card border border-primary/10 text-text/80 text-sm focus:outline-none focus:border-primary" />
      </div>

      <!-- 🌟 قسم مواعيد العمل المنفصل والمطور في التصميم -->
      <div class="col-span-3 border-t border-primary/10 pt-6 mt-2">
        <h3 class="text-sm font-bold text-primary mb-4">ساعات العمل الأسبوعية</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-card p-4 rounded-xl border border-primary/5">
          <div v-for="(value, day) in workingHours" :key="day"
            class="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition">

            <!-- زر التفعيل والتعطيل لليوم -->
            <div class="flex items-center gap-3 w-1/3">
              <input type="checkbox" :id="day" :checked="!!value"
                @change="(e) => toggleDay(day, (e.target as HTMLInputElement).checked)"
                class="w-4 h-4 rounded text-primary focus:ring-primary border-primary/20" />
              <label :for="day" class="text-sm font-medium text-text/80 cursor-pointer">{{ daysTranslation[day]
                }}</label>
            </div>

            <!-- حقول اختيار الوقت (تظهر فقط إذا كان اليوم مفتوحاً) -->
            <div v-if="value" class="flex items-center gap-2 w-2/3 justify-end">
              <input type="time" v-model="value.open"
                class="p-1.5 rounded-lg border border-primary/10 bg-bg text-xs text-text/80 focus:outline-none focus:border-primary" />
              <span class="text-xs text-text/40">إلى</span>
              <input type="time" v-model="value.close"
                class="p-1.5 rounded-lg border border-primary/10 bg-bg text-xs text-text/80 focus:outline-none focus:border-primary" />
            </div>

            <!-- نص يظهر إذا كان اليوم مغلقاً -->
            <div v-else class="text-xs text-red-500/70 font-medium w-2/3 text-left pl-2">
              مغلق طوال اليوم
            </div>

          </div>
        </div>
      </div>

      <!-- زر الحفظ والإرسال -->
      <div class="col-span-3 flex justify-end mt-4">
        <button type="submit"
          class="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition cursor-pointer">
          {{ restaurantStore.isLoading ? 'جاري الحفظ...' : ' حفظ التغييرات' }}
        </button>
      </div>
    </form>
  </div>
</template>
