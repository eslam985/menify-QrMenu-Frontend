import type {
  CreateCategoryType,
  UpdateCategoryType,
} from "@/schemas/categorySchema/categorySchema";
import type { CategoryWithCountResponse } from "@/types/dataType/categoryType";
import { defineStore } from "pinia";

import { useCategoryService } from "~/services/categoryService";
import { handleGlobalError } from "~/utils/apiError";

export const useCategoryStore = defineStore("category", () => {
  const categoryService = useCategoryService();
  const confirmStore = useConfirmStore();
  const authStore = useAuthStore();
  const notiStore = useNotificationStore();
  const categories = ref<CategoryWithCountResponse[]>([]);
  const isSaving = ref(false);
  const isLoaded = ref(false);

  const isLoading = ref(false);

  const categoriesCount = computed(() => categories.value?.length);
  const totalItemsCount = computed<number>(() =>
    categories.value.reduce((acc, cat) => acc + (cat.items_count || 0), 0),
  );

  const getCategoryName = computed(() => (categoryId: string) => {
    const cat = categories.value.find((c) => c.id === categoryId);
    return cat ? cat.name : "—";
  });

  const findCategoryById = computed(
    () => (id: string) => categories.value.find((c) => c.id === id),
  );

  
  async function fetchCategories(force = false) {
    if (isLoading.value) return false;
    if (!force && isLoaded.value) return true;

    isLoading.value = true;
    try {
      const res = await categoryService.getCategories();
      if (!res || !res.success) return false;

      categories.value = res.data || [];
      isLoaded.value = true;
      return true;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل جلب التصنيفات!");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addCategory(body: CreateCategoryType) {
    if (!authStore.checkRole(authStore.isEditorAndAbove, "editor"))
      return false;

    if (body.display_order && body.display_order < 0) {
      const msg = "ترتيب العرض لا يمكن أن يكون سالباً";
      notiStore.show(msg, "error");
      return false;
    }

    if (isSaving.value) return false;

    isSaving.value = true;
    try {
      const res = await categoryService.createCategory(body);

      const errMsg = "فشل اضافة التصنيف";
      const successMsg = body.name
        ? `تم تعديل التصنيف ${body.name} بنجاح!`
        : "تم تعديل التصنيف بنجاح!";

      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      categories.value.push({ ...res.data, items_count: 0 });
      return true;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل اضافة التصنيف ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateCategory(id: string, body: UpdateCategoryType) {
    if (!authStore.checkRole(authStore.isEditorAndAbove, "editor"))
      return false;

    if (!id || isSaving.value || !body) return false;

    if (body.display_order && body.display_order < 0) {
      const msg = "ترتيب العرض لا يمكن أن يكون سالباً";
      notiStore.show(msg, "error");
      return false;
    }

    isSaving.value = true;
    try {
      const res = await categoryService.updateCategory(id, body);

      const errMsg = "فشل تعديل التصنيف";
      const successMsg = body.name
        ? `تم تعديل التصنيف ${body.name} بنجاح!`
        : "تم تعديل التصنيف بنجاح!";

      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      const index = categories.value.findIndex((c) => c.id === id);
      const existingCategory = categories.value[index];

      if (!existingCategory) return res.success;

      categories.value[index] = {
        ...existingCategory,
        ...res.data,
        items_count: existingCategory.items_count,
      };

      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل تعديل التصنيف ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function removeCategory(id: string) {
    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    if (!id || isSaving.value) return false;
    const count = categories.value.find((c) => c.id === id)?.items_count ?? 0;

    const isConfirmed = await confirmStore.ask(
      count > 0
        ? `سيتم حذف هذا التصنيف و${count} صنف تابع له نهائياً. هل أنت متأكد؟`
        : "هل أنت متأكد من حذف هذا التصنيف؟",
      "تأكيد الحذف",
    );

    if (!isConfirmed) return false;

    isSaving.value = true;

    try {
      const res = await categoryService.deleteCategory(id);
      const errMsg = "فشل حذف التصنيف";
      const successMsg = "تم حذف التصنيف بنجاح!";
      const isRes = handleApiResult(res, errMsg, successMsg, false);
      if (!isRes) return false;

      categories.value = categories.value.filter((c) => c.id !== id);
      return true;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل حذف التصنيف ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    categories,
    isLoading,
    isSaving,
    isLoaded,
    categoriesCount,
    totalItemsCount,
    fetchCategories,
    addCategory,
    removeCategory,
    updateCategory,
    getCategoryName,
    findCategoryById,
  };
});
