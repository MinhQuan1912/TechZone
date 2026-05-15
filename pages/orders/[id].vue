<template>
   <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center gap-4 mb-6">
         <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-left" to="/orders" />
         <h1 class="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
      </div>

      <div v-if="store.loading" class="text-center py-20">
         <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
      <div v-else-if="store.current" class="space-y-5">
         <UCard>
            <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
               <div>
                  <p class="font-mono text-xs text-gray-400 mb-1">{{ store.current.code }}</p>
                  <UBadge :color="(statusColors[store.current.status] as any)" size="lg">
                     {{ statusLabels[store.current.status] }}
                  </UBadge>
               </div>
               <div class="text-right text-sm">
                  <p class="text-gray-400">Ngày đặt</p>
                  <p class="font-medium">{{ formatDate(store.current.createdAt) }}</p>
               </div>
            </div>

            <div v-if="store.current.status !== 'CANCELLED'" class="relative pt-2">
               <div class="flex justify-between">
                  <div v-for="(step, idx) in orderSteps" :key="step.status"
                     class="flex-1 flex flex-col items-center relative">
                     <div v-if="idx > 0" class="absolute top-4 right-1/2 w-full h-0.5"
                        :class="stepReached(step.status) ? 'bg-primary-500' : 'bg-gray-200'" />
                     <div class="w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all" :class="store.current?.status === step.status
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : stepReached(step.status)
                           ? 'bg-primary-500 text-white'
                           : 'bg-gray-100 text-gray-400'">
                        <UIcon :name="step.icon" class="w-4 h-4" />
                     </div>
                     <p class="text-xs mt-2 text-center text-gray-500 leading-tight max-w-16">
                        {{ step.label }}
                     </p>
                  </div>
               </div>
            </div>
         </UCard>

         <UCard>
            <template #header>
               <h3 class="font-semibold">Sản phẩm</h3>
            </template>
            <div class="space-y-4">
               <div v-for="item in store.current.items" :key="item.id"
                  class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                  <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <img v-if="item.variant?.imageUrl" :src="item.variant.imageUrl" alt="Product Image" class="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div class="flex-1 min-w-0">
                     <p class="font-medium text-sm text-gray-900">{{ item.product?.name }}</p>
                     <p class="text-xs text-gray-400 mt-0.5">
                        {{ [item.variant?.color, item.variant?.storage, item.variant?.ram].filter(Boolean).join(' / ')
                        }}
                     </p>
                     <p class="text-xs text-gray-400">x{{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                     <p class="font-bold text-gray-900 text-sm">
                        {{ formatCurrency(item.price * item.quantity) }}
                     </p>
                     <p class="text-xs text-gray-400">{{ formatCurrency(item.price) }}/cái</p>
                  </div>
               </div>
            </div>
         </UCard>
         <div class="grid md:grid-cols-2 gap-4">
            <UCard>
               <template #header>
                  <h3 class="font-semibold">Thông tin giao hàng</h3>
               </template>
               <div class="space-y-2 text-sm">
                  <div class="flex gap-2">
                     <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                     <span class="font-medium">{{ store.current.recipientName }}</span>
                  </div>
                  <div class="flex gap-2">
                     <UIcon name="i-heroicons-phone" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                     <span>{{ store.current.recipientPhone }}</span>
                  </div>
                  <div class="flex gap-2">
                     <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                     <span class="text-gray-600">{{ store.current.recipientAddress }}</span>
                  </div>
                  <div v-if="store.current.note" class="flex gap-2">
                     <UIcon name="i-heroicons-chat-bubble-left" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                     <span class="text-gray-500 italic">{{ store.current.note }}</span>
                  </div>
               </div>
            </UCard>

            <UCard>
               <template #header>
                  <h3 class="font-semibold">Thanh toán</h3>
               </template>
               <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                     <span class="text-gray-500">Phương thức:</span>
                     <UBadge :color="store.current.paymentMethod === 'VNPAY' ? 'primary' : 'neutral'" variant="soft">
                        {{ store.current.paymentMethod }}
                     </UBadge>
                  </div>
                  <div class="flex justify-between">
                     <span class="text-gray-500">Tạm tính:</span>
                     <span>{{ formatCurrency(store.current.totalAmount) }}</span>
                  </div>
                  <div v-if="store.current.discountAmount > 0" class="flex justify-between text-green-600">
                     <span>Giảm giá <span v-if="store.current.coupon">({{ store.current.coupon.code }})</span>:</span>
                     <span>-{{ formatCurrency(store.current.discountAmount) }}</span>
                  </div>
                  <USeparator />
                  <div class="flex justify-between font-bold text-base">
                     <span>Tổng cộng:</span>
                     <span class="text-primary-600">{{ formatCurrency(store.current.finalAmount) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                     <span class="text-gray-500">Trạng thái TT:</span>
                     <UBadge :color="store.current.isPaid ? 'success' : 'warning'" variant="soft">
                        {{ store.current.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán' }}
                     </UBadge>
                  </div>
               </div>
            </UCard>
         </div>
         <div class="flex gap-3 justify-end">
            <UButton
               v-if="store.current.paymentMethod === 'COD' && ['PENDING', 'CONFIRMED'].includes(store.current.status)"
               color="error" variant="outline" icon="i-heroicons-x-circle" :loading="cancelling" @click="handleCancel">
               Hủy đơn
            </UButton>
            <UButton to="/products" color="primary" variant="soft">
               Tiếp tục mua sắm
            </UButton>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const store = useOrderStore()
const { formatCurrency, formatDate } = useFormat()
const orderId = Number(route.params.id)
const cancelling = ref(false)

useHead(() => ({
   title: store.current ? `Đơn ${store.current.code}` : 'Chi tiết đơn hàng',
}))

const statusColors: Record<OrderStatus, string> = {
   PENDING: 'warning', CONFIRMED: 'info',
   SHIPPING: 'primary', DELIVERED: 'success', CANCELLED: 'error',
}
const statusLabels: Record<OrderStatus, string> = {
   PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
   SHIPPING: 'Đang giao hàng', DELIVERED: 'Đã giao hàng', CANCELLED: 'Đã hủy',
}

const orderSteps = [
   { status: 'PENDING', label: 'Đã đặt', icon: 'i-heroicons-clipboard-document-check' },
   { status: 'CONFIRMED', label: 'Đã xác nhận', icon: 'i-heroicons-check-badge' },
   { status: 'SHIPPING', label: 'Đang giao', icon: 'i-heroicons-truck' },
   { status: 'DELIVERED', label: 'Đã nhận', icon: 'i-heroicons-home' },
]

const statusOrder = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED']

function stepReached(status: string) {
   const current = store.current?.status || ''
   return statusOrder.indexOf(status) <= statusOrder.indexOf(current)
}

async function handleCancel() {
   cancelling.value = true
   try {
      await store.cancelOrder(orderId)
   } finally {
      cancelling.value = false
   }
}

onMounted(() => store.fetchOne(orderId))
</script>