// app/composables/useForm.ts

import { ref, computed, type Ref } from "vue";

// 1. واجهة الحقل الموحدة القياسية الصارمة
export interface FormField<T = unknown> {
  column: string;
  value: T;
  label: string;
  required: boolean;
  type:
    | "text"
    | "tel"
    | "password"
    | "file"
    | "textarea"
    | "select"
    | "number"
    | "email";
  colspan: string;
  options?: { label: string; value: string | number }[]; // دعم String و number للـ select
}

// 2. واجهة الـ Instance الكاملة والجاهزة للـ Inject
export interface FormInstance {
  fields: Ref<FormField[]>;
  isLoading: Ref<boolean>;
  isSubmitting: Ref<boolean>;
  workingHours: Ref<Record<string, { open: string; close: string } | null>>;
  setFormConfig: (
    configFields: FormField[],
    submitAction: () => Promise<void> | void,
    initialData?: Record<string, unknown>,
  ) => void;
  setWorkingHoursConfig: (hoursData: Record<string, unknown>) => void;
  toggleDay: (day: string, checked: boolean) => void;
  formDataPayload: ComputedRef<Record<string, unknown>>;
  resetForm: () => void;
  onSubmitHandler: Ref<() => Promise<void> | void>;
}

export const useForm = () => {
  // استخدام ref العادية يضمن أن كل فورم يستدعي useForm يحصل على نسخة (Instance) مستقلة تماماً في الذاكرة
  const fields = ref<FormField[]>([]);
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const onSubmitHandler = ref<() => Promise<void> | void>(() => {});

  const workingHours = ref<
    Record<string, { open: string; close: string } | null>
  >({
    sat: null,
    sun: null,
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
  });

  // دالة تهيئة وتعبئة الفورم بالهيكل والبيانات القادمة من الـ Store
  const setFormConfig = (
    configFields: FormField[],
    submitAction: () => Promise<void> | void,
    initialData?: Record<string, unknown>,
  ) => {
    fields.value = configFields.map((field) => {
      // إذا كانت هناك بيانات ابتدائية، نغذي قيمة الحقل بها، وإلا نتركها كما هي أو فارغة
      const initialValue = initialData ? initialData[field.column] : undefined;
      onSubmitHandler.value = submitAction;
      return {
        ...field,
        value: initialValue !== undefined ? initialValue : (field.value ?? ""),
      };
    });
  };

  // دالة خاصة بتعبئة مواعيد العمل للفورمات التي تستخدمها
  const setWorkingHoursConfig = (hoursData: Record<string, unknown>) => {
    Object.keys(workingHours.value).forEach((day) => {
      const dayData = hoursData[day] as
        { open?: string; close?: string } | undefined;

      if (dayData) {
        workingHours.value[day] = {
          open: dayData.open || "09:00",
          close: dayData.close || "23:00",
        };
      } else {
        workingHours.value[day] = null;
      }
    });
  };

  // دالة سريعة للتحويل بين حالة فتح وغلق اليوم في مواعيد العمل
  const toggleDay = (day: string, checked: boolean) => {
    workingHours.value[day] = checked
      ? { open: "09:00", close: "23:00" }
      : null;
  };

  // خاصية محسوبة لتجميع الحقول ديناميكياً وتحويلها لكائن Payload نظيف للباك إند
  const formDataPayload = computed(() => {
    const payload = fields.value.reduce(
      (acc, field) => {
        // نأخذ قيمة الحقل الصافية ونربطها بـ مفتاح العمود الخاص بها
        acc[field.column] = field.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    // إذا كانت هناك مواعيد عمل مفعّلة ومملوءة، ندمجها في الـ Payload
    const hasHours = Object.values(workingHours.value).some((h) => h !== null);
    if (hasHours) {
      payload["working_hours"] = workingHours.value;
    }

    return payload;
  });

  // دالة لتفريغ بيانات وفورمات الـ Composable تماماً عند الخروج من الصفحة (Cleanup)
  // دالة لتفريغ بيانات وفورمات الـ Composable تماماً عند الخروج من الصفحة (Cleanup)
  const resetForm = () => {
    // بدلاً من حذف المصفوفة، نمر على الحقول ونفرغ قيمها فقط مع الحفاظ على الهيكل
    fields.value = fields.value.map((field) => ({
      ...field,
      value: field.type === "select" ? (field.options?.[0]?.value ?? "") : "", // تصفير القيمة بناءً على نوع الحقل
    }));

    isLoading.value = false;
    isSubmitting.value = false;
    workingHours.value = {
      sat: null,
      sun: null,
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
    };
  };

  return {
    fields,
    isLoading,
    isSubmitting,
    workingHours,
    setFormConfig,
    setWorkingHoursConfig,
    toggleDay,
    formDataPayload,
    resetForm,
    onSubmitHandler,
  };
};
