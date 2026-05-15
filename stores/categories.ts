
export const useCategoryStore = defineStore("categories", () => {
  const { api } = useApi();
  const categories = ref<any[]>([]);

  async function fetchCategories() {
    try {
      const data = await api<any[]>("/categories");
      categories.value = data;
      return data;
    } catch {
      return [];
    }
  }

  return { categories, fetchCategories };
});
