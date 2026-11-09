import type { BaseApiResponse } from "@/types/globalTypes";
import type { PublicMenuResponse } from "@/types/dataType/publicMenuType";
export const usePublicMenuService = () => {
  const config = useRuntimeConfig(); // top of setup, not after an await
  const apiBase = () => config.public.apiBase;

  async function fetchMenu(slug: string) {
    const res = await $fetch<
      Promise<BaseApiResponse<PublicMenuResponse | null>>
    >(`${apiBase()}/public/menu/${encodeURIComponent(slug)}`);

    return res;
  }

  return {
    fetchMenu,
  };
};
