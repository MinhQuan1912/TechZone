<template>
   <div class="container mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>
      <div v-if="store.loading && !store.items.length" class="space-y-4">
         <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div class="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
               <div class="flex items-center gap-2">
                  <div class="h-3 w-28 bg-gray-200 rounded-full" />
                  <div class="h-5 w-20 bg-gray-200 rounded-full" />
                  <div class="h-5 w-14 bg-gray-200 rounded-full" />
               </div>
               <div class="h-3 w-20 bg-gray-200 rounded-full" />
            </div>
            <div class="px-5 py-4">
               <div class="flex items-center gap-3">
                  <div v-for="j in 2" :key="j" class="flex items-center gap-2">
                     <div class="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
                     <div class="space-y-1.5">
                        <div class="h-3 w-20 bg-gray-200 rounded-full" />
                        <div class="h-2.5 w-8 bg-gray-200 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="flex items-center justify-between px-5 py-4 border-t border-gray-100">
               <div class="h-6 w-32 bg-gray-200 rounded-full" />
               <div class="h-8 w-20 bg-gray-200 rounded-lg" />
            </div>
         </div>
      </div>
      <CommonAppEmpty v-else-if="store.items.length === 0" icon="i-heroicons-shopping-bag" title="Chưa có đơn hàng"
         description="Mua sắm ngay để có đơn hàng đầu tiên" action-label="Mua sắm ngay" action-to="/products" />
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
               <div class="flex items-center gap-4 flex-wrap">
                  <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="flex items-center gap-2">
                     <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <img v-if="item.product?.images?.[0]" :src="item.product.images[0].url" alt="Product Image"
                           class="w-full h-full object-cover rounded-lg" />
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
                  <UButton v-if="['PENDING', 'CONFIRMED'].includes(order.status)" size="sm" color="error"
                     variant="outline" :loading="cancellingId === order.id" @click="openCancelModal(order.id)">
                     Hủy
                  </UButton>
               </div>
            </div>
         </div>
      </div>
      <CommonAppPagination :current-page="store.page" :total-pages="store.totalPages" @change="store.changePage" />
   </div>
   <UModal v-model:open="showCancelModal">
      <template #content>
         <div class="p-6 space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Xác nhận hủy đơn hàng</h3>
            <p class="text-sm text-gray-500">Bạn có chắc muốn hủy đơn hàng này không?</p>
            <UFormField label="Lý do hủy">
               <UTextarea v-model="cancelReason" placeholder="Nhập lý do hủy đơn..." :rows="3" class="w-full" />
            </UFormField>
            <div class="flex gap-3 justify-end">
               <UButton color="neutral" variant="outline" @click="showCancelModal = false">
                  Không hủy
               </UButton>
               <UButton color="error" :loading="cancellingId !== null" @click="confirmCancel">
                  Xác nhận hủy
               </UButton>
            </div>
         </div>
      </template>
   </UModal>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Đơn hàng của tôi' })

const store = useOrderStore()
const { formatCurrency, formatDate } = useFormat()
const cancellingId = ref<number | null>(null)
const showCancelModal = ref(false)
const cancelReason = ref('')
const pendingCancelId = ref<number | null>(null)

const statusColors: Record<OrderStatus, string> = {
   PENDING: 'warning', CONFIRMED: 'info',
   SHIPPING: 'primary', DELIVERED: 'success',
   COMPLETED: 'success', CANCELLED: 'error',
}
const statusLabels: Record<OrderStatus, string> = {
   PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
   SHIPPING: 'Đang giao hàng', DELIVERED: 'Đã giao hàng',
   COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
}

function openCancelModal(id: number) {
   pendingCancelId.value = id
   cancelReason.value = ''
   showCancelModal.value = true
}

async function confirmCancel() {
   if (!pendingCancelId.value) return
   cancellingId.value = pendingCancelId.value
   try {
      await store.cancelOrder(pendingCancelId.value, cancelReason.value || undefined)
      showCancelModal.value = false
      cancelReason.value = ''
      pendingCancelId.value = null
   } finally {
      cancellingId.value = null
   }
}
onMounted(() => store.fetchMyOrders())
</script>