<template>
  <div class="relative min-h-screen">
    <div class="fixed left-0 right-0 z-11 w-full">
      <LayoutHeader />
    </div>
    <div class="relative top-17.5 sm:top-29.5 md:top-35.5 right-0 left-0 w-full">
      <slot />
      <button :class="[
        'hidden md:flex fixed bottom-8 right-22 w-11.5 h-11.5 justify-center items-center rounded-full bg-secondary z-5 hover:text-text hover:bg-secondary-02 transition-all duration-500',
        scrollY > 400
          ? 'opacity-100 '
          : 'opacity-0  pointer-events-none'
      ]" @click="y -= y">
        <IconsArrow2 class="-rotate-90 cursor-pointer" />
      </button>
      <LayoutFooter />
      <ChatWidget />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { y } = useWindowScroll({ behavior: 'smooth' });
const scrollY = computed(() => y.value)
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([
      cartStore.fetchCart(),
      wishlistStore.fetchWishlist(),
    ])
  }
})
</script>