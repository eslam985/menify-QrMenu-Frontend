<!-- app/components/common/BaseSearchInput.vue -->
<script setup lang="ts">
const modelValue = defineModel<string>({ default: "" });

const props = defineProps<{
  placeholder?: string;
}>();

const route = useRoute();

const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;

  const cleanParts: string[] = route.path.split("/").filter(Boolean);
  const currentSection: string = cleanParts[cleanParts.length - 1] ?? "";
  const placeholder = `بحث سريع في الـ ${currentSection}`;

  return placeholder;
});
</script>

<template>
  <div class="relative w-full sm:w-72">
    <span
      class="text-primary text-fluid-sm pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
    >
      <Icon name="lucide:search" />
    </span>

    <input
      v-model="modelValue"
      type="text"
      :placeholder="computedPlaceholder"
      class="bg-card border-primary/10 text-text focus:border-primary text-fluid-sm p-section-fluid w-full rounded-xl border py-2.5 shadow-xs transition focus:outline-none"
    />

    <button
      v-if="modelValue"
      type="button"
      @click="modelValue = ''"
      class="text-text/40 hover:text-text text-fluid-xs absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
    >
      ✕
    </button>
  </div>
</template>
