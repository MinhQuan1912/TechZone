export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase as string;
  const toast = useToast();
  const authStore = useAuthStore();
  async function api<T = any>(
    url: string,
    options: {
      method?: string;
      body?: any;
      query?: Record<string, any>;
      server?: boolean;
      headers?: Record<string, string>;
    } = {},
  ): Promise<T> {
    const doFetch = async (): Promise<T> => {
      const res = await $fetch<{ success: boolean; data: T }>(url, {
        baseURL,
        method: (options.method as any) || "GET",
        body: options.body,
        params: options.query,
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
          ...options.headers,
        },
      });
      return res.data;
    };

    try {
      return await doFetch();
    } catch (err: any) {
      if (err.status === 401) {
        try {
          await authStore.doRefresh();
          return await doFetch();
        } catch (refreshError) {
          authStore.logout();
          if (!options.server && import.meta.client) {
            toast.add({
              title: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại",
              color: "error",
            });
          }
          throw refreshError;
        }
      }
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message.join(", ")
        : err?.data?.message || "Đã xảy ra lỗi";

      if (!options.server && import.meta.client) {
        toast.add({ title: "Lỗi", description: msg, color: "error" });
      }
      throw err;
    }
  }
  return { api };
};

export const useApiFetch = <T>(
  url: string,
  options: Parameters<typeof useFetch>[1] & {
    query?: Record<string, any>;
  } = {},
) => {
  const config = useRuntimeConfig();

  const { query, headers, ...restOptions } = options as any;

  return useFetch<T, Error, any, any, any, { success: boolean; data: T }>(url, {
    baseURL: config.public.apiBase as string,
    credentials: "include",
    params: query,

    headers: {
      "ngrok-skip-browser-warning": "true",
      ...(headers || {}),
    },

    transform: (res) => res.data as T,
    ...restOptions,
  });
};
