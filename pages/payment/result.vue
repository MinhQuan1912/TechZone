<template>
   <div class="max-w-md mx-auto px-4 py-16 text-center">
      <div v-if="loading" class="text-center py-8">
         <div
            class="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
         <p class="text-gray-500">Đang xử lý kết quả thanh toán...</p>
      </div>

      <template v-else>
         <div v-if="isSuccess">
            <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
               <UIcon name="i-heroicons-check-circle-solid" class="w-14 h-14 text-green-500" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
            <p class="text-gray-500 mb-2">Đơn hàng của bạn đã được xác nhận</p>
            <p v-if="orderCode" class="font-mono text-sm text-gray-400 mb-8">{{ orderCode }}</p>
         </div>

         <div v-else>
            <div class="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
               <UIcon name="i-heroicons-x-circle-solid" class="w-14 h-14 text-red-500" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
            <p class="text-gray-500 mb-8">Đơn hàng đã bị hủy. Vui lòng thử lại.</p>
         </div>

         <div class="flex gap-3 justify-center">
            <UButton v-if="isSuccess && orderId" :to="`/orders/${orderId}`" color="primary"
               icon="i-heroicons-shopping-bag">
               Xem đơn hàng
            </UButton>
            <UButton v-if="!isSuccess" to="/cart" color="primary" icon="i-heroicons-arrow-path">
               Thử lại
            </UButton>
            <UButton to="/" color="neutral" variant="outline">
               Về trang chủ
            </UButton>
         </div>
      </template>
   </div>
</template>

<script setup lang="ts">
useHead({ title: 'Kết quả thanh toán' })

const route = useRoute()
const { api } = useApi()

const loading = ref(true)
const isSuccess = ref(false)
const orderId = ref<number | null>(null)
const orderCode = ref('')

onMounted(async () => {
   const responseCode = route.query.vnp_ResponseCode as string
   const txnRef = route.query.vnp_TxnRef as string

   isSuccess.value = responseCode === '00'
   orderCode.value = txnRef || ''

   try {
      const res = await api<any>('/orders/vnpay/callback', {
         query: route.query as Record<string, string>,
      })
      orderId.value = res.orderId || null
   } catch { }
   loading.value = false
})
</script>