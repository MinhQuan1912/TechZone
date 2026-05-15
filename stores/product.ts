import { defineStore } from "pinia";
import type { Product } from "~/types";

export const useProductStore = defineStore("products", () => {
  const { api } = useApi();
  const items = ref<Product[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(12);
  const totalPages = ref(0);
  const isFetched = ref(false);
  const availableBrands = ref<string[]>([]);
  const topSelling = ref<Product[]>([]);
  const newArrivals = ref<Product[]>([]);
  const filter = ref({
    search: "",
    categoryId: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    ram: "",
    storage: "",
    sortBy: "newest",
  });

  async function fetchAll(resetPage = false) {
    if (resetPage) page.value = 1;
    loading.value = true;
    try {
      const query: Record<string, any> = {
        page: page.value,
        limit: limit.value,
      };
      if (filter.value.search) query.search = filter.value.search;
      if (filter.value.categoryId) query.categoryId = filter.value.categoryId;
      if (filter.value.brand) query.brand = filter.value.brand;
      if (filter.value.minPrice) query.minPrice = filter.value.minPrice;
      if (filter.value.maxPrice) query.maxPrice = filter.value.maxPrice;
      if (filter.value.color) query.color = filter.value.color;
      if (filter.value.ram) query.ram = filter.value.ram;
      if (filter.value.storage) query.storage = filter.value.storage;
      if (filter.value.sortBy) query.sortBy = filter.value.sortBy;

      const res = await api<any>("/products", { query });
      items.value = res.products;
      total.value = res.total;
      totalPages.value = res.totalPages;
      isFetched.value = true;
    } finally {
      loading.value = false;
    }
  }

  async function fetchBrands() {
    try {
      const res = await api<string[]>("/products/brands");
      availableBrands.value = res;
    } catch {
      availableBrands.value = [
        ...new Set(items.value.map((p) => p.brand).filter(Boolean)),
      ].sort();
    }
  }
  function resetFilter() {
    filter.value = {
      search: "",
      categoryId: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      color: "",
      ram: "",
      storage: "",
      sortBy: "newest",
    };
    page.value = 1;
  }

  async function fetchTopSelling(limit = 10) {
    if (topSelling.value.length) return;
    try {
      const data = await api<Product[]>("/products/top-selling", {
        query: { limit },
      });
      topSelling.value = data;
      return data;
    } finally {
    }
  }

  async function fetchNewArrivals(limit = 10) {
    if (newArrivals.value.length) return;
    try {
      const data = await api<Product[]>("/products/new-arrivals", {
        query: { limit },
      });
      newArrivals.value = data;
      return data;
    } finally {
    }
  }

  return {
    items,
    loading,
    isFetched,
    availableBrands,
    total,
    page,
    limit,
    totalPages,
    filter,
    topSelling,
    newArrivals,
    fetchTopSelling,
    fetchNewArrivals,
    fetchAll,
    fetchBrands,
    resetFilter,
  };
});
