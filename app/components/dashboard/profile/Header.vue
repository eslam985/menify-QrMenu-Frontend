<script setup lang="ts">
const userStore = useUserStore()

onMounted(async () => {
  await userStore.findUserById()
  await userStore.getSessionsByUserId({})
})

const selectedFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const isDropdownOpen = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)
const DEFAULT_AVATAR: string =
  'https://res.cloudinary.com/dbahqgo8j/image/upload/blogger/iaeclevshfanh5j6x9ew.webp'

const handleFileChange = (event: Event) => {
  if (!event) return
  const file: File | undefined = (event.target as HTMLInputElement | null)?.files?.[0]
  if (!file) return

  selectedFile.value = file

  avatarPreview.value = URL.createObjectURL(file)
}

const handleUpload = async (): Promise<void | null> => {
  if (!selectedFile.value) return null

  const formData: FormData = new FormData()
  formData.append('profileImage', selectedFile.value)

  await userStore.uploadAvatar(formData)

  selectedFile.value = null
}

const handleDelete = async () => {
  await userStore.deleteAvatar()
}

const handleSelectHistory = async (url: string): Promise<null | undefined> => {
  const isSuccess = await userStore.setAvatarFromHistory(url)

  if (!isSuccess) {
    return null
  } else {
    isModalOpen.value = false
    await userStore.findUserById()
  }

  return null
}

const role = (): 'Admin' | 'Editor' | 'User' | 'N/A' =>
  userStore.userInfo?.roles === '5150'
    ? 'Admin'
    : userStore.userInfo?.roles === '1984'
      ? 'Editor'
      : userStore.userInfo?.roles === '2001'
        ? 'User'
        : 'N/A'
</script>

