<template>
   <div>
      <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
         <div class="grid md:grid-cols-2 gap-8">
            <div class="animate-pulse space-y-3">
               <div class="aspect-square rounded-2xl bg-gray-200" />
               <div class="flex gap-2">
                  <div v-for="i in 4" :key="i" class="w-16 h-16 rounded-xl bg-gray-200" />
               </div>
            </div>
            <div class="animate-pulse space-y-4">
               <div class="h-8 bg-gray-200 rounded w-3/4" />
               <div class="h-4 bg-gray-200 rounded w-1/2" />
               <div class="h-12 bg-gray-200 rounded w-1/3" />
            </div>
         </div>
      </div>

      <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
         <nav class="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
            <NuxtLink to="/" class="hover:text-gray-600 transition-colors">Trang chủ</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
            <NuxtLink to="/products" class="hover:text-gray-600 transition-colors">Sản phẩm</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
            <NuxtLink :to="`/products?categoryId=${(product as any).categoryId}`"
               class="hover:text-gray-600 transition-colors">
               {{ (product as any).category?.name }}
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
            <span class="text-gray-900 font-medium truncate max-w-48">{{ (product as any).name }}</span>
         </nav>

         <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
               <ProductImages :product-images="(product as any).images || []"
                  :variant-image-url="currentVariantImageUrl"
                  :alt="(product as any).name" />
            </div>
            <div class="space-y-5">
               <div class="flex gap-2 flex-wrap">
                  <UBadge color="primary" variant="soft">{{ (product as any).brand }}</UBadge>
                  <UBadge color="neutral" variant="soft">{{ (product as any).category?.name }}</UBadge>
               </div>
               <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {{ (product as any).name }}
               </h1>
               <div v-if="(product as any).reviewCount > 0" class="flex items-center gap-3">
                  <div class="flex">
                     <UIcon v-for="s in 5" :key="s" name="i-heroicons-star-solid" class="w-5 h-5"
                        :class="s <= Math.round((product as any).avgRating || 0) ? 'text-yellow-400' : 'text-gray-200'" />
                  </div>
                  <span class="text-sm font-medium text-gray-700">
                     {{ ((product as any).avgRating || 0).toFixed(1) }}
                  </span>
                  <a href="#reviews" class="text-sm text-gray-400 hover:text-primary-600 transition-colors">
                     ({{ (product as any).reviewCount }} đánh giá)
                  </a>
               </div>
               <div v-else>Chưa có đánh giá nào</div>
               <ProductVariantSelector :variants="(product as any).variants || []"
                  @update:selected="selectedVariant = $event"
                  @update:variant-image-url="currentVariantImageUrl = $event"
                  @update:selected-color="currentSelectedColor = $event" />
               <div v-if="selectedVariant" class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-700">Số lượng:</span>
                  <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                     <button
                        class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        :disabled="quantity <= 1" @click="quantity--">
                        <UIcon name="i-heroicons-minus" class="w-4 h-4" />
                     </button>
                     <span class="w-10 text-center font-bold">{{ quantity }}</span>
                     <button
                        class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        :disabled="quantity >= (selectedVariant?.stock || 0)" @click="quantity++">
                        <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                     </button>
                  </div>
               </div>
               <div class="flex gap-3 pt-2">
                  <UButton color="primary" size="xl" class="flex-1 font-bold disabled:cursor-not-allowed"
                     :disabled="!selectedVariant" :loading="addingToCart"
                     icon="i-heroicons-shopping-cart" @click="handleAddToCart">
                     {{ !selectedVariant
                        ? 'Chọn phiên bản'
                        : selectedVariant.stock === 0
                           ? 'Hết hàng'
                           : 'Thêm vào giỏ' }}
                  </UButton>
                  <UButton size="xl" color="neutral" variant="outline" :icon="wishlistStore.isInWishlist((product as any).id)
                     ? 'i-heroicons-heart-solid'
                     : 'i-heroicons-heart'" :class="wishlistStore.isInWishlist((product as any).id)
                  ? 'text-red-500 border-red-200'
                  : ''" @click="wishlistStore.toggle((product as any).id)" />
               </div>
               <div class="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  <div v-for="feat in features" :key="feat.text" class="flex items-center gap-2 text-xs text-gray-500">
                     <UIcon :name="feat.icon" class="w-4 h-4 text-green-500 shrink-0" />
                     {{ feat.text }}
                  </div>
               </div>
            </div>
         </div>

         <div class="mt-12">
            <UTabs :items="tabs" class="w-full">
               <template #description>
                  <div class="py-6 max-w-3xl">
                     <p v-if="(product as any).description" class="text-gray-700 leading-relaxed whitespace-pre-line">
                        {{ (product as any).description }}
                     </p>
                     <p v-else class="text-gray-400 text-center py-8">Chưa có mô tả sản phẩm</p>
                  </div>
               </template>

               <template #specs>
                  <div class="py-6">
                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div v-for="variant in (product as any).variants" :key="variant.id"
                           class="p-4 bg-gray-50 rounded-xl">
                           <img v-if="variant.imageUrl" :src="variant.imageUrl"
                              class="w-16 h-16 rounded-lg object-cover mb-2" :alt="variant.color" />
                           <div class="flex flex-wrap gap-1 mb-2">
                              <UBadge v-if="variant.color" color="neutral" size="sm">{{ variant.color }}</UBadge>
                              <UBadge v-if="variant.storage" color="neutral" size="sm">{{ variant.storage }}</UBadge>
                              <UBadge v-if="variant.ram" color="neutral" size="sm">RAM {{ variant.ram }}</UBadge>
                              <UBadge v-if="variant.cpu" color="neutral" size="sm">{{ variant.cpu }}</UBadge>
                           </div>
                           <p class="text-lg font-bold text-primary-600">
                              {{ formatCurrency(variant.salePrice) }}
                           </p>
                           <p v-if="variant.originalPrice > variant.salePrice"
                              class="text-xs text-gray-400 line-through">
                              {{ formatCurrency(variant.originalPrice) }}
                           </p>
                           <p class="text-xs text-gray-500 mt-1">Còn {{ variant.stock }} sản phẩm</p>
                        </div>
                     </div>
                  </div>
               </template>

               <template #reviews>
                  <div id="reviews" class="py-6">
                     <ProductReviews :product-id="(product as any).id" :avg-rating="(product as any).avgRating || 0" />
                  </div>
               </template>
            </UTabs>
         </div>

         <div v-if="related.length > 0" class="mt-12">
            <HomeSectionTitle title="Sản phẩm liên quan" />
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
               <ProductCard v-for="p in related" :key="p.id" :product="p" />
            </div>
         </div>
      </div>

      <div v-else class="max-w-7xl mx-auto px-4 py-20">
         <CommonAppEmpty icon="i-heroicons-cube" title="Sản phẩm không tồn tại"
            description="Sản phẩm có thể đã bị xóa hoặc không còn kinh doanh" action-label="Xem tất cả sản phẩm"
            action-to="/products" />
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Product, ProductVariant } from '~/types'

