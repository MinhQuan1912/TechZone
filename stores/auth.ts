import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase as string;
  const user = useCookie<any | null>("shop_user", {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    default: () => null,
  });
  const isAuthenticated = computed(() => !!user.value);
  async function login(emailOrUsername: string, password: string) {
    const res = await $fetch<any>("/auth/login", {
      baseURL,
      method: "POST",
      body: { emailOrUsername, password },
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    user.value = res.data.user;
    return res.data;
  }
  async function register(
    email: string,
    name: string,
    password: string,
    username: string,
  ) {
    const res = await $fetch<any>("/auth/register", {
      baseURL,
      method: "POST",
      body: { email, name, password, username },
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    user.value = res.data.user;
    return res.data;
  }
  async function doRefresh() {
    await $fetch<any>("/auth/refresh", {
      baseURL,
      method: "POST",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  }
  async function updateProfile(data: {
    name?: string;
    phone?: string;
    address?: string;
  }) {
    const res = await $fetch<any>("/users/profile", {
      baseURL,
      method: "PATCH",
      body: data,
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    user.value = { ...user.value, ...res.data };
    return res.data;
  }
  async function logout() {
    try {
      await $fetch("/auth/logout", {
        baseURL,
        method: "POST",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
    } catch {
    }
    user.value = null;
  }
  return {
    user,
    isAuthenticated,
    login,
    register,
    doRefresh,
    updateProfile,
    logout,
  };
});