<template>
  <section dir="ltr">
    <div @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
      class="space-y-6 mb-section-fluid w-full min-w-0 overflow-x-hidden">
      
      <h2 dir="rtl" class="text-fluid-h2 mb-fluid text-text md:hover:text-primary">البيانات الأساسية</h2>

      <!-- container -->
      <div @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
        class="flex flex-col md:flex-row gap-fluid border border-primary/20 lg:gap-8 justify-between p-section-fluid bg-card shadow rounded-3xl">
        <div @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
          class="md:max-w-[60%] grid grid-cols-1 sm:flex sm:flex-wrap gap-fluid lg:gap-8">
          <div @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
            class="flex flex-col items-center sm:items-start gap-fluid">
            <!-- حاوية الصورة والأيقونة معاً -->
            <div class="relative w-26 h-26 md:w-32 md:h-32 group">
              <!-- Avatar -->
              <label class="block w-full h-full rounded-full overflow-hidden cursor-pointer">
                <!-- الـ src هنا ذكي: يعرض المعاينة المؤقتة أولاً، وإذا لم توجد يعرض صورة المستخدم الفعلية أو صورة افتراضية -->
                <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" :src="avatarPreview ||
                  userStore.userInfo?.avatar_url ||
                  DEFAULT_AVATAR
                  " alt="profile" fetchpriority="high" loading="eager" decoding="async" />

                <!-- ربط حدث التغيير بالـ input -->
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>

              <!-- زر الكاميرا مثبت بدقة على حافة الصورة -->
              <!-- زر الكاميرا مدمج معه القائمة المنبثقة (Dropdown) -->
              <div class="absolute inset-e-0 bottom-0 z-50">
                <button type="button" @click="isDropdownOpen = !isDropdownOpen"
                  class="text-text bg-bg shadow-md rounded-full p-1 md:p-2 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 border border-primary/10 flex items-center justify-center">
                  <Icon name="lucide:camera" class="w-6 h-6 text-primary" />
                </button>

                <!-- القائمة المنبثقة لخيارات الصورة -->
                <!-- التعديل الصحيح والمحمي 100% ضد انكماش الأيقونات -->
                <div v-if="isDropdownOpen"
                  class="absolute inset-e-0 top-full mt-2 z-100 min-w-[150px] bg-bg border border-primary/30 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row-reverse gap-2 items-center justify-center animate-fade-in">
                  <!-- خيار 1: رفع صورة جديدة (مغلف داخل label) -->
                  <label
                    class="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-primary/10 text-text transition-colors duration-200">
                    <Icon name="lucide:image-plus" class="w-6 h-6 text-primary" />

                    <input type="file" accept="image/*" class="hidden" @change="
                      (e) => {
                        handleFileChange(e)
                        isDropdownOpen = false
                      }
                    " />
                  </label>

                  <!-- خيار 2: اختيار من الصور السابقة (قمنا بتغليفه داخل button أصيل) -->
                  <button v-if="
                    userStore.userInfo?.avatar_history &&
                    userStore.userInfo?.avatar_history?.length > 0
                  " type="button" @click="
                    isModalOpen = true;
                  isDropdownOpen = false;
                  "
                    class="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-primary/10 text-text transition-colors duration-200">
                    <Icon name="lucide:history" class="w-6 h-6 text-primary" />

                  </button>

                  <!-- خيار 3: حذف الصورة الحالية والعودة للافتراضية (قمنا بتغليفه داخل button أصيل) -->
                  <button v-if="
                    userStore.userInfo?.avatar_url &&
                    userStore.userInfo?.avatar_url !==
                    'https://cloudinary.com'
                  " type="button" @click="handleDelete"
                    class="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-danger/10 text-danger transition-colors duration-200">
                    <Icon name="lucide:trash-2" class="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <!--  الزر الجديد يظهر فقط عند وجود صورة جديدة مجهزة للرفع -->
            <button v-if="selectedFile" type="button" @click="handleUpload" :disabled="userStore.isLoading"
              class="btn-primary">
              {{ userStore.isLoading ? 'Uploading...' : 'Save Photo' }}
            </button>
          </div>

          <!-- info -->
          <div @click.self="isDropdownOpen ? (isDropdownOpen = false) : isDropdownOpen"
            class=" flex flex-col gap-fluid">
            <NuxtLink to="/dashboard/profile" class="text-fluid-h3 lg:hover:text-primary">{{
              userStore.userInfo?.username }}</NuxtLink>

            <div class="flex gap-2">
              <Icon name="lucide:mail" class="w-6 h-6 text-primary" />
              <a target="_blank" href="mailto:ee17172@gmail.com" class="text-text lg:hover:text-pimary">
                {{ userStore.userInfo?.email }}
              </a>
            </div>

            <div class="flex gap-2">
              <Icon name="lucide:calendar-days" class="w-6 h-6 text-primary" />
              <span class="py-1 px-2 rounded-xl max-w-[280px] text-fluid-p text-text bg-bg">
                Member since
                {{
                  userStore.userInfo?.created_at
                    ? formatDate(userStore.userInfo?.created_at)
                    : '-'
                }}
              </span>
            </div>

            <div class="flex gap-fluid">

              <Icon name="lucide:link" class="text-primary" />

              <a target="_blank" :href="userStore.userInfo?.avatar_url ?? DEFAULT_AVATAR"
                class="max-w-100 text-fluid-xs text-center self-center truncate lg:hover:text-pimary cursor-pointer transition-colors">
                Avatar URL
                <span class="text-primary mx-1">
                  {{
                    userStore.userInfo?.avatar_url
                      ? userStore.userInfo?.avatar_url
                      : DEFAULT_AVATAR
                  }}
                </span>
              </a>
            </div>
          </div>

        </div>

        <!-- Right -->
        <div class="grid grid-cols-3 md:flex md:flex-col self-center gap-2 md:gap-fluid">
          <span
            class="self-center text-nowrap text-fluid-xs px-3 py-1.5 rounded-full bg-success/10 text-success flex items-center justify-center gap-1">
            <span class="w-2 h-2 bg-success text-center self-center rounded-full animate-pulse-glow"></span>
            Active
          </span>
          <span
            class="self-center text-nowrap text-fluid-xs text-center px-3 py-1.5 rounded-full bg-bg text-primary transition-transform lg:hover:scale-105">
            {{ role() }}
          </span>
          <p
            class="self-center text-text/80 text-nowrap text-fluid-xs px-3 py-2 rounded-full bg-bg transition-transform lg:hover:scale-105">
            Active Sessions <span class="text-primary">{{ userStore.sessions.length }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- نافذة عرض سجل الصور المرفوعة سابقاً (History Modal) -->
    <div @click.self="isModalOpen = false" v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-fluid">
      <div
        class="bg-card border border-primary/30 rounded-3xl max-w-md w-full p-section-fluid shadow-2xl space-y-6 animate-fade-in">
        <!-- رأس النافذة -->
        <div class="flex justify-between items-center border-b border-primary/30 pb-3">
          <div class="flex items-center gap-2">
            <Icon name="lucide:rotate-ccw-clock" class="w-8 h-8 text-primary/80" />
            <span class="text-fluid-h3">Photo History</span>
          </div>
          <button @click="isModalOpen = false" class="flex btn-danger">
            <Icon name="lucide:x" />
          </button>
        </div>

        <!-- شبكة عرض الصور القديمة -->
        <div class="grid grid-cols-3 gap-fluid max-h-[300px] overflow-y-auto p-1">
          <div v-for="(url, index) in userStore.userInfo?.avatar_history" :key="index"
            class="relative aspect-square rounded-full overflow-hidden border border-primary/30 group cursor-pointer shadow-sm hover:border-primary/30 transition-all duration-300"
            @click="handleSelectHistory(url)">
            <img :src="url" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Previous avatar" />
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-text text-[10px] font-medium bg-bg px-2 py-0.5 rounded-full">Select</span>
            </div>
          </div>
        </div>

        <!-- تذييل النافذة -->
        <div class="flex justify-end pt-3 border-t border-primary/30">
          <button type="button" @click="isModalOpen = false" class="btn-danger">
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
