<!-- app/pages/auth/register.vue -->
<script setup lang="ts">
import type { RegisterRestaurantType } from "@/schemas/userSchema/userSchema";
import { useForm, type FormField } from "~/composables/useForm";

definePageMeta({ middleware: "guest" });

const authStore = useAuthStore();
const formInstance = useForm();
const { setFormConfig, formDataPayload, resetForm } = formInstance;

provide("current_form_instance", formInstance);

// 1. هيكل الحقول الموحد القياسي المتوافق مع سكيما الباك إند
const registerFieldsConfig: FormField[] = [
  {
    column: "inviteCode",
    value: "",
    label: "كود الدعوة",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "restaurantName",
    value: "",
    label: "اسم المطعم",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "slug",
    value: "",
    label: "رابط المطعم (Slug) — أحرف وأرقام وشرطات فقط",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "username",
    value: "",
    label: "اسم المسؤول (المشرف)",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "email",
    value: "",
    label: "البريد الإلكتروني للوجن",
    required: true,
    type: "email",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "password",
    value: "",
    label: "كلمة المرور (8 أحرف على الأقل)",
    required: true,
    type: "password",
    colspan: "col-span-3 md:col-span-1",
  },
];

// دالة الحفظ المركزية المربوطة بالـ Submit
const handleRegisterSubmit = async () => {
  if (authStore.isLoading) return;

  const payload = formDataPayload.value;

  // تنسيق الحقول لتطابق تماماً بنية الـ payloadRegister النظيف
  const payloadRegister = {
    inviteCode: String(payload.inviteCode).trim(),
    restaurantName: String(payload.restaurantName).trim(),
    slug: String(payload.slug),
    username: String(payload.username).trim(),
    email: String(payload.email).trim(),
    password: String(payload.password),
  };

  const isSuccess = await authStore.register(
    payloadRegister as RegisterRestaurantType["body"],
  );

  if (isSuccess) {
    resetForm();
    try {
      await authStore.login({
        email: payloadRegister.email,
        password: payloadRegister.password,
      });
      await navigateTo("/dashboard");
    } catch {
      await navigateTo("/auth/login");
    }
  }
};

// 2. مراقبة حية لإنشاء الـ Slug تلقائياً من اسم المطعم داخل المصفوفة
const slugTouched = ref(false);

onMounted(() => {
  authStore.resetState();
  resetForm();
  setFormConfig(registerFieldsConfig, handleRegisterSubmit);

  // العثور على الحقول داخل الـ Ref للتحكم في قيمها حياً
  const nameField = formInstance.fields.value.find(
    (f) => f.column === "restaurantName",
  );
  const slugField = formInstance.fields.value.find((f) => f.column === "slug");

  if (nameField && slugField) {
    // مراقبة اسم المطعم وتوليد الـ Slug تلقائياً طالما لم يكتبه المستخدم بيده
    watch(
      () => nameField.value,
      (newName) => {
        if (!slugTouched.value) {
          slugField.value = slugify(String(newName));
        }
      },
    );
  }
});
</script>

<template>
  <div
    dir="rtl"
    class="my-section-fluid mx-auto flex min-h-[85vh] w-full items-center justify-center 2xl:max-w-[90%]"
  >
    <div
      class="bg-card border-primary/10 shadow-soft p-section-fluid rounded-2xl border text-right"
    >
      <div class="mb-6">
        <h1 class="text-primary text-2xl font-bold">تسجيل مطعم جديد</h1>
        <p class="text-text/60 mt-1 text-xs">
          أدخل كود الدعوة الذي حصلت عليه وبيانات المطعم الأساسية لإطلاق لوحة
          التحكم
        </p>
      </div>

      <!-- 🌟 رسم وحقن الفورم بالكامل عبر المكون الموحد لـ Menify -->
      <UiBaseForm>
        <template #extra-fields>
          <!-- عرض الرابط المباشر لايف ليفهمه العميل بوضوح قبل الحفظ -->
          <div class="mt-1 text-right" dir="rtl">
            <p class="text-text/60 text-xs">
              رابط المنيو الخاص بك سيكون:
              <span class="text-primary mt-1 block font-bold" dir="ltr">
                /menu/{{
                  formInstance.fields.value.find((f) => f.column === "slug")
                    ?.value || "your-restaurant"
                }}
              </span>
            </p>
            <p
              v-if="authStore.errorMessage"
              class="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-500"
            >
              {{ authStore.errorMessage }}
            </p>
          </div>
          <!-- حقن رسالة الخطأ والروابط الإرشادية قبل أزرار الحفظ -->
          <div class="gap-fluid mt-2 flex flex-col">
            <p
              v-if="authStore.errorMessage"
              class="rounded-xl bg-red-500/10 p-3 text-sm text-red-500"
            >
              {{ authStore.errorMessage }}
            </p>

            <div class="text-text/60 mt-2 text-center text-xs">
              لديك مطعم مسجل؟
              <NuxtLink
                to="/auth/login"
                class="text-primary font-bold hover:underline"
              >
                سجل دخولك من هنا
              </NuxtLink>
            </div>
          </div>
        </template>
      </UiBaseForm>
    </div>
  </div>
</template>
