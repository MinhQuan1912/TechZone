<template>
   <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
         Giỏ hàng
         <UBadge v-if="cartStore.totalItems > 0" color="error" class="ml-2">
            {{ cartStore.totalItems }}
         </UBadge>
      </h1>

      <div v-if="!cartStore.isFetched && cartStore.loading" class="text-center py-20">
         <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <CommonAppEmpty v-else-if="cartStore.isFetched && cartStore.items.length === 0" icon="i-heroicons-shopping-cart"
         title="Giỏ hàng trống" description="Thêm sản phẩm vào giỏ để tiếp tục mua sắm" action-label="Tiếp tục mua sắm"
         action-to="/products" />

      <div v-else class="grid lg:grid-cols-3 gap-6">
         <div class="lg:col-span-2 space-y-3">

            <UAlert v-if="inactiveItems.length > 0" color="warning" variant="soft"
               icon="i-heroicons-exclamation-triangle" :title="`${inactiveItems.length} sản phẩm tạm ngừng bán`"
               description="Các sản phẩm này đã được bỏ chọn và không thể thanh toán. Bạn có thể xóa chúng khỏi giỏ.">
               <template #actions>
                  <UButton size="xs" color="warning" variant="outline" @click="removeInactiveItems">
                     Xóa các sản phẩm này
                  </UButton>
               </template>
            </UAlert>

            <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
               <label class="flex items-center gap-3 cursor-pointer">
                  <UCheckbox v-model="selectAll" @update:model-value="toggleSelectAll" />
                  <span class="text-sm font-medium text-gray-700">
                     Chọn tất cả ({{ activeItems.length }} sản phẩm)
                  </span>
               </label>
               <UButton v-if="selectedIds.length > 0" size="xs" color="error" variant="ghost" icon="i-heroicons-trash"
                  @click="removeSelected">
                  Xóa ({{ selectedIds.length }})
               </UButton>
            </div>

            <div v-for="item in cartStore.items" :key="item.id"
               class="flex gap-3 sm:gap-4 p-4 bg-white rounded-2xl border transition-colors" :class="isInactive(item)
                  ? 'border-orange-200 bg-orange-50/50 opacity-75'
                  : 'border-gray-100 hover:border-gray-200'">
               <div class="flex items-start pt-1">
                  <UCheckbox :model-value="selectedIds.includes(item.id)" :disabled="isInactive(item)"
                     @update:model-value="(v: boolean | 'indeterminate') => toggleItem(item.id, v === true)" />
               </div>

               <NuxtLink :to="`/products/${item.product.slug}`" class="shrink-0">
                  <div class="relative">
                     <img v-if="item.variant?.imageUrl || item.product.images?.[0]?.url"
                        :src="item.variant?.imageUrl || item.product?.images[0]?.url" :alt="item.product.name"
                        class="w-20 h-20 rounded-xl object-cover" />
                     <div v-else class="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                        <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-300" />
                     </div>
                     <div v-if="isInactive(item)"
                        class="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                        <span class="text-white text-xs font-bold text-center leading-tight px-1">Tạm ngừng</span>
                     </div>
                  </div>
               </NuxtLink>

               <div class="flex-1 min-w-0">
                  <NuxtLink :to="`/products/${item.product.slug}`"
                     class="font-semibold text-gray-900 text-sm leading-snug hover:text-primary-600 line-clamp-2 transition-colors">
                     {{ item.product.name }}
                  </NuxtLink>
                  <p class="text-xs text-gray-400 mt-1">
                     {{ [item.variant?.color, item.variant?.storage, item.variant?.ram, item.variant?.version].filter(Boolean).join(' / ') }}
                  </p>

                  <UBadge v-if="isInactive(item)" color="warning" variant="soft" size="xs" class="mt-1">
                     Tạm ngừng bán
                  </UBadge>
                  <p v-else class="text-sm font-bold text-primary-600 mt-1.5">
                     {{ formatCurrency(item.variant.salePrice) }}
                  </p>

                  <div v-if="!isInactive(item)" class="flex items-center gap-2 mt-2">
                     <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                           class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                           :disabled="item.quantity <= 1" @click="handleUpdateQuantity(item, item.quantity - 1)">
                           <UIcon name="i-heroicons-minus" class="w-3.5 h-3.5" />
                        </button>
                        <span class="w-8 text-center text-sm font-bold">{{ item.quantity }}</span>
                        <button
                           class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                           :disabled="item.variant?.stock !== undefined && item.quantity >= item.variant.stock"
                           @click="handleUpdateQuantity(item, item.quantity + 1)">
                           <UIcon name="i-heroicons-plus" class="w-3.5 h-3.5" />
                        </button>
                     </div>
                     <span v-if="item.variant?.stock !== undefined && item.quantity >= item.variant.stock"
                        class="text-xs text-orange-500 font-medium">
                        Tối đa
                     </span>
                  </div>
               </div>

               <div class="flex flex-col items-end justify-between">
                  <button class="text-gray-300 hover:text-red-500 transition-colors" @click="removeSingleItem(item.id)">
                     <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                  </button>
                  <span v-if="!isInactive(item)" class="font-bold text-gray-900 text-sm">
                     {{ formatCurrency(item.variant.salePrice * item.quantity) }}
                  </span>
               </div>
            </div>
         </div>

         <div class="lg:col-span-1">
            <UCard class="sticky top-20">
               <template #header>
                  <h3 class="font-semibold text-gray-900">Tóm tắt</h3>
               </template>
               <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                     <span class="text-gray-500">Đã chọn ({{ selectedIds.length }} sản phẩm):</span>
                  </div>
                  <div class="flex justify-between text-sm">
                     <span class="text-gray-500">Tạm tính:</span>
                     <span class="font-medium">{{ formatCurrency(selectedTotal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                     <span class="text-gray-500">Phí vận chuyển:</span>
                     <span class="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <USeparator />
                  <div class="flex justify-between font-bold text-base">
                     <span>Tổng cộng:</span>
                     <span class="text-primary-600 text-xl">{{ formatCurrency(selectedTotal) }}</span>
                  </div>
               </div>
               <template #footer>
                  <UButton color="primary" size="lg" class="w-full font-bold" :disabled="selectedIds.length === 0"
                     to="/checkout" @click="saveCheckoutItems">
                     Thanh toán
                  </UButton>
               </template>
            </UCard>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Giỏ hàng' })

const cartStore = useCartStore()
const toast = useToast()
const { formatCurrency } = useFormat()
const selectedIds = ref<number[]>([])
const selectAll = ref(false)

function isInactive(item: any) {
   return item.variant?.isActive === false
}

const activeItems = computed(() => cartStore.items.filter(i => !isInactive(i)))
const inactiveItems = computed(() => cartStore.items.filter(i => isInactive(i)))

const selectedTotal = computed(() =>
   cartStore.items
      .filter(i => selectedIds.value.includes(i.id))
      .reduce((s, i) => s + i.variant.salePrice * i.quantity, 0)
)

function toggleSelectAll(val: boolean | 'indeterminate') {
   const checked = val === true
   selectedIds.value = checked ? activeItems.value.map(i => i.id) : []
}

function toggleItem(id: number, val: boolean) {
   if (val) selectedIds.value.push(id)
   else selectedIds.value = selectedIds.value.filter(i => i !== id)
   selectAll.value = selectedIds.value.length === activeItems.value.length
}

async function removeSelected() {
   await cartStore.removeItems(selectedIds.value)
   selectedIds.value = []
   selectAll.value = false
}

async function removeInactiveItems() {
   const ids = inactiveItems.value.map(i => i.id)
   await cartStore.removeItems(ids)
}

function saveCheckoutItems() {
   if (import.meta.client) {
      sessionStorage.setItem('checkout_item_ids', JSON.stringify(selectedIds.value))
   }
}

async function removeSingleItem(id: number) {
   await cartStore.removeItems([id])
   selectedIds.value = selectedIds.value.filter(i => i !== id)
   selectAll.value = selectedIds.value.length === activeItems.value.length
}

async function handleUpdateQuantity(item: any, newQty: number) {
   if (newQty < 1) return
   if (item.variant?.stock !== undefined && newQty > item.variant.stock) {
      toast.add({
         title: `Chỉ còn ${item.variant.stock} sản phẩm trong kho`,
         color: 'warning',
      })
      if (item.quantity !== item.variant.stock) {
         await cartStore.updateQuantity(item.id, item.variant.stock)
      }
      return
   }

   await cartStore.updateQuantity(item.id, newQty)
}

onMounted(async () => {
   if (!cartStore.isFetched) await cartStore.fetchCart()
   selectedIds.value = activeItems.value.map(i => i.id)
   selectAll.value = activeItems.value.length > 0
})
</script>