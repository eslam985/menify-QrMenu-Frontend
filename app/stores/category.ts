import { defineStore } from "pinia";
import type { CategoryWithCountResponse } from "@/types/dataType/categoryType";
import type {
  CreateCategoryType,
  UpdateCategoryType,
} from "@/schemas/categorySchema/categorySchema";

import { useCategoryService } from "~/services/categoryService";

export const useCategoryStore = defineStore("category", () => {
  const notiStore = useNotificationStore();
  const categoryService = useCategoryService();
  const confirmStore = useConfirmStore();
  const authStore = useAuthStore();

  const categories = ref<CategoryWithCountResponse[]>([]);
  const isSaving = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const categoriesCount = computed(() => categories.value?.length);
  const itemsArray = computed(() =>
    categories.value.map((categorie) => categorie.items_count),
  );
  const items_count = computed<number>(() =>
    itemsArray.value.reduce((acc: number, curr: number) => acc + curr, 0),
  );

  async function fetchCategories() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await categoryService.getCategories();

      if (!res || !res.success) return false;

      categories.value = res.data || [];
      return res.success;
    } catch {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addCategory(body: CreateCategoryType) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }
    if (isSaving.value) return false;
    error.value = "";
    isSaving.value = true;
    try {
      const res = await categoryService.createCategory(body);
      if (!res.success) {
        notiStore.show(res.message || "فشل اضافة التصنيف", "error");
        return false;
      }

      categories.value.push({ ...res.data, items_count: 0 });
      notiStore.show(
        res.message || `تم اضافة التصنيف ${body.name} بنجاح!`,
        "success",
      );
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateCategory(id: string, body: UpdateCategoryType) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }
    if (!id || isSaving.value || !body) return false;
    error.value = "";
    isSaving.value = true;
    try {
      const res = await categoryService.updateCategory(id, body);

      const index = categories.value.findIndex((c) => c.id === id);
      const existingCategory = categories.value[index];

      if (existingCategory && res.data) {
        categories.value[index] = {
          ...existingCategory,
          ...res.data,
          items_count: existingCategory.items_count,
        };
      }

      notiStore.show(res.message || "تم تحديث التصنيف بنجاح!", "success");
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function removeCategory(id: string) {
    if (!id || isSaving.value) return false;

    if (!authStore.isAdmin) {
      notiStore.show("عذراً، حذف التصنيفات متاح للآدمن (Admin) فقط.", "error");
      return false;
    }

    const count = categories.value.find((c) => c.id === id)?.items_count ?? 0;

    const isConfirmed = await confirmStore.ask(
      count > 0
        ? `سيتم حذف هذا التصنيف و${count} صنف تابع له نهائياً. هل أنت متأكد؟`
        : "هل أنت متأكد من حذف هذا التصنيف؟",
      "تأكيد الحذف",
    );

    if (!isConfirmed) return false;

    isSaving.value = true;
    error.value = "";

    try {
      await categoryService.deleteCategory(id);

      categories.value = categories.value.filter((c) => c.id !== id);
      notiStore.show("تم حذف التصنيف بنجاح!", "success");

      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    categories,
    isLoading,
    error,
    isSaving,
    categoriesCount,
    items_count,
    fetchCategories,
    addCategory,
    removeCategory,
    updateCategory,
  };
});
