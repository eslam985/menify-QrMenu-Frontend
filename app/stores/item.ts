import { defineStore } from "pinia";
import { useItemService } from "~/services/itemService";

import type {
  CreateMenuItemType,
  ListMenuItemsType,
  UpdateMenuItemType,
} from "@/schemas/menuItemSchema/menuItemSchema.js";
import type { MenuItemResponse } from "@/types/dataType/menuItemType";
export const useItemStore = defineStore("item", () => {
  const notiStore = useNotificationStore();
  const itemService = useItemService();
  const confirmStore = useConfirmStore();
  const authStore = useAuthStore();

  const items = ref<MenuItemResponse[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchItems(params?: ListMenuItemsType["query"]) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await itemService.getItems(params);
      if (!res) return false;

      items.value = res.data || [];
      return res.data;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addItem(body: CreateMenuItemType["body"]) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (body.price < 1) {
      notiStore.show(
        `سعر  '  ${body.title ?? "الصنف"}  '  لا يجب ان يكون 0`,
        "error",
      );
      return false;
    }

    if (isLoading.value) return false;

    isLoading.value = true;
    try {
      const res = await itemService.createItem(body);

      if (!res.success || !res.data) {
        notiStore.show(res.message || "فشل إضافة الصنف", "error");
        return false;
      }

      items.value.unshift(res.data);
      notiStore.show(
        res.message || `تم إضافة الصنف "${body.title}" بنجاح!`,
        "success",
      );
      return res.data;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateItem(id: string, body: UpdateMenuItemType["body"]) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (isLoading.value || !id) return false;

    isLoading.value = true;
    try {
      const res = await itemService.updateItem(id, body);

      const index = items.value.findIndex((i) => i.id === id);

      if (index !== -1 && res.data) items.value[index] = res.data;

      notiStore.show(res.message || "تم تحديث الصنف بنجاح!", "success");
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeItem(id: string) {
    if (isLoading.value || !id) return false;
    if (!authStore.isAdmin) {
      notiStore.show("عذراً، حذف الأصناف متاح للآدمن (Admin) فقط.", "error");
      return false;
    }

    const isConfirmed = await confirmStore.ask(
      "هل أنت متأكد من حذف هذا الصنف نهائياً؟",
      "تأكيد الحذف",
    );
    if (!isConfirmed) return false;

    isLoading.value = true;
    try {
      await itemService.deleteItem(id);
      items.value = items.value.filter((i) => i.id !== id);
      notiStore.show("تم حذف الصنف بنجاح!", "success");
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleAvailability(id: string, currentStatus: boolean) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    try {
      const newStatus = !currentStatus;
      const res = await itemService.setAvailability(id, newStatus);

      if (!res || !res.success || !res.data) return false;

      const index = items.value.findIndex((i) => i.id === id);

      const item = items.value[index];

      if (item) item.is_available = newStatus;

      notiStore.show("تم تحديث حالة التوفر بنجاح", "success");

      return res.data;
    } catch (err: unknown) {
      return false;
    }
  }

  async function uploadImage(id: string, formData: FormData) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (isLoading.value || !id) return false;

    isLoading.value = true;
    try {
      const res = await itemService.uploadImage(id, formData);
      const index = items.value.findIndex((i) => i.id === id);
      if (index !== -1 && res.data) {
        items.value[index] = res.data;
      }
      notiStore.show(res.message || "تم رفع صورة الصنف بنجاح!", "success");
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteImage(id: string) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (isLoading.value || !id) return false;

    isLoading.value = true;
    try {
      const res = await itemService.deleteImage(id);
      const index = items.value.findIndex((i) => i.id === id);
      if (index !== -1 && res.data) {
        items.value[index] = res.data;
      }
      notiStore.show(res.message || "تم حذف صورة الصنف بنجاح!", "success");
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function reorderItems(payload: { category_id: string; ids: string[] }) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (isLoading.value) return false;

    isLoading.value = true;
    try {
      const res = await itemService.reorderItems(payload);

      payload.ids.forEach((id, index) => {
        const item = items.value.find((i) => i.id === id);
        if (item) item.display_order = index;
      });

      items.value.sort((a, b) => a.display_order - b.display_order);

      notiStore.show(res.message || "تم إعادة ترتيب الأصناف بنجاح!", "success");
      return true;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    updateItem,
    removeItem,
    toggleAvailability,
    uploadImage,
    deleteImage,
    reorderItems,
  };
});
