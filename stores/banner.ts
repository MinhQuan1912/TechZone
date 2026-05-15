import { defineStore } from "pinia";
import type { Banner } from "~/types";

export const useBannerStore = defineStore("banner", () => {
  const { api } = useApi();
  const banners = ref<Banner[]>([]);

  async function fetchBanners() {
    try {
      const data = await api<Banner[]>("/banners");
      banners.value = data;
      return data;
    } catch {
      return [];
    }
  }

  return { banners, fetchBanners };
});
