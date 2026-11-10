<script setup lang="ts">
const userStore = useUserStore();
const authStore = useAuthStore();

const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const isDropdownOpen = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);
const DEFAULT_AVATAR: string =
  "https://res.cloudinary.com/dbahqgo8j/image/upload/blogger/iaeclevshfanh5j6x9ew.webp";

const handleFileChange = (event: Event) => {
  if (!event) return;
  const file: File | undefined = (event.target as HTMLInputElement | null)
    ?.files?.[0];
  if (!file) return;

  selectedFile.value = file;

  avatarPreview.value = URL.createObjectURL(file);
};

const handleUpload = async (): Promise<void | null> => {
  if (!selectedFile.value) return null;

  const formData: FormData = new FormData();
  formData.append("profileImage", selectedFile.value);

  await userStore.uploadAvatar(formData);

  selectedFile.value = null;
};

const handleDelete = async () => {
  await userStore.deleteAvatar();
};

const handleSelectHistory = async (url: string): Promise<null | undefined> => {
  const isSuccess = await userStore.setAvatarFromHistory(url);

  if (!isSuccess) {
    return null;
  } else {
    isModalOpen.value = false;
    await userStore.findUserById();
  }

  return null;
};

const role = (): "Admin" | "Editor" | "User" | "N/A" =>
  authStore.user?.roles === "5150"
    ? "Admin"
    : authStore.user?.roles === "1984"
      ? "Editor"
      : authStore.user?.roles === "2001"
        ? "User"
        : "N/A";
</script>

