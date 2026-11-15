/**
 * Composable for handling single image file selection, live preview generation,
 * and automatic browser memory cleanup.
 */
export const useImageUpload = () => {
  const selectedFile = ref<File | null>(null);
  const imagePreview = ref<string | null>(null);

  /**
   * Releases any previously created object URL to prevent browser memory leaks.
   */
  const revokePreview = () => {
    if (imagePreview.value && imagePreview.value.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview.value);
    }
  };

  /**
   * Handles native file input change events and creates a preview URL.
   */
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    const file = target?.files?.[0];

    if (!file) return;

    revokePreview();
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  };

  /**
   * Clears the selected file and resets the preview URL.
   */
  const resetImage = () => {
    revokePreview();
    selectedFile.value = null;
    imagePreview.value = null;
  };

  onUnmounted(() => {
    revokePreview();
  });

  return {
    selectedFile,
    imagePreview,
    handleFileChange,
    resetImage,
  };
};
