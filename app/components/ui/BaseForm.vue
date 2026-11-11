<!-- app/components/ui/BaseForm.vue -->
<script setup lang="ts">
import { inject } from "vue";

import type { FormInstance } from "~/composables/useForm";

const { fields, isSubmitting, workingHours, toggleDay, onSubmitHandler } =
  inject("current_form_instance") as FormInstance;

const daysTranslation: Record<string, string> = {
  sat: "السبت",
  sun: "الأحد",
  mon: "الإثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
};
</script>

<template>
  <form
    @submit.prevent="onSubmitHandler"
    class="gap-fluid grid w-full grid-cols-3"
  >
    <input
      type="text"
      name="email"
      style="display: none; width: 0; height: 0"
      autocomplete="username"
    />
    <input
      type="password"
      name="password"
      style="display: none; width: 0; height: 0"
      autocomplete="new-password"
    />

    <div
      v-for="form in fields"
      :key="form.column"
      :class="form.colspan || 'col-span-3'"
      class="flex flex-col"
    >
      <label
        class="text-fluid-xs text-primary mb-1.5 block font-medium select-none"
      >
        {{ form.label }} <span v-if="form.required" class="text-denger">*</span>
      </label>

      <textarea
        v-if="form.type === 'textarea'"
        :value="String(form.value ?? '')"
        @input="form.value = ($event.target as HTMLTextAreaElement).value"
        :placeholder="form.label"
        :required="form.required"
        rows="3"
        class="p-fluid bg-card border-primary/10 text-text/80 text-fluid-p focus:border-primary min-h-[120px] w-full resize-none rounded-xl border transition-colors focus:outline-none"
      ></textarea>

      <select
        v-else-if="form.type === 'select'"
        v-model="form.value"
        :required="form.required"
        class="p-fluid bg-card border-primary/10 text-text/80 text-fluid-p focus:border-primary w-full appearance-none rounded-xl border transition-colors focus:outline-none"
      >
        <option value="" disabled selected>اختر من القائمة...</option>
        <option
          v-for="option in form.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <input
        v-else-if="form.type !== 'file'"
        :type="form.type"
        v-model="form.value"
        :placeholder="form.label"
        :required="form.required"
        :autocomplete="form.type === 'password' ? 'new-password' : 'off'"
        class="p-fluid bg-card border-primary/10 text-text/80 text-fluid-p focus:border-primary w-full rounded-xl border transition-colors focus:outline-none"
      />
    </div>

    <div
      v-if="Object.values(workingHours).some((hours) => hours !== null)"
      class="gap-fluid mt-fluid border-primary/10 pt-fluid col-span-3 grid grid-cols-1 border-t"
    >
      <h3 class="text-fluid-h3 text-primary my-fluid font-bold">
        مواعيد العمل اليومية
      </h3>

      <div class="gap-fluid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(hours, day) in workingHours"
          :key="day"
          :class="
            hours
              ? 'border-primary/20 bg-card'
              : 'border-denger/10 bg-denger/5 opacity-70'
          "
          class="p-fluid shadow-soft gap-fluid flex flex-col items-stretch rounded-2xl border duration-300"
        >
          <div
            class="border-primary/5 flex items-center justify-between border-b pb-2"
          >
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                :id="`chk-${day}`"
                :checked="hours !== null"
                @change="
                  (e) =>
                    toggleDay(
                      day as string,
                      (e.target as HTMLInputElement).checked,
                    )
                "
                class="border-primary/20 text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform duration-200 active:scale-95"
              />
              <label
                :for="`chk-${day}`"
                class="text-fluid-p text-text cursor-pointer font-bold select-none"
              >
                {{ daysTranslation[day] }}
              </label>
            </div>

            <span
              :class="
                hours
                  ? 'bg-primary/10 text-primary border-primary/25'
                  : 'bg-denger/10 text-denger border-denger/25'
              "
              class="text-fluid-xs rounded-md border px-2 py-0.5 font-semibold"
            >
              {{ hours ? "مفتوح" : "مغلق" }}
            </span>
          </div>

          <div class="flex h-11 items-center justify-center">
            <div
              v-if="hours"
              class="bg-bg border-primary/10 animate-fade-in grid w-full grid-cols-7 items-center rounded-xl border px-2 py-1"
            >
              <input
                type="time"
                v-model="hours.open"
                class="text-text text-fluid-sm col-span-3 w-full cursor-pointer bg-transparent text-center focus:outline-none"
              />

              <span
                class="text-text/40 text-fluid-xs col-span-1 text-center font-medium"
                >إلى</span
              >

              <input
                type="time"
                v-model="hours.close"
                class="text-text text-fluid-sm col-span-3 w-full cursor-pointer bg-transparent text-center focus:outline-none"
              />
            </div>

            <div
              v-else
              class="text-text/40 text-fluid-sm flex w-full items-center justify-center gap-1 text-center font-medium tracking-wide"
            >
              <Icon name="lucide:circle-slash" class="text-denger/40 h-4 w-4" />
              <span>المطعم مغلق طوال هذا اليوم</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-3">
      <slot name="extra-fields" />
    </div>

    <div class="mt-fluid gap-fluid col-span-3 flex items-center justify-end">
      <slot name="actions" />

      <button
        type="submit"
        :disabled="isSubmitting"
        class="btn-primary flex items-center gap-2 font-bold disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon
          v-if="isSubmitting"
          name="lucide:loader-2"
          class="h-5 w-5 animate-spin"
        />
        <span>{{ isSubmitting ? "جاري الارسال..." : "ارسال" }}</span>
      </button>
    </div>
  </form>
</template>