<template>
  <section dir="ltr">
    <div
      @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
      class="mb-section-fluid w-full min-w-0 space-y-6 overflow-x-hidden"
    >
      <h2
        dir="rtl"
        class="text-fluid-h2 mb-fluid text-text md:hover:text-primary"
      >
        البيانات الأساسية
      </h2>

      <div
        @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
        class="gap-fluid border-primary/20 p-section-fluid bg-card flex flex-col justify-between rounded-3xl border shadow md:flex-row lg:gap-8"
      >
        <div
          @click.self="
            isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen
          "
          class="gap-fluid grid grid-cols-1 sm:flex sm:flex-wrap md:max-w-[60%] lg:gap-8"
        >
          <div
            @click.self="
              isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen
            "
            class="gap-fluid flex flex-col items-center sm:items-start"
          >
            <div class="group relative h-26 w-26 md:h-32 md:w-32">
              <label
                class="block h-full w-full cursor-pointer overflow-hidden rounded-full"
              >
                <img
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  :src="
                    avatarPreview ||
                    authStore.user?.avatar_url ||
                    DEFAULT_AVATAR
                  "
                  alt="profile"
                  fetchpriority="high"
                  loading="eager"
                  decoding="async"
                />

                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </label>

              <div class="absolute inset-e-0 bottom-0 z-50">
                <button
                  type="button"
                  @click="isDropdownOpen = !isDropdownOpen"
                  class="text-text bg-bg border-primary/10 flex cursor-pointer items-center justify-center rounded-full border p-1 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 md:p-2"
                >
                  <Icon name="lucide:camera" class="text-primary h-6 w-6" />
                </button>

                <div
                  v-if="isDropdownOpen"
                  class="bg-bg border-primary/30 animate-fade-in absolute inset-e-0 top-full z-100 mt-2 flex min-w-[150px] flex-col items-center justify-center gap-2 rounded-2xl border p-2 shadow-xl md:flex-row-reverse"
                >
                  <label
                    class="hover:bg-primary/10 text-text flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200"
                  >
                    <Icon
                      name="lucide:image-plus"
                      class="text-primary h-6 w-6"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="
                        (e) => {
                          handleFileChange(e);
                          isDropdownOpen = false;
                        }
                      "
                    />
                  </label>

                  <button
                    v-if="
                      authStore.user?.avatar_history &&
                      authStore.user?.avatar_history?.length > 0
                    "
                    type="button"
                    @click="
                      isModalOpen = true;
                      isDropdownOpen = false;
                    "
                    class="hover:bg-primary/10 text-text flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200"
                  >
                    <Icon name="lucide:history" class="text-primary h-6 w-6" />
                  </button>

                  <button
                    v-if="
                      authStore.user?.avatar_url &&
                      authStore.user?.avatar_url !== 'https://cloudinary.com'
                    "
                    type="button"
                    @click="handleDelete"
                    class="hover:bg-danger/10 text-danger flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200"
                  >
                    <Icon name="lucide:trash-2" class="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <button
              v-if="selectedFile"
              type="button"
              @click="handleUpload"
              :disabled="userStore.isLoading"
              class="btn-primary"
            >
              {{ userStore.isLoading ? "Uploading..." : "Save Photo" }}
            </button>
          </div>

          <div
            @click.self="
              isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen
            "
            class="gap-fluid flex flex-col"
          >
            <NuxtLink
              to="/dashboard/profile"
              class="text-fluid-h3 lg:hover:text-primary"
              >{{ authStore.user?.username }}</NuxtLink
            >

            <div class="flex gap-2">
              <Icon name="lucide:mail" class="text-primary h-6 w-6" />
              <a
                target="_blank"
                href="mailto:ee17172@gmail.com"
                class="text-text lg:hover:text-pimary"
              >
                {{ authStore.user?.email }}
              </a>
            </div>

            <div class="flex gap-2">
              <Icon name="lucide:calendar-days" class="text-primary h-6 w-6" />
              <span
                class="text-fluid-p text-text bg-bg max-w-[280px] rounded-xl px-2 py-1"
              >
                Member since
                {{
                  authStore.user?.created_at
                    ? formatDate(authStore.user?.created_at)
                    : "-"
                }}
              </span>
            </div>

            <div class="gap-fluid flex">
              <Icon name="lucide:link" class="text-primary" />

              <a
                target="_blank"
                :href="authStore.user?.avatar_url ?? DEFAULT_AVATAR"
                class="text-fluid-xs lg:hover:text-pimary max-w-100 cursor-pointer self-center truncate text-center transition-colors"
              >
                Avatar URL
                <span class="text-primary mx-1">
                  {{
                    authStore.user?.avatar_url
                      ? authStore.user?.avatar_url
                      : DEFAULT_AVATAR
                  }}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div
          class="md:gap-fluid grid grid-cols-3 gap-2 self-center md:flex md:flex-col"
        >
          <span
            class="text-fluid-xs bg-success/10 text-success flex items-center justify-center gap-1 self-center rounded-full px-3 py-1.5 text-nowrap"
          >
            <span
              class="bg-success animate-pulse-glow h-2 w-2 self-center rounded-full text-center"
            ></span>
            Active
          </span>
          <span
            class="text-fluid-xs bg-bg text-primary self-center rounded-full px-3 py-1.5 text-center text-nowrap transition-transform lg:hover:scale-105"
          >
            {{ role() }}
          </span>
          <p
            class="text-text/80 text-fluid-xs bg-bg self-center rounded-full px-3 py-2 text-nowrap transition-transform lg:hover:scale-105"
          >
            Active Sessions
            <span class="text-primary">{{ userStore.sessions.length }}</span>
          </p>
        </div>
      </div>
    </div>

    <div
      @click.self="isModalOpen = false"
      v-if="isModalOpen"
      class="p-fluid fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        class="bg-card border-primary/30 p-section-fluid animate-fade-in w-full max-w-md space-y-6 rounded-3xl border shadow-2xl"
      >
        <div
          class="border-primary/30 flex items-center justify-between border-b pb-3"
        >
          <div class="flex items-center gap-2">
            <Icon
              name="lucide:rotate-ccw-clock"
              class="text-primary/80 h-8 w-8"
            />
            <span class="text-fluid-h3">Photo History</span>
          </div>
          <button @click="isModalOpen = false" class="btn-danger flex">
            <Icon name="lucide:x" />
          </button>
        </div>

        <div
          class="gap-fluid grid max-h-[300px] grid-cols-3 overflow-y-auto p-1"
        >
          <div
            v-for="(url, index) in authStore.user?.avatar_history"
            :key="index"
            class="border-primary/30 group hover:border-primary/30 relative aspect-square cursor-pointer overflow-hidden rounded-full border shadow-sm transition-all duration-300"
            @click="handleSelectHistory(url)"
          >
            <img
              :src="url"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Previous avatar"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span
                class="text-text bg-bg rounded-full px-2 py-0.5 text-[10px] font-medium"
                >Select</span
              >
            </div>
          </div>
        </div>

        <div class="border-primary/30 flex justify-end border-t pt-3">
          <button type="button" @click="isModalOpen = false" class="btn-danger">
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
