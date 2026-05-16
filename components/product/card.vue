<template>
   <div
      class="product-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md group">
      <div class="relative overflow-hidden aspect-square">
         <NuxtLink :to="`/products/${product.slug}`">
            <img v-if="mainImageUrl" :src="mainImageUrl" :alt="product.name"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               loading="lazy" />
            <div v-else
               class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
               <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-300" />
            </div>
         </NuxtLink>

         <div v-if="maxDiscountPercent > 0"
            class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{{ maxDiscountPercent }}%
         </div>

         <button
            class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95"
            @click.prevent="wishlistStore.toggle(product.id)">
            <UIcon :name="wishlistStore.isInWishlist(product.id)
               ? 'i-heroicons-heart-solid'
               : 'i-heroicons-heart'" class="w-4 h-4 transition-colors"
               :class="wishlistStore.isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'" />
         </button>
      </div>

      <div class="p-4">
         <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
               {{ product.brand }}
            </span>
            <span class="text-xs text-gray-400 truncate">{{ product.category?.name }}</span>
         </div>

         <NuxtLink :to="`/products/${product.slug}`">
            <h3
               class="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors leading-snug min-h-[55px]">
               {{ product.name }}
            </h3>
         </NuxtLink>

         <div v-if="(product.reviewCount || 0) > 0" class="flex items-center gap-1 mt-1.5">
            <div class="flex">
               <UIcon v-for="s in 5" :key="s" name="i-heroicons-star-solid" class="w-3.5 h-3.5"
                  :class="s <= Math.round(product.avgRating || 0) ? 'text-yellow-400' : 'text-gray-200'" />
            </div>
            <span class="text-xs text-gray-500">({{ product.reviewCount }})</span>
         </div>
         <div v-else class="text-xs mt-1.5">Sản phẩm chưa có đánh giá nào</div>

         <div class="mt-2">
            <div class="flex items-baseline gap-2 flex-wrap">
               <span class="text-lg font-bold text-gray-900">
                  {{ formatCurrency(product.minSalePrice || 0) }}
               </span>
            </div>
            <div v-if="minOriginalPrice > (product.minSalePrice || 0)">
               <span class="text-xs text-gray-400 line-through">
                  {{ formatCurrency(minOriginalPrice) }}
               </span>
            </div>
         </div>

         <div class="flex justify-between items-center mt-2">
            <div class="flex justify-between items-center gap-1.5">
               <div class="w-2 h-2 rounded-full" :class="totalStock > 0 ? 'bg-green-400' : 'bg-red-400'" />
               <span class="text-md text-gray-500">
                  {{ totalStock > 0 ? `Còn hàng` : 'Hết hàng' }}
               </span>
            </div>
            <div class="text-sm">Đã bán {{product.variants.reduce((total, variant) => total + variant.sold, 0)}}</div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{ product: Product }>()

const wishlistStore = useWishlistStore()
const { formatCurrency, discountPercent } = useFormat()
const mainImageUrl = computed(() =>
   props.product.images?.find(i => i.isMain)?.url ||
   props.product.images?.[0]?.url || null
)

const totalStock = computed(() =>
   (props.product.variants || []).reduce((s, v) => s + v.stock, 0)
)

const minOriginalPrice = computed(() =>
   Math.min(...(props.product.variants || []).map(v => v.originalPrice).filter(Boolean))
)

const maxDiscountPercent = computed(() => {
   const variants = props.product.variants || []
   if (!variants.length) return 0
   return Math.max(...variants.map(v => discountPercent(v.originalPrice, v.salePrice)))
})


</script>