<!-- app/components/ui/BaseForm.vue -->
<script setup lang="ts">
import { inject } from 'vue' // 🌟 تأكد من إضافة هذا الاستيراد صراحةً
// التقاط الـ Instance المحقون من الأب تلقائياً
const { fields, isSubmitting, workingHours, toggleDay, onSubmitHandler } = inject('current_form_instance') as any

// أسماء الأيام لعرضها في حال تفعيل جزء مواعيد العمل
const daysTranslation: Record<string, string> = {
  sat: 'السبت',
  sun: 'الأحد',
  mon: 'الإثنين',
  tue: 'الثلاثاء',
  wed: 'الأربعاء',
  thu: 'الخميس',
  fri: 'الجمعة'
}

</script>

<template>
  <form @submit.prevent="onSubmitHandler" class="grid grid-cols-3 gap-fluid w-full">
    <!-- حقول خداع ذكية لمنع المتصفح من ملء بيانات الموظف تلقائياً ببيانات الأدمن -->
    <input type="text" name="email" style="display:none; width: 0; height: 0;" autocomplete="username" />
    <input type="password" name="password" style="display:none; width: 0; height: 0;" autocomplete="new-password" />

    <!-- 1. الحقول الديناميكية المشتركة -->
    <div v-for="form in fields" :key="form.column" :class="form.colspan || 'col-span-3'" class="flex flex-col">
      <!-- العنوان لكل حقل -->
      <label class="block text-fluid-xs font-medium text-primary mb-1.5 select-none">
        {{ form.label }} <span v-if="form.required" class="text-denger">*</span>
      </label>

      <!-- نوع الحقل: Textarea -->
      <textarea v-if="form.type === 'textarea'" v-model="form.value" :placeholder="form.label" :required="form.required"
        rows="3"
        class="w-full min-h-[120px] p-fluid rounded-xl bg-card border border-primary/10 text-text/80 text-fluid-p focus:outline-none focus:border-primary resize-none transition-colors"></textarea>

      <!-- نوع الحقل: Select Menu -->
      <select v-else-if="form.type === 'select'" v-model="form.value" :required="form.required"
        class="w-full p-fluid rounded-xl bg-card border border-primary/10 text-text/80 text-fluid-p focus:outline-none focus:border-primary transition-colors appearance-none">
        <option value="" disabled selected>اختر من القائمة...</option>
        <option v-for="option in form.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- الحقول القياسية (text, tel, password) -->
      <input v-else-if="form.type !== 'file'" :type="form.type" v-model="form.value" :placeholder="form.label"
        :required="form.required"
        :autocomplete="form.type === 'password' ? 'new-password' : 'off'"
        class="w-full p-fluid rounded-xl bg-card border border-primary/10 text-text/80 text-fluid-p focus:outline-none focus:border-primary transition-colors" />

    </div>

    <!-- 2. شق مواعيد العمل المطور بأسلوب عصري ومتجاوب بالكامل -->
    <div v-if="Object.values(workingHours).some(hours => hours !== null)"
      class="col-span-3 grid grid-cols-1 gap-fluid mt-fluid border-t border-primary/10 pt-fluid">
      <h3 class="text-fluid-h3 text-primary my-fluid font-bold">مواعيد العمل اليومية</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid">
        <div v-for="(hours, day) in workingHours" :key="day"
          :class="hours ? 'border-primary/20 bg-card' : 'border-denger/10 bg-denger/5 opacity-70'"
          class="flex flex-col gap-3 p-fluid border rounded-2xl shadow-soft transition-all duration-300 items-stretch">
          <!-- السطر العلوي: اسم اليوم والتحكم في حالته -->
          <div class="flex items-center justify-between border-b border-primary/5 pb-2">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`chk-${day}`" :checked="hours !== null"
                @change="(e) => toggleDay(day as string, (e.target as HTMLInputElement).checked)"
                class="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary accent-primary cursor-pointer transition-transform duration-200 active:scale-95" />
              <label :for="`chk-${day}`" class="text-fluid-p font-bold text-text cursor-pointer select-none">
                {{ daysTranslation[day] }}
              </label>
            </div>

            <!-- شارة حالة اليوم الصغيرة -->
            <span
              :class="hours ? 'bg-primary/10 text-primary border-primary/25' : 'bg-denger/10 text-denger border-denger/25'"
              class="px-2 py-0.5 text-fluid-xs font-semibold rounded-md border">
              {{ hours ? 'مفتوح' : 'مغلق' }}
            </span>
          </div>

          <!-- السطر السفلي: حقول الوقت الذكية المنسقة كـ Input Group احترافي -->
          <div class="h-11 flex items-center justify-center">
            <div v-if="hours"
              class="w-full grid grid-cols-7 items-center bg-bg border border-primary/10 rounded-xl px-2 py-1 animate-fade-in">
              <!-- وقت الفتح -->
              <input type="time" v-model="hours.open"
                class="col-span-3 w-full text-center bg-transparent text-text text-fluid-sm focus:outline-none cursor-pointer" />
              <!-- فاصل بياني -->
              <span class="col-span-1 text-center text-text/40 text-fluid-xs font-medium">إلى</span>
              <!-- وقت الغلق -->
              <input type="time" v-model="hours.close"
                class="col-span-3 w-full text-center bg-transparent text-text text-fluid-sm focus:outline-none cursor-pointer" />
            </div>

            <!-- رسالة غلق اليوم الجمالية عند الغلق لتجنب الفراغ -->
            <div v-else
              class="w-full text-center text-text/40 text-fluid-sm font-medium tracking-wide flex items-center justify-center gap-1">
              <Icon name="lucide:circle-slash" class="w-4 h-4 text-denger/40" />
              <span>المطعم مغلق طوال هذا اليوم</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- مكان مخصص لحقن أي حقول إضافية خارج المعمارية القياسية (مثل الصورة والـ Checkbox) -->
    <div class="col-span-3">
      <slot name="extra-fields" />
    </div>

    <!-- 3. زر الإرسال الموحد المعتمد على حالة الـ Submitting لمنع التكرار عشوائياً -->
    <div class="col-span-3 flex justify-end items-center gap-3 mt-fluid">

      <!-- الـ Slot المخصص للسماح بإضافة أزرار مثل إلغاء بجانب الحفظ -->
      <slot name="actions" />
      
      <button type="submit" :disabled="isSubmitting"
        class="btn-primary font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
        <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
        <span>{{ isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات' }}</span>
      </button>
    </div>

  </form>
</template>
