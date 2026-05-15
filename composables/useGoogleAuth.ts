export const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const toast = useToast();
  const loading = ref(false);

  function initGoogleButton(elementId: string, onSuccess?: () => void) {
    if (!import.meta.client) return;

    if (!window.google?.accounts?.id) {
      setTimeout(() => initGoogleButton(elementId, onSuccess), 300);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: config.public.googleClientId as string,
      callback: (response: any) => handleCredential(response, onSuccess),
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    const el = document.getElementById(elementId);
    if (!el) return;

    window.google.accounts.id.renderButton(el, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: 445,
    });
  }
   
  async function handleCredential(
    response: { credential: string },
    onSuccess?: () => void,
  ) {
    loading.value = true;
    try {
      const res = await $fetch<any>("/auth/google", {
        baseURL: config.public.apiBase as string,
        method: "POST",
        body: { credential: response.credential },
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      authStore.user = res.data.user;
      await Promise.all([cartStore.fetchCart(), wishlistStore.fetchWishlist()]);

      toast.add({ title: "Đăng nhập Google thành công!", color: "success" });

      if (onSuccess) onSuccess();
      else await navigateTo("/");
    } catch (e: any) {
      toast.add({
        title: "Đăng nhập Google thất bại",
        description: e?.data?.message || "Vui lòng thử lại",
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  }

  function cleanup() {
    if (import.meta.client && window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
  }

  return { loading, initGoogleButton, cleanup };
};
