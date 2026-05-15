import { defineStore } from "pinia";
import type { CartItem } from "~/types";

export const useCartStore = defineStore("cart", () => {
  const { api } = useApi();
  const toast = useToast();
  const isFetched = ref(false);
  const items = ref<CartItem[]>([]);
  const loading = ref(true);
  const isOpen = ref(false);

  const totalItems = computed(() =>
    items.value.reduce((s, i) => s + i.quantity, 0),
  );

  const totalPrice = computed(() =>
    items.value.reduce((s, i) => s + i.variant.salePrice * i.quantity, 0),
  );

  async function fetchCart() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      items.value = [];
      return;
    }
    loading.value = true;
    try {
      items.value = await api<CartItem[]>("/cart");
    } catch {
      items.value = [];
    } finally {
      loading.value = false;
      isFetched.value = true;
    }
  }

  async function addToCart(variantId: number, quantity = 1) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      await navigateTo("/sign-in");
      return;
    }
    await api("/cart", {
      method: "POST",
      body: { variantId, quantity },
    });
    await fetchCart();
    toast.add({ title: "Đã thêm vào giỏ hàng", color: "success" });
    isOpen.value = true;
  }

  async function updateQuantity(itemId: number, quantity: number) {
    await api(`/cart/${itemId}`, {
      method: "PATCH",
      body: { quantity },
    });
    const item = items.value.find((i) => i.id === itemId);
    if (item) item.quantity = quantity;
  }

  async function removeItems(itemIds: number[]) {
    await api("/cart/items", {
      method: "DELETE",
      body: { itemIds },
    });
    items.value = items.value.filter((i) => !itemIds.includes(i.id));
  }

  async function clearCart() {
    await api("/cart/clear", { method: "DELETE" });
    items.value = [];
  }

  return {
    items,
    isFetched,
    loading,
    isOpen,
    totalItems,
    totalPrice,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItems,
    clearCart,
  };
});