const route = useRoute()
const slug = route.params.slug as string

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const { formatCurrency } = useFormat()

const { data: product, pending } = await useApiFetch<Product>(
   `/products/slug/${slug}`,
   { key: `product-${slug}` }
)
useHead(() => ({
   title: product.value
      ? `Sản phẩm - ${(product.value as any).name}`
      : 'TechZone',
}))
const selectedVariant = ref<ProductVariant | null>(null)
const currentVariantImageUrl = ref<string | null>(null)
const currentSelectedColor = ref<string | null>(null)  
const quantity = ref(1)
const addingToCart = ref(false)

const { data: relatedData } = await useApiFetch<any>('/products', {
   key: `related-${slug}`,
   query: computed(() => ({
      categoryId: (product.value as any)?.categoryId,
      limit: 4,
   })),
})
const related = computed<Product[]>(() =>
   ((relatedData.value as any)?.products || []).filter((p: any) => p.slug !== slug).slice(0, 4)
)

const tabs = [
   { label: 'Mô tả', slot: 'description', icon: 'i-heroicons-document-text' },
   { label: 'Đánh giá', slot: 'reviews', icon: 'i-heroicons-star' },
]

const features = [
   { icon: 'i-heroicons-shield-check', text: 'Hàng chính hãng 100%' },
   { icon: 'i-heroicons-truck', text: 'Giao hàng toàn quốc' },
   { icon: 'i-heroicons-arrow-path', text: 'Đổi trả 30 ngày' },
   { icon: 'i-heroicons-wrench-screwdriver', text: 'Bảo hành 12 tháng' },
]

watch(selectedVariant, () => { quantity.value = 1 })

async function handleAddToCart() {
   if (!selectedVariant.value) return
   addingToCart.value = true
   try {
      await cartStore.addToCart(
         selectedVariant.value.id,
         quantity.value,
      )
   } finally {
      addingToCart.value = false
   }
}
</script>