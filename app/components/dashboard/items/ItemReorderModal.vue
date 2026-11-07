<!-- app/components/dashboard/items/ItemReorderModal.vue -->
<script setup lang="ts">
import { useItemStore } from '~/stores/item'
import { useCategoryStore } from '~/stores/category'
import { useItemReorderModal } from '~/composables/useItemReorderModal'

const { isOpen, closeModal } = useItemReorderModal()
const itemStore = useItemStore()
const categoryStore = useCategoryStore()

const selectedCategoryId = ref('')
const localItems = ref<any[]>([])
const isSaving = ref(false)
const draggedIndex = ref<number | null>(null)

// مراقبة حالة فتح المودال لتهيئة البيانات وتحديثها
watch(isOpen, (open) => {
  if (open) {
    if (categoryStore.categories.length > 0 && !selectedCategoryId.value) {
      selectedCategoryId.value = categoryStore.categories[0].id
    }
    loadCategoryItems()
  }
})

const loadCategoryItems = () => {
  if (!selectedCategoryId.value) {
    localItems.value = []
    return
  }
  localItems.value = itemStore.items
    .filter((item) => item.category_id === selectedCategoryId.value)
    .sort((a, b) => a.display_order - b.display_order)
}

watch(selectedCategoryId, () => {
  loadCategoryItems()
})

// أحداث السحب والإفلات (Native HTML5 Drag & Drop)
const onDragStart = (index: number) => {
  draggedIndex.value = index
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const onDrop = (dropIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return

  // إعادة ترتيب المصفوفة محلياً بالسحب والإفلات
  const itemToMove = localItems.value.splice(draggedIndex.value, 1)[0]
  localItems.value.splice(dropIndex, 0, itemToMove)
  draggedIndex.value = null
}

// حفظ الترتيب الجديد وإرساله للـ Backend
const handleSaveReorder = async () => {
  if (localItems.value.length === 0 || !selectedCategoryId.value) return

  isSaving.value = true
  try {
    // استخراج مصفوفة الـ ids فقط بالترتيب الحالي، مع إرسال category_id مطابقة للـ Backend Schema
    const payload = {
      category_id: selectedCategoryId.value,
      ids: localItems.value.map((item) => item.id),
    }

    const success = await itemStore.reorderItems(payload)
    if (success) {
      closeModal()
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" @click.self="closeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div class="bg-card max-w-lg w-full p-6 rounded-2xl border border-primary/10 shadow-2xl text-right flex flex-col max-h-[85vh]">
      
      <!-- الهيدر -->
      <div class="flex items-center justify-between pb-4 border-b border-primary/10 mb-4">
        <h3 class="text-lg font-bold text-primary flex items-center gap-2">
          <Icon name="lucide:arrow-up-down" class="w-5 h-5" />
          إعادة ترتيب الأصناف بالسحب والإفلات
        </h3>
        <button type="button" @click="closeModal" class="text-text/50 hover:text-text cursor-pointer">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- اختيار القسم -->
      <div class="mb-4">
        <label class="block text-xs font-bold text-text/80 mb-1">اختر القسم لإعادة ترتيب أصنافه:</label>
        <select v-model="selectedCategoryId" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary">
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- قائمة الأصناف القابلة للسحب والإفلات -->
      <div class="flex-1 overflow-y-auto min-h-[250px] space-y-2 pr-1">
        <div v-if="localItems.length === 0" class="text-center py-10 text-text/40 text-sm">
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
            'flex items-center justify-between p-3 rounded-xl border bg-bg transition-all cursor-grab active:cursor-grabbing select-none',
            draggedIndex === index ? 'opacity-40 border-dashed border-primary' : 'border-primary/10 hover:border-primary/40'
          ]"
        >
          <div class="flex items-center gap-3">
            <Icon name="lucide:grip-vertical" class="w-5 h-5 text-text/40" />
            <img v-if="item.image_url" :src="item.image_url" class="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p class="text-sm font-bold text-text">{{ item.title }}</p>
              <p class="text-xs text-primary font-semibold">{{ item.price }} ج.م</p>
            </div>
          </div>
          <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
            #{{ index + 1 }}
          </span>
        </div>
      </div>

      <!-- الأزرار -->
      <div class="flex gap-2 mt-4 pt-4 border-t border-primary/10">
        <button
          type="button"
          @click="handleSaveReorder"
          :disabled="isSaving || localItems.length === 0"
          class="btn-primary"
        >
          <Icon v-if="isSaving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          {{ isSaving ? 'جاري الحفظ...' : 'حفظ الترتيب الجديد' }}
        </button>
        <button type="button" @click="closeModal" class="btn-danger">
          إلغاء
        </button>
      </div>

    </div>
  </div>
</template>