<!-- app/components/dashboard/items/ItemReorderModal.vue -->
<script setup lang="ts">
import { useItemState } from "@/composables/item/useItemState";

const {
  categoryStore,
  selectedCategoryId,
  localItems,
  isSaving,
  draggedIndex,
  isOpenItemReorderModal,
  closeModalItemReorderModal,
  loadCategoryItems,
  onDragStart,
  onDragOver,
  onDrop,
  handleSaveReorder,
  initializeModal,
} = useItemState();

watch(selectedCategoryId, () => {
  loadCategoryItems();
});

watch(isOpenItemReorderModal, (open) => {
  if (open) {
    initializeModal();
  }
});
</script>

<template>
  <div
    v-if="isOpenItemReorderModal"
    @click.self="closeModalItemReorderModal"
    class="p-fluid fixed inset-0 z-50 flex items-center justify-center bg-black/60"
  >
    <div
      class="bg-card border-primary/10 p-section-fluid flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border text-right shadow-2xl"
    >
      <div
        class="border-primary/10 mb-fluid flex items-center justify-between border-b pb-4"
      >
        <h3 class="text-primary text-fluid-p flex items-center gap-2 font-bold">
          <Icon name="lucide:arrow-up-down" class="h-5 w-5" />
          إعادة ترتيب الأصناف بالسحب والإفلات
        </h3>
        <button
          type="button"
          @click="closeModalItemReorderModal"
          class="text-text/50 hover:text-text cursor-pointer"
        >
          <Icon name="lucide:x" class="h-5 w-5" />
        </button>
      </div>

      <div class="mb-fluid">
        <label class="text-text/80 text-fluid-xs mb-1 block font-bold"
          >اختر القسم لإعادة ترتيب أصنافه:</label
        >
        <select
          v-model="selectedCategoryId"
          class="bg-bg border-primary/10 text-text focus:border-primary text-fluid-sm p-fluid w-full rounded-xl border focus:outline-none"
        >
          <option
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="min-h-[250px] flex-1 space-y-2 overflow-y-auto pr-1">
        <div
          v-if="localItems.length === 0"
          class="text-text/40 text-fluid-sm py-section-fluid text-center"
        >
          لا توجد أصناف في هذا القسم.
        </div>

        <div
          v-else
          v-for="(item, index) in localItems"
          :key="item.id"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover="onDragOver"
          @drop="onDrop(index)"
          :class="[
            'bg-bg p-fluid flex cursor-grab items-center justify-between rounded-xl border select-none active:cursor-grabbing',
            draggedIndex === index
              ? 'border-primary border-dashed opacity-40'
              : 'border-primary/10 hover:border-primary/40',
          ]"
        >
          <div class="gap-fluid flex items-center">
            <Icon name="lucide:grip-vertical" class="text-text/40 h-5 w-5" />
            <img
              v-if="item.image_url"
              :src="item.image_url"
              class="h-8 w-8 rounded-lg object-cover"
            />
            <div>
              <p class="text-text text-fluid-sm font-bold">{{ item.title }}</p>
              <p class="text-primary text-fluid-xs font-semibold">
                {{ item.price }} ج.م
              </p>
            </div>
          </div>
          <span
            class="bg-primary/10 text-primary text-fluid-xs rounded-lg px-2.5 py-1 font-mono font-bold"
          >
            #{{ index + 1 }}
          </span>
        </div>
      </div>

      <div class="border-primary/10 mt-fluid flex gap-2 border-t pt-4">
        <button
          type="button"
          @click="handleSaveReorder"
          :disabled="isSaving || localItems.length === 0"
          class="btn-primary"
        >
          <Icon
            v-if="isSaving"
            name="lucide:loader-2"
            class="h-4 w-4 animate-spin"
          />
          {{ isSaving ? "جاري الحفظ..." : "حفظ الترتيب الجديد" }}
        </button>
        <button
          type="button"
          @click="closeModalItemReorderModal"
          class="btn-danger"
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
</template>
