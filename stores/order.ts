import { defineStore } from "pinia";
import type { Order } from "~/types";

export const useOrderStore = defineStore("orders", () => {
  const { api } = useApi();
  const toast = useToast();
  const items = ref<Order[]>([]);
  const current = ref<Order | null>(null);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(0);

  async function fetchMyOrders() {
    loading.value = true;
    try {
      const res = await api<any>("/users/orders", {
        query: { page: page.value, limit: limit.value },
      });
      items.value = res.orders;
      total.value = res.total;
      totalPages.value = res.totalPages;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id: number) {
    loading.value = true;
    try {
      current.value = await api<Order>(`/orders/${id}`);
    } finally {
      loading.value = false;
    }
  }

  async function createOrder(payload: {
    items: { cartItemId: number }[];
    paymentMethod: "VNPAY" | "COD";
    couponCode?: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    note?: string;
  }) {
    return await api<{ order: Order; paymentUrl: string | null }>("/orders", {
      method: "POST",
      body: payload,
    });
  }

  async function cancelOrder(id: number) {
    await api(`/users/orders/${id}/cancel`, { method: "POST" });
    const order = items.value.find((o) => o.id === id);
    if (order) order.status = "CANCELLED";
    if (current.value?.id === id) current.value.status = "CANCELLED";
    toast.add({ title: "Đã hủy đơn hàng", color: "info" });
  }

  function changePage(p: number) {
    page.value = p;
    fetchMyOrders();
  }

  return {
    items,
    current,
    loading,
    total,
    page,
    limit,
    totalPages,
    fetchMyOrders,
    fetchOne,
    createOrder,
    cancelOrder,
    changePage,
  };
});
   