import { defineStore } from "pinia";
import { useItemService } from "~/services/itemService";

import type {
  CreateMenuItemType,
  ListMenuItemsType,
  ReorderMenuItemsType,
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
  const isSaving = ref(false);
  const isLoaded = ref(false);

  function isValidPrice(price?: number, title?: string): boolean {
    if (price === undefined || price === null || price < 1) {
      const msg = `سعر '${title ?? "الصنف"}' لا يجب أن يكون أصغر من 1`;
      notiStore.show(msg, "error");
      return false;
    }
    return true;
  }
  function replaceItemInState(id: string, updatedItem: MenuItemResponse) {
    const index = items.value.findIndex((i) => i.id === id);
    if (index !== -1) {
      items.value[index] = updatedItem;
    }
  }

async function fetchItems(params?: ListMenuItemsType["query"], force = false) {
  if (isLoading.value) return false;
  if (!force && !params && isLoaded.value) return true;

    try {
      const res = await itemService.getItems(params);
      if (!res) return false;

      items.value = res.data || [];

      if (!params) isLoaded.value = true;
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل جلب الاصناف ! ");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addItem(body: CreateMenuItemType["body"]) {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor"))
      return false;
    if (!body || typeof body !== "object" || Object.keys(body).length < 1)
      return false;
    if (!isValidPrice(body.price, body.title)) return false;

    isSaving.value = true;
    try {
      const res = await itemService.createItem(body);

      const errMsg = "فشل اضافة الصنف";
      const successMsg = body.title
        ? `تم اضافة الصنف ${body.title} بنجاح!`
        : "تم اضافة الصنف بنجاح!";

      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      items.value.push(res.data);

      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل اضافة الصنف ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateItem(id: string, body: UpdateMenuItemType["body"]) {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor"))
      return false;
    if (
      !id ||
      !body ||
      typeof body !== "object" ||
      Object.keys(body).length < 1
    )
      return false;
    if (!isValidPrice(body.price, body.title)) return false;

    isSaving.value = true;
    try {
      const res = await itemService.updateItem(id, body);

      const errMsg = "فشل تعديل الصنف";
      const successMsg = body.title
        ? `تم تعديل الصنف ${body.title} بنجاح!`
        : "تم تعديل الصنف بنجاح!";

      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      replaceItemInState(id, res.data);

      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل تحديث الصنف!");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function uploadImage(id: string, formData: FormData) {
    const isNotUser = authStore.isEditorAndAbove;
    const isLowRole = !authStore.checkRole(isNotUser, "Editor");

    if (isSaving.value || !id || !formData) return false;
    if (isLowRole) return false;

    isSaving.value = true;
    try {
      const res = await itemService.uploadImage(id, formData);

      const errMsg = "فشل رفع صورة الصنف";
      const successMsg = "تم رفع صورة الصنف بنجاح!";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      replaceItemInState(id, res.data);
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل رفع صورة الصنف!");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function removeItem(id: string) {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor")) return false;

    const confimMsg = "هل أنت متأكد من حذف هذا الصنف نهائياً؟";
    const isConfirmed = await confirmStore.ask(confimMsg, "تأكيد الحذف");
    if (!isConfirmed) return false;

    isSaving.value = true;
    try {
      const res = await itemService.deleteItem(id);

      const errMsg = "فشل حذف الصنف";
      const successMsg = "تم حذف الصنف بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg, false);

      if (!isRes) return false;

      items.value = items.value.filter((i) => i.id !== id);
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل حذف الصنف!");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function toggleAvailability(id: string, currentStatus: boolean) {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor")) return false;
    if (!id || typeof currentStatus !== "boolean") return false;

    isSaving.value = true;
    try {
      const newStatus = !currentStatus;
      const res = await itemService.setAvailability(id, newStatus);

      const errMsg = "فشل تحديث حالة التوفر";
      const successMsg = "تم تحديث حالة التوفر بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      const index = items.value.findIndex((i) => i.id === id);

      const item = items.value[index];

      if (item) item.is_available = newStatus;

      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل تحديث حالة التوفر");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteImage(id: string) {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor")) return false;
    if (!id) return false;

    isSaving.value = true;
    try {
      const res = await itemService.deleteImage(id);

      const errMsg = "فشل حذف الصورة!";
      const successMsg = "تم حذف الصوره بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      replaceItemInState(id, res.data);
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل حذف الصوره !");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function reorderItems(payload: ReorderMenuItemsType["body"]) {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor")) return false;
    if (typeof payload !== "object" || Object.keys(payload).length < 1) return false;

    isSaving.value = true;

    try {
      const res = await itemService.reorderItems(payload);

      const errMsg = "فشل إعادة ترتيب الأصناف!";
      const successMsg = "تم إعادة ترتيب الأصناف بنجاح!";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      payload.ids.forEach((id, index) => {
        const item = items.value.find((i) => i.id === id);
        if (item) item.display_order = index;
      });

      items.value.sort((a, b) => a.display_order - b.display_order);

      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل ترتيب الاصناف !");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    items,
    isLoading,
    isSaving,
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