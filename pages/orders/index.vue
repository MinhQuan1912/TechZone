<template>
   <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>
      <div v-if="store.loading" class="space-y-4">
         <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-2xl h-36 border" />
      </div>
      <CommonAppEmpty v-else-if="store.items.length === 0" icon="i-heroicons-shopping-bag" title="Chưa có đơn hàng"
         description="Mua sắm ngay để có đơn hàng đầu tiên" action-label="Mua sắm ngay" action-to="/products" />
      <div v-else class="space-y-4">
         <div v-for="order in store.items" :key="order.id"
            class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
            <div
               class="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100 flex-wrap gap-2">
               <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-mono text-xs text-gray-400">{{ order.code }}</span>
                  <UBadge :color="(statusColors[order.status] as any)" variant="soft" size="sm">
                     {{ statusLabels[order.status] }}
                  </UBadge>
                  <UBadge v-if="order.isPaid" color="success" variant="soft" size="sm">
                     <UIcon name="i-heroicons-check" class="w-3 h-3 mr-0.5" />
                     Đã TT
                  </UBadge>
                  <UBadge :color="order.paymentMethod === 'VNPAY' ? 'primary' : 'neutral'" variant="soft" size="sm">
                     {{ order.paymentMethod }}
                  </UBadge>
               </div>
               <span class="text-xs text-gray-400">{{ formatDate(order.createdAt) }}</span>
            </div>

            <div class="px-5 py-4">
               <div class="flex items-center gap-3 flex-wrap">
                  <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="flex items-center gap-2">
                     <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                       <img v-if="item.product?.images?.[0]" :src="item.product.images[0].url" alt="Product Image" class="w-full h-full object-cover rounded-lg" />
                     </div>
                     <div>
                        <p class="text-xs font-medium text-gray-900 max-w-28 truncate">{{ item.product?.name }}</p>
                        <p class="text-xs text-gray-400">x{{ item.quantity }}</p>
                     </div>
                  </div>
                  <span v-if="order.items.length > 3" class="text-xs text-gray-400 italic">
                     +{{ order.items.length - 3 }} sản phẩm khác
                  </span>
               </div>
            </div>

            <div class="flex items-center justify-between px-5 py-4 border-t border-gray-100 flex-wrap gap-3">
               <div>
                  <span class="text-sm text-gray-500">Tổng: </span>
                  <span class="font-bold text-primary-600 text-lg">
                     {{ formatCurrency(order.finalAmount) }}
                  </span>
                  <span v-if="order.discountAmount > 0" class="text-xs text-green-600 ml-2">
                     (Giảm {{ formatCurrency(order.discountAmount) }})
                  </span>
               </div>
               <div class="flex gap-2">
                  <UButton size="sm" color="neutral" variant="outline" :to="`/orders/${order.id}`">
                     Chi tiết
                  </UButton>
                  <UButton v-if="order.paymentMethod === 'COD' && ['PENDING', 'CONFIRMED'].includes(order.status)"
                     size="sm" color="error" variant="outline" :loading="cancellingId === order.id"
                     @click="handleCancel(order.id)">
                     Hủy
                  </UButton>
               </div>
            </div>
         </div>
         <CommonAppPagination :current-page="store.page" :total-pages="store.totalPages" @change="store.changePage" />
      </div>
   </div>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Đơn hàng của tôi' })

const store = useOrderStore()
const { formatCurrency, formatDate } = useFormat()
const cancellingId = ref<number | null>(null)

const statusColors: Record<OrderStatus, string> = {
   PENDING: 'warning', CONFIRMED: 'info',
   SHIPPING: 'primary', DELIVERED: 'success', CANCELLED: 'error',
}
const statusLabels: Record<OrderStatus, string> = {
   PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
   SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
}

async function handleCancel(id: number) {
   cancellingId.value = id
   try {
      await store.cancelOrder(id)
   } finally {
      cancellingId.value = null
   }
}

onMounted(() => store.fetchMyOrders())
</script>