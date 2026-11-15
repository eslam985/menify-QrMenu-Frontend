export interface submitType<TData = unknown> {
  formDataPayload?: TData;
  isSubmitting?: Ref<boolean>;
  apiCall: () => Promise<unknown>;
  onSuccess?: (isSuccess: boolean) => void | Promise<void>;
}


export const useSubmitstate = () => {
  const handleSubmit = async <TData = unknown>({
    formDataPayload,
    isSubmitting,
    apiCall,
    onSuccess,
  }: submitType<TData>) => {
    const submitting = isSubmitting ?? ref(false);

    if (submitting.value) return;

    // التحقق من وجود بيانات صالحة سواء كانت نصاً أو كائناً
    if (formDataPayload !== undefined) {
      if (typeof formDataPayload === "string" && !formDataPayload.trim()) return;
      
      if (
        typeof formDataPayload === "object" &&
        formDataPayload !== null &&
        Object.keys(formDataPayload).length < 1
      ) {
        return;
      }
    }

    submitting.value = true;
    try {
      const result = await apiCall();

      if (onSuccess) await onSuccess(Boolean(result));
    } finally {
      submitting.value = false;
    }
  };

  return { handleSubmit };
};
