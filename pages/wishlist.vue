<template>
   <div class="container mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center justify-between mb-6">
         <div>
            <h1 class="text-2xl font-bold text-gray-900">
               Sản phẩm yêu thích
               <UBadge v-if="wishlistStore.items.length > 0" color="error" variant="soft" class="ml-2 align-middle">
                  {{ wishlistStore.items.length }}
               </UBadge>
            </h1>
            <p class="text-sm text-gray-500 mt-0.5">
               Những sản phẩm bạn đã lưu lại
            </p>
         </div>
      </div>

      <div v-if="wishlistStore.loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         <div v-for="i in 8" :key="i" class="animate-pulse bg-white rounded-2xl overflow-hidden border h-80">
            <div class="h-48 bg-gray-200" />
            <div class="p-4 space-y-2">
               <div class="h-3 bg-gray-200 rounded" />
               <div class="h-3 bg-gray-200 rounded w-2/3" />
               <div class="h-5 bg-gray-200 rounded w-1/2" />
            </div>
         </div>
      </div>

      <CommonAppEmpty v-else-if="wishlistStore.items.length === 0" icon="i-heroicons-heart"
         title="Chưa có sản phẩm yêu thích" description="Bấm vào icon trái tim trên sản phẩm để lưu vào đây"
         action-label="Khám phá sản phẩm" action-to="/products" />

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         <div v-for="item in wishlistStore.items" :key="item.id" class="relative group">
            <button
               class="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:bg-red-50 hover:scale-110"
               :title="`Xóa ${item.product.name} khỏi yêu thích`" @click="wishlistStore.toggle(item.productId)">
               <UIcon name="i-heroicons-heart-solid" class="w-4 h-4 text-red-500" />
            </button>
            <ProductCard :product="item.product" />
         </div>
      </div>
      <div v-if="wishlistStore.items.length > 0" class="mt-8 flex justify-center">
         <UButton color="neutral" variant="outline" icon="i-heroicons-trash" @click="confirmClearOpen = true">
            Xóa tất cả yêu thích
         </UButton>
      </div>

      <UModal v-model:open="confirmClearOpen">
         <template #content>
           <UCard>
               <template #header>
                  <h3 class="font-semibold text-gray-900">Xóa tất cả yêu thích?</h3>
               </template>
               <p class="text-sm text-gray-600">
                  Tất cả {{ wishlistStore.items.length }} sản phẩm sẽ bị xóa khỏi danh sách yêu thích.
                  Thao tác này không thể hoàn tác.
               </p>
               <template #footer>
                  <div class="flex justify-end gap-3">
                     <UButton color="neutral" variant="outline" @click="confirmClearOpen = false">
                        Hủy
                     </UButton>
                     <UButton color="error" :loading="clearing" @click="clearAll">
                        Xóa tất cả
                     </UButton>
                  </div>
               </template>
            </UCard>
         </template>

      </UModal>
   </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Yêu thích' })
const wishlistStore = useWishlistStore()
const { api } = useApi()
const toast = useToast()

const confirmClearOpen = ref(false)
const clearing = ref(false)

async function clearAll() {
   clearing.value = true
   try {
      await Promise.all(
         wishlistStore.items.map(item =>
            api(`/wishlist/${item.productId}`, { method: 'DELETE' })
         )
      )
      wishlistStore.items = []
      confirmClearOpen.value = false
      toast.add({ title: 'Đã xóa tất cả yêu thích', color: 'info' })
   } finally {
      clearing.value = false
   }
}
onMounted(async () => {
   await wishlistStore.fetchWishlist()
})
</script>