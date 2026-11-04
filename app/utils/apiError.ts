/** Turns an API/network error into a readable message. */
export const getApiError = (err: any, fallback: string): string => {
  if (!err?.response) return 'تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت'
  if (err.response.status === 429) return 'محاولات كثيرة، حاول مرة أخرى بعد قليل'

  // validation errors: { errors: { "body.password": ["..."] } } -> first message
  const fieldErrors = err?.data?.errors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const first = Object.values(fieldErrors).flat()[0]
    if (first) return String(first)
  }
  return err?.data?.message || fallback
}