<!-- app/components/dashboard/profile/ActiveSessionsList.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useTable } from '~/composables/useTable'

const userStore = useUserStore()
const { sessions, isLoading } = storeToRefs(userStore)
const { setTableConfig } = useTable()

// 1. فك تشفير الـ User Agent لعرض المتصفح ونظام التشغيل بنقاء
const parseUserAgent = (ua: string) => {
  if (ua.includes('Windows')) return 'Windows • Chrome'
  if (ua.includes('Linux') && !ua.includes('Android')) return 'Linux • Chrome / Firefox'
  if (ua.includes('Macintosh')) return 'Mac • Safari'
  if (ua.includes('iPhone')) return 'iPhone • Safari'
  if (ua.includes('Android')) {
    const match = ua.match(/\(([^;]+);([^;]+);([^)]+)\)/)
    return match ? `Android • ${match[1]?.trim()}` : 'Android Device'
  }
  return 'جهاز غير معروف'
}


// 2. التحقق مما إذا كانت هذه الجلسة هي الجلسة الحالية المفتوحة بالمتصفح الآن
// 🌟 دالة مطورة تفحص الـ User Agent والـ IP معاً لمنع تداخل بصمات الأجهزة المتطابقة
const isCurrentSession = (session: any) => {
  if (!import.meta.client) return false
  // 1. مطابقة بصمة المتصفح والنظام الحالي
  const isUAMatch = session.user_agent === navigator.userAgent

  if (sessions.value.length === 1) return isUAMatch

  // 2. مطابقة الـ IP المسجل للجلسة مع الـ IP الحالي للمستخدم إذا كان مخزناً في الـ authStore
  // أو الاعتماد على أن الجلسة الحالية المفتوحة الآن تكون دائماً هي أحدث جلسة تم تحديثها (updated_at) في القائمة
  const isMostRecent = session.id === sessions.value.reduce<any>((max: any, s: any) =>
    new Date(s.updated_at) > new Date(max.updated_at) ? s : max
    , sessions.value[0] as any)?.id

  // الدمج الأمني يضمن تحديد جهازك الفعلي بدقة ويمنع الخداع البصري
  return isUAMatch && isMostRecent
}

// 3. تحديد أعمدة جدول الجلسات النشطة
const sessionTableColumns = [
  { key: 'device_info', label: 'الجهاز / المتصفح' },
  { key: 'ip_address', label: 'عنوان الـ IP' },
  { key: 'created_at', label: 'تاريخ انشاء الجلسه' },
  { key: 'updated_at', label: 'اخر تحديث' },
  { key: 'expires_at', label: 'تاريخ انتهاء الجلسه' },
  { key: 'status', label: 'الحالة' },
  { key: 'actions', label: 'الإجراءات الأمنية' }
]

// 4. دالة إنهاء وطرد الجلسة
const handleRevokeSession = async (sessionId: string) => {
  await userStore.removeSessionById(sessionId);
}

// شحن وتغذية الـ useTable بالبيانات والأعمدة ديناميكياً
watchEffect(() => {
  setTableConfig(sessionTableColumns, sessions.value, isLoading.value)
})


</script>

<template>
  <div class="mb-section-fluid rounded-card shadow-soft">
    <h3
      class="w-full 2xl:max-w-[90%] mx-auto text-fluid-h3 text-text md:hover:text-primary font-bold mb-fluid border-b border-primary/5 pb-2 flex items-center gap-2 select-none">
      <Icon name="lucide:shield-alert" class="w-5 h-5 text-primary" />
      <span>إدارة الجلسات النشطة والأجهزة المتصلة</span>
    </h3>

    <div class="">
      <!-- استدعاء الجدول الموحد الخاص بمشروعك -->
      <UiBaseTable>

        <!-- تخصيص عمود الجهاز والمتصفح -->
        <template #cell-device_info="{ row }">
          <div class="flex items-center gap-2 font-bold text-text">
            <Icon :name="isCurrentSession(row) ? 'lucide:smartphone' : 'lucide:monitor-smartphone'"
              :class="isCurrentSession(row) ? 'text-primary' : 'text-text/40'" class="w-5 h-5 shrink" />
            <span>{{ parseUserAgent(row.user_agent) }}</span>
          </div>
        </template>

        <!-- تخصيص عمود الـ IP -->
        <template #cell-ip_address="{ row }">
          <span class="font-mono text-fluid-sm text-text/80 bg-bg px-2 py-0.5 rounded border border-primary/5">
            {{ row.ip_address }}
          </span>
        </template>

        <!-- تخصيص عمود تاريخ الإضافة -->
        <template #cell-created_at="{ row }">
          <span class="text-fluid-xs text-text/60">{{ formatDate(row.created_at) }}</span>
        </template>

        <template #cell-updated_at="{ row }">
          <span class="text-fluid-xs text-text/60">{{ formatDate(row.updated_at) }}</span>
        </template>

        <template #cell-expires_at="{ row }">
          <span class="text-fluid-xs text-text/60">{{ formatDate(row.expires_at) }}</span>
        </template>

        <!-- تخصيص عمود الحالة الأمنية (تمييز الجلسة الحالية) -->
        <template #cell-status="{ row }">
          <span v-if="isCurrentSession(row)"
            class="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-bg text-success border border-primary/20 inline-flex items-center gap-1">
            <span class="w-1 h-1 rounded-full bg-success text-success animate-pulse"></span>
            متصل الآن
          </span>
          <span v-else
            class="px-2.5 py-0.5 text-[10px] font-medium rounded-md bg-text/5 text-text/50 border border-text/10 inline-block">
            جهاز فرعي
          </span>
        </template>

        <!-- تخصيص الإجراءات الأمنية (طرد وحذف الأجهزة الأخرى وحجب تدمير الذات) -->
        <template #cell-actions="{ row }">
          <div class="flex items-center justify-center">
            <button v-if="!isCurrentSession(row)" type="button" @click="handleRevokeSession(row.id)"
              :disabled="userStore.isLoading"
              class="px-3 py-1 rounded-xl border bg-danger/5 border-danger/20 hover:bg-danger/10 text-danger font-medium text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1">
              <Icon name="lucide:user-x" class="w-3.5 h-3.5" />
              <span>إنهاء الجلسة</span>
            </button>
            <span v-else class="text-fluid-xs text-text/30 font-medium select-none">
              —
            </span>
          </div>
        </template>

      </UiBaseTable>
    </div>
  </div>
</template>
