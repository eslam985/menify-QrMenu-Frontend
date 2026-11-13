import QRCode from "qrcode";

export const useMenuShare = () => {
  const authStore = useAuthStore();

  const copied = ref(false);
  const qrCodeUrl = ref("");

  const slug = computed(() => authStore.restaurantSlug);

  const menuLink = computed(() => {
    if (import.meta.client) {
      return `${window.location.origin}/menu/${slug.value}`;
    }

    const requestUrl = useRequestURL();
    return `${requestUrl.origin}/menu/${slug.value}`;
  });

  const generateQr = async () => {
    try {
      qrCodeUrl.value = await QRCode.toDataURL(menuLink.value, {
        width: 300,
        margin: 2,
        color: {
          dark: "#c95400",
          light: "#ffffff",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuLink.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return {
    menuLink,
    copied,
    qrCodeUrl,
    copyLink,
    generateQr,
  };
};
