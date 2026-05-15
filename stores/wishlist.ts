import { defineStore } from "pinia";
import type { WishlistItem } from "~/types";

export const useWishlistStore = defineStore("wishlist", () => {
  const { api } = useApi();
  const toast = useToast();

  const items = ref<WishlistItem[]>([]);
  const loading = ref(false);

  const productIds = computed(() => items.value.map((i) => i.productId));

  const isInWishlist = (productId: number) =>
    productIds.value.includes(productId);

  async function fetchWishlist() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      items.value = [];
      return;
    }
    loading.value = true;
    try {
      items.value = await api<WishlistItem[]>("/wishlist");
    } catch {
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function toggle(productId: number) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      await navigateTo("/sign-in");
      return;
    }
    if (isInWishlist(productId)) {
      await api(`/wishlist/${productId}`, { method: "DELETE" });
      items.value = items.value.filter((i) => i.productId !== productId);
      toast.add({ title: "Đã xóa khỏi yêu thích", color: "info" });
    } else {
      await api(`/wishlist/${productId}`, { method: "POST" });  
      await fetchWishlist();
      toast.add({ title: "Đã thêm vào yêu thích", color: "success" });
    }
  }

  return { items, loading, isInWishlist, fetchWishlist, toggle };
});
