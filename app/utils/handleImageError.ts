import { DEFAULT_AVATAR } from "@/utils/constants";

/**
 * Replaces a broken image source with a fallback image URL and prevents infinite error loops.
 *
 * @param event - The native DOM error event triggered by the `<img>` element
 * @param fallbackUrl - Optional custom fallback image URL (defaults to `DEFAULT_AVATAR`)
 *
 * @example
 * <img :src="user.avatar" @error="handleImageError" />
 * <img :src="item.image" @error="(e) => handleImageError(e, '/images/default-food.png')" />
 */
export const handleImageError = (
  event: Event,
  fallbackUrl: string = DEFAULT_AVATAR,
): void => {
  const img = event.target as HTMLImageElement | null;
  if (!img) return;

  // Prevent infinite loop if the fallback image itself fails to load
  img.onerror = null;
  img.src = fallbackUrl;
};
