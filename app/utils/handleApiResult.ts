/**
 * Validates the API response, displays the appropriate notification,
 * and returns `true` if the operation succeeded.
 */
export function handleApiResult<T>(
  res: BaseApiResponse<T> | null | undefined,
  fallbackError: string,
  fallbackSuccess?: string,
  requireData = true,
): res is BaseApiResponse<NonNullable<T>> {
  const notiStore = useNotificationStore();
  const isInvalid = !res || !res.success || (requireData && !res.data);

  if (isInvalid) {
    notiStore.show(res?.message || fallbackError, "error");
    return false;
  }

  if (fallbackSuccess) {
    notiStore.show(res.message || fallbackSuccess, "success");
  }

  return true;
}
