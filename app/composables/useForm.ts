import { ref, computed, type Ref } from "vue";

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
  options?: { label: string; value: string | number }[];
}

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

  const setFormConfig = (
    configFields: FormField[],
    submitAction: () => Promise<void> | void,
    initialData?: Record<string, unknown>,
  ) => {
    fields.value = configFields.map((field) => {
      const initialValue = initialData ? initialData[field.column] : undefined;
      onSubmitHandler.value = submitAction;
      return {
        ...field,
        value: initialValue !== undefined ? initialValue : (field.value ?? ""),
      };
    });
  };

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

  const toggleDay = (day: string, checked: boolean) => {
    workingHours.value[day] = checked
      ? { open: "09:00", close: "23:00" }
      : null;
  };

  const formDataPayload = computed(() => {
    const payload = fields.value.reduce(
      (acc, field) => {
        acc[field.column] = field.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const hasHours = Object.values(workingHours.value).some((h) => h !== null);
    if (hasHours) {
      payload["working_hours"] = workingHours.value;
    }

    return payload;
  });

  const resetForm = () => {
    fields.value = fields.value.map((field) => ({
      ...field,
      value: field.type === "select" ? (field.options?.[0]?.value ?? "") : "",
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
