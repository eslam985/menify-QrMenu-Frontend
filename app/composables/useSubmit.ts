export interface submitType<TData extends object> {
  formDataPayload: TData;
  isSubmitting: Ref<boolean>;
  apiCall: () => Promise<unknown>;
  onSuccess?: (isSuccess: boolean) => void;
}

export const useSubmitstate = () => {
  const handleSubmit = async <TData extends object>({
    formDataPayload,
    isSubmitting,
    apiCall,
    onSuccess,
  }: submitType<TData>) => {
    if (isSubmitting.value) return;
    if (Object.keys(formDataPayload)?.length < 1) return;

    isSubmitting.value = true;
    try {
      const result = await apiCall();

      if (onSuccess) onSuccess(Boolean(result));
    } finally {
      isSubmitting.value = false;
    }
  };

  return { handleSubmit };
};
