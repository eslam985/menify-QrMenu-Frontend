<!-- app/components/dashboard/items/ItemReorderModal.vue -->
<script setup lang="ts">
import { useItemReorderModal } from "~/composables/useItemReorderModal";

const { isOpen, closeModal } = useItemReorderModal();
const itemStore = useItemStore();
const categoryStore = useCategoryStore();

const selectedCategoryId = ref("");
const localItems = ref<typeof itemStore.items>([]);
const isSaving = ref(false);
const draggedIndex = ref<number | null>(null);

watch(isOpen, (open) => {
  if (open) {
    const firstCategory = categoryStore.categories[0];

    if (firstCategory && !selectedCategoryId.value) {
      selectedCategoryId.value = firstCategory.id;
    }

    loadCategoryItems();
  }
});

const loadCategoryItems = () => {
  if (!selectedCategoryId.value) {
    localItems.value = [];
    return;
  }
  localItems.value = itemStore.items
    .filter((item) => item.category_id === selectedCategoryId.value)
    .sort((a, b) => a.display_order - b.display_order);
};

watch(selectedCategoryId, () => {
  loadCategoryItems();
});

const onDragStart = (index: number) => {
  draggedIndex.value = index;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (dropIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return;

  const itemToMove = localItems.value.splice(draggedIndex.value, 1)[0];

  if (!itemToMove) {
    draggedIndex.value = null;
    return;
  }

  localItems.value.splice(dropIndex, 0, itemToMove);
  draggedIndex.value = null;
};

const handleSaveReorder = async () => {
  if (localItems.value.length === 0 || !selectedCategoryId.value) return;

  isSaving.value = true;
  try {
    const payload = {
      category_id: selectedCategoryId.value,
      ids: localItems.value.map((item) => item.id),
    };

    const success = await itemStore.reorderItems(payload);
    if (success) {
      closeModal();
    }
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    @click.self="closeModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
  >
    <div
      class="bg-card border-primary/10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border p-6 text-right shadow-2xl"
    >
      <div
        class="border-primary/10 mb-4 flex items-center justify-between border-b pb-4"
      >
        <h3 class="text-primary flex items-center gap-2 text-lg font-bold">
          <Icon name="lucide:arrow-up-down" class="h-5 w-5" />
          إعادة ترتيب الأصناف بالسحب والإفلات
        </h3>
        <button
          type="button"
          @click="closeModal"
          class="text-text/50 hover:text-text cursor-pointer"
        >
          <Icon name="lucide:x" class="h-5 w-5" />
        </button>
      </div>

      <div class="mb-4">
        <label class="text-text/80 mb-1 block text-xs font-bold"
          >اختر القسم لإعادة ترتيب أصنافه:</label
        >
        <select
          v-model="selectedCategoryId"
          class="bg-bg border-primary/10 text-text focus:border-primary w-full rounded-xl border p-3 text-sm focus:outline-none"
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
          class="text-text/40 py-10 text-center text-sm"
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
            'bg-bg flex cursor-grab items-center justify-between rounded-xl border p-3 transition-all select-none active:cursor-grabbing',
            draggedIndex === index
              ? 'border-primary border-dashed opacity-40'
              : 'border-primary/10 hover:border-primary/40',
          ]"
        >
          <div class="flex items-center gap-3">
            <Icon name="lucide:grip-vertical" class="text-text/40 h-5 w-5" />
            <img
              v-if="item.image_url"
              :src="item.image_url"
              class="h-8 w-8 rounded-lg object-cover"
            />
            <div>
              <p class="text-text text-sm font-bold">{{ item.title }}</p>
              <p class="text-primary text-xs font-semibold">
                {{ item.price }} ج.م
              </p>
            </div>
          </div>
          <span
            class="bg-primary/10 text-primary rounded-lg px-2.5 py-1 font-mono text-xs font-bold"
          >
            #{{ index + 1 }}
          </span>
        </div>
      </div>

      <div class="border-primary/10 mt-4 flex gap-2 border-t pt-4">
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
        <button type="button" @click="closeModal" class="btn-danger">
          إلغاء
        </button>
      </div>
    </div>
  </div>
</template>
