<!-- app/components/dashboard/profile/EmployeeInviteForm.vue -->
<script setup lang="ts">
import type {
  CreateStaffType,
  UpdateStaffRoleType,
} from "@/schemas/staffSchema/staffSchema";
import { useForm, type FormField } from "~/composables/useForm";

import { useStaffState } from "@/composables/staff/useStaffState";
import { useSubmitstate } from "#imports";

const { handleSubmit } = useSubmitstate();
const { router, staffStore, authrStore, employeeId, isEditMode, isAdmin } =
  useStaffState();

const formInstance = useForm();

const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
  formInstance;
provide("current_form_instance", formInstance);

const employeeFieldsConfig = computed<FormField[]>(() => {
  const baseFields: FormField[] = [
    {
      column: "roles",
      value: "2001",
      label: "الصلاحية / الرتبة",
      required: true,
      type: "select",
      colspan: "col-span-3 sm:col-span-1 md:col-span-1",
      options: [
        { label: "مستخدم عادي (User)", value: "2001" },
        { label: "محرر (Editor)", value: "1984" },
      ],
    },
  ];

  if (!isEditMode.value) {
    baseFields.unshift(
      {
        column: "username",
        value: "",
        label: "اسم الموظف",
        required: !isEditMode.value,
        type: "text",
        colspan: "col-span-3 sm:col-span-1 md:col-span-1",
      },
      {
        column: "email",
        value: "",
        label: "البريد الإلكتروني للموظف",
        required: !isEditMode.value,
        type: "email",
        colspan: "col-span-3 sm:col-span-1 md:col-span-1",
      },
      {
        column: "password",
        value: "",
        label: "كلمة المرور",
        required: true,
        type: "password",
        colspan: "col-span-3 sm:col-span-1 md:col-span-1",
      },
      {
        column: "confirmPassword",
        value: "",
        label: "تأكيد كلمة المرور",
        required: true,
        type: "password",
        colspan: "col-span-3 sm:col-span-1 md:col-span-1",
      },
    );
  }

  return baseFields;
});

const handleEmployeeSubmit = async () => {
  const payload = { ...formDataPayload.value };
  if (Object.keys(payload)?.length < 1) return;

  if (!isEditMode.value) {
    if (payload.password !== payload.confirmPassword) {
      const notiStore = useNotificationStore();
      notiStore.show("كلمة المرور وتأكيدها غير متطابقين!", "error");
      return;
    }
    delete payload.confirmPassword;
  }

  handleSubmit({
    formDataPayload: payload,
    isSubmitting,
    apiCall: () =>
      isEditMode.value
        ? staffStore.updateStaffRole(
            employeeId.value!,
            payload.roles as UpdateStaffRoleType["body"],
          )
        : staffStore.createStaff(payload as CreateStaffType["body"]),
    onSuccess: (isSuccess) => {
      if (isSuccess) {
        resetForm();
        router.push("/dashboard/staff");
      }
    },
  });
};

const loadData = async () => {
  if (!isAdmin.value) return;

  if (isEditMode.value) {
    if (staffStore.staff.length === 0) await staffStore.getStaff();

    if (isEditMode.value && employeeId.value === authrStore.user?.id)
      return router.push("/dashboard/staff");

    const employeeData = staffStore.getEmployeeById(employeeId.value!);

    setFormConfig(
      employeeFieldsConfig.value,
      handleEmployeeSubmit,
      employeeData || {},
    );
  } else {
    resetForm();
    setFormConfig(employeeFieldsConfig.value, handleEmployeeSubmit);
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-if="isAdmin" class="mb-section-fluid mx-auto max-w-6xl">
    <h3
      class="text-fluid-h3 text-text mb-section-fluid border-primary/10 gap-fluid md:hover:text-primary flex items-center border-b pb-2 font-bold"
    >
      <Icon name="lucide:user-plus" class="text-primary h-5 w-5" />
      <span>{{
        isEditMode ? "تعديل صلاحية الموظف" : "إضافة موظف جديد للنظام"
      }}</span>
    </h3>

    <div
      class="p-section-fluid bg-card border-primary/20 rounded-card shadow-soft flex flex-col justify-between border"
    >
      <UiBaseForm>
        <template #actions>
          <NuxtLink to="/dashboard/staff" class="btn-danger"> إلغاء </NuxtLink>
        </template>
      </UiBaseForm>
    </div>
  </div>
</template>
