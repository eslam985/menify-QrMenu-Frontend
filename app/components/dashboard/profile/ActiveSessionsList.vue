<!-- app/components/dashboard/profile/ActiveSessionsList.vue -->
<script setup lang="ts">
import type { SessionResponse } from "@/types/userType/userType";

import { useProfileState } from "@/composables/profile/useProfileState";

const {
  setTableConfig,
  sessionTableColumns,
  sessions,
  isLoading,
  isCurrentSession,
  parseUserAgent,
  handleRevokeSession,
} = useProfileState();

watchEffect(() => {
  setTableConfig(sessionTableColumns, sessions.value, isLoading.value);
});
</script>

<template>
  <div class="mb-section-fluid rounded-card shadow-soft">
    <h3
      class="text-fluid-h3 text-text md:hover:text-primary mb-fluid border-primary/5 mx-auto flex w-full items-center gap-2 border-b pb-2 font-bold select-none 2xl:max-w-[90%]"
    >
      <Icon name="lucide:shield-alert" class="text-primary h-5 w-5" />
      <span>إدارة الجلسات النشطة والأجهزة المتصلة</span>
    </h3>

    <div class="">
      <UiBaseTable>
        <template #cell-device_info="{ row }">
          <div class="text-text flex items-center gap-2 font-bold">
            <Icon
              :name="
                isCurrentSession(row as unknown as SessionResponse)
                  ? 'lucide:smartphone'
                  : 'lucide:monitor-smartphone'
              "
              :class="
                isCurrentSession(row as unknown as SessionResponse)
                  ? 'text-primary'
                  : 'text-text/40'
              "
              class="h-5 w-5 shrink"
            />
            <span>{{
              parseUserAgent((row as unknown as SessionResponse).user_agent)
            }}</span>
          </div>
        </template>

        <template #cell-ip_address="{ row }">
          <span
            class="text-fluid-sm text-text/80 bg-bg border-primary/5 rounded border px-2 py-0.5 font-mono"
          >
            {{ row.ip_address }}
          </span>
        </template>

        <template #cell-created_at="{ row }">
          <span class="text-fluid-xs text-text/60">{{
            formatDate((row as unknown as SessionResponse).created_at)
          }}</span>
        </template>

        <template #cell-updated_at="{ row }">
          <span class="text-fluid-xs text-text/60">{{
            formatDate((row as unknown as SessionResponse).updated_at)
          }}</span>
        </template>

        <template #cell-expires_at="{ row }">
          <span class="text-fluid-xs text-text/60">{{
            formatDate((row as unknown as SessionResponse).expires_at)
          }}</span>
        </template>

        <template #cell-status="{ row }">
          <span
            v-if="isCurrentSession(row as unknown as SessionResponse)"
            class="bg-bg text-success border-primary/20 inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[10px] font-bold"
          >
            <span
              class="bg-success text-success h-1 w-1 animate-pulse rounded-full"
            ></span>
            متصل الآن
          </span>
          <span
            v-else
            class="bg-text/5 text-text/50 border-text/10 inline-block rounded-md border px-2.5 py-0.5 text-[10px] font-medium"
          >
            جهاز فرعي
          </span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-center">
            <button
              v-if="!isCurrentSession(row as unknown as SessionResponse)"
              type="button"
              @click="
                handleRevokeSession((row as unknown as SessionResponse).id)
              "
              :disabled="isLoading"
              class="bg-danger/5 border-danger/20 hover:bg-danger/10 text-danger px-fluid text-fluid-xs flex cursor-pointer items-center gap-1 rounded-xl border py-1 font-medium active:scale-95 disabled:opacity-50"
            >
              <Icon name="lucide:user-x" class="h-3.5 w-3.5" />
              <span>إنهاء الجلسة</span>
            </button>
            <span
              v-else
              class="text-fluid-xs text-text/30 font-medium select-none"
            >
              —
            </span>
          </div>
        </template>
      </UiBaseTable>
    </div>
  </div>
</template>
