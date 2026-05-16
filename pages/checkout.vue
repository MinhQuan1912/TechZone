<template>
   <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

      <div v-if="cartStore.loading" class="text-center py-20">
         <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else-if="checkoutItems.length === 0">
         <CommonAppEmpty icon="i-heroicons-shopping-cart" title="Không có sản phẩm để thanh toán" action-label="Xem giỏ hàng"
            action-to="/cart" />
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-6">
         <div class="lg:col-span-2 space-y-5">
            <UCard>
               <template #header>
                  <div class="flex items-center gap-2">
                     <UIcon name="i-heroicons-map-pin" class="text-primary-600 w-5 h-5" />
                     <h3 class="font-semibold">Thông tin giao hàng</h3>
                  </div>
               </template>
               <div class="space-y-4">
                  <UFormField label="Họ tên người nhận *">
                     <UInput v-model="form.recipientName" class="w-full" />
                  </UFormField>
                  <UFormField label="Số điện thoại *">
                     <UInput v-model="form.recipientPhone" type="tel" class="w-full" />
                  </UFormField>
                  <UFormField label="Địa chỉ giao hàng *">
                     <UTextarea v-model="form.recipientAddress"
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" :rows="3"
                        class="w-full" />
                  </UFormField>
                  <UFormField label="Ghi chú (không bắt buộc)">
                     <UInput v-model="form.note" placeholder="Giao giờ hành chính, gọi trước 30 phút..."
                        class="w-full" />
                  </UFormField>
               </div>
               <template #footer>
                  <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-user-circle"
                     @click="fillProfile">
                     Dùng thông tin tài khoản
                  </UButton>
               </template>
            </UCard>
            <UCard>
               <template #header>
                  <div class="flex items-center gap-2">
                     <UIcon name="i-heroicons-ticket" class="text-primary-600 w-5 h-5" />
                     <h3 class="font-semibold">Mã giảm giá</h3>
                  </div>
               </template>
               <div v-if="appliedCoupon"
                  class="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <div class="flex items-center gap-2">
                     <UIcon name="i-heroicons-check-circle" class="text-green-600 w-5 h-5" />
                     <div>
                        <p class="text-sm font-semibold text-green-700">{{ appliedCoupon.code }}</p>
                        <p class="text-xs text-green-600">Giảm {{ formatCurrency(discountAmount) }}</p>
                     </div>
                  </div>
                  <UButton size="xs" color="error" variant="ghost" icon="i-heroicons-x-mark" @click="removeCoupon" />
               </div>
               <div v-else class="flex gap-2">
                  <UInput v-model="couponInput" placeholder="Nhập mã giảm giá" class="flex-1"
                     :disabled="validatingCoupon" @keyup.enter="validateCoupon" />
                  <UButton color="primary" variant="outline" :loading="validatingCoupon" :disabled="!couponInput.trim()"
                     @click="validateCoupon">
                     Áp dụng
                  </UButton>
               </div>
            </UCard>

            <UCard>
               <template #header>
                  <div class="flex items-center gap-2">
                     <UIcon name="i-heroicons-credit-card" class="text-primary-600 w-5 h-5" />
                     <h3 class="font-semibold">Phương thức thanh toán</h3>
                  </div>
               </template>
               <div class="space-y-3">
                  <label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" :class="form.paymentMethod === 'VNPAY'
                     ? 'border-primary-500 bg-primary-50'
                     : 'border-gray-200 hover:border-gray-300'" @click="form.paymentMethod = 'VNPAY'">
                     <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        :class="form.paymentMethod === 'VNPAY' ? 'border-primary-500' : 'border-gray-300'">
                        <div v-if="form.paymentMethod === 'VNPAY'" class="w-2.5 h-2.5 rounded-full bg-primary-500" />
                     </div>
                     <div class="flex items-center gap-3 flex-1">
                        <div class="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">
                           <IconsBank/>
                        </div>
                        <div>
                           <p class="font-semibold text-gray-900 text-sm">Thanh toán VNPay</p>
                           <p class="text-xs text-gray-500">Thẻ ATM, VISA, MasterCard, QR Code</p>
                        </div>
                     </div>
                     <UBadge color="success" variant="soft" size="sm">Phổ biến</UBadge>
                  </label>

                  <label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" :class="form.paymentMethod === 'COD'
                     ? 'border-primary-500 bg-primary-50'
                     : 'border-gray-200 hover:border-gray-300'" @click="form.paymentMethod = 'COD'">
                     <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        :class="form.paymentMethod === 'COD' ? 'border-primary-500' : 'border-gray-300'">
                        <div v-if="form.paymentMethod === 'COD'" class="w-2.5 h-2.5 rounded-full bg-primary-500" />
                     </div>
                     <div class="flex items-center gap-3 flex-1">
                        <div class="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                           <IconsMoney/>
                        </div>
                        <div>
                           <p class="font-semibold text-gray-900 text-sm">Tiền mặt khi nhận hàng</p>
                           <p class="text-xs text-gray-500">Thanh toán khi shipper giao hàng</p>
                        </div>
                     </div>
                     <UBadge color="neutral" variant="soft" size="sm">COD</UBadge>
                  </label>

                  <UAlert v-if="form.paymentMethod === 'VNPAY'" color="info" variant="soft"
                     icon="i-heroicons-information-circle"
                     description="Bạn sẽ được chuyển sang trang VNPay để hoàn tất thanh toán." />
               </div>
            </UCard>
         </div>

         <div class="lg:col-span-1">
            <UCard class="sticky top-20">
               <template #header>
                  <h3 class="font-semibold">Đơn hàng ({{ checkoutItems.length }})</h3>
               </template>
               <div class="space-y-3 max-h-60 overflow-y-auto">
                  <div v-for="item in checkoutItems" :key="item.id" class="flex gap-3">
                     <img v-if="item.product.images?.[0]?.url" :src="item.product.images[0].url"
                        class="w-12 h-12 rounded-lg object-cover shrink-0" />
                     <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-900 line-clamp-1">{{ item.product.name }}</p>
                        <p class="text-xs text-gray-400">
                           {{ [item.variant.color, item.variant.storage].filter(Boolean).join('/') }} × {{ item.quantity
                           }}
                        </p>
                     </div>
                     <span class="text-xs font-bold text-gray-900 shrink-0">
                        {{ formatCurrency(item.variant.salePrice * item.quantity) }}
                     </span>
                  </div>
               </div>

               <USeparator class="my-3" />
               <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                     <span class="text-gray-500">Tạm tính:</span>
                     <span>{{ formatCurrency(totalAmount) }}</span>
                  </div>
                  <div v-if="discountAmount > 0" class="flex justify-between text-green-600">
                     <span>Giảm giá:</span>
                     <span>-{{ formatCurrency(discountAmount) }}</span>
                  </div>
                  <div class="flex justify-between">
                     <span class="text-gray-500">Phí vận chuyển:</span>
                     <span class="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <USeparator />
                  <div class="flex justify-between font-bold text-base">
                     <span>Tổng cộng:</span>
                     <span class="text-primary-600 text-xl">{{ formatCurrency(finalAmount) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                     <span class="text-xs text-gray-400">Thanh toán:</span>
                     <UBadge :color="form.paymentMethod === 'VNPAY' ? 'primary' : 'success'" variant="soft" size="sm">
                        {{ form.paymentMethod === 'VNPAY' ? 'VNPay' : 'COD' }}
                     </UBadge>
                  </div>
               </div>

               <template #footer>
                  <UButton color="primary" size="lg" class="w-full font-bold" :loading="placing" :disabled="!canOrder"
                     @click="placeOrder">
                     <UIcon name="i-heroicons-check-circle" class="mr-1.5" />
                     {{ form.paymentMethod === 'VNPAY' ? 'Thanh toán & Đặt hàng' : 'Đặt hàng' }}
                  </UButton>
               </template>
            </UCard>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Thanh toán' })

const authStore = useAuthStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const { api } = useApi()
const toast = useToast()
const { formatCurrency } = useFormat()

const selectedItemIds = ref<number[]>([])

const checkoutItems = computed(() =>
   cartStore.items.filter(i => selectedItemIds.value.includes(i.id))
)

const form = reactive({
   recipientName: '',
   recipientPhone: '',
   recipientAddress: '',
   note: '',
   paymentMethod: 'VNPAY' as 'VNPAY' | 'COD',
})

const couponInput = ref('')
const appliedCoupon = ref<any>(null)
const discountAmount = ref(0)
const validatingCoupon = ref(false)
const placing = ref(false)

const totalAmount = computed(() =>
   checkoutItems.value.reduce((s, i) => s + i.variant.salePrice * i.quantity, 0)
)
const finalAmount = computed(() => Math.max(0, totalAmount.value - discountAmount.value))

const canOrder = computed(() =>
   form.recipientName.trim() &&
   form.recipientPhone.trim() &&
   form.recipientAddress.trim() &&
   checkoutItems.value.length > 0
)

function fillProfile() {
   form.recipientName = authStore.user?.name || ''
   form.recipientPhone = authStore.user?.phone || ''
   form.recipientAddress = authStore.user?.address || ''
}

async function validateCoupon() {
   if (!couponInput.value.trim()) return
   validatingCoupon.value = true
   try {
      const res = await api<any>('/coupons/validate', {
         method: 'POST',
         body: { code: couponInput.value.toUpperCase(), amount: totalAmount.value },
      })
      appliedCoupon.value = res.coupon
      discountAmount.value = res.discount
      toast.add({
         title: 'Áp dụng thành công',
         description: `Giảm ${formatCurrency(res.discount)}`,
         color: 'success',
      })
   } catch {
   } finally {
      validatingCoupon.value = false
   }
}

function removeCoupon() {
   appliedCoupon.value = null
   discountAmount.value = 0
   couponInput.value = ''
}

async function placeOrder() {
   if (!canOrder.value) return
   placing.value = true
   try {
      const result = await orderStore.createOrder({
         items: checkoutItems.value.map(i => ({ cartItemId: i.id })),
         paymentMethod: form.paymentMethod,
         couponCode: appliedCoupon.value?.code,
         recipientName: form.recipientName,
         recipientPhone: form.recipientPhone,
         recipientAddress: form.recipientAddress,
         note: form.note || undefined,
      })
      await cartStore.fetchCart()
      if (form.paymentMethod === 'VNPAY' && result.paymentUrl) {
         toast.add({ title: 'Đang chuyển đến VNPay...', color: 'info' })
         if (import.meta.client) window.location.href = result.paymentUrl
      } else {
         toast.add({ title: 'Đặt hàng thành công!', color: 'success' })
         await navigateTo(`/orders/${result.order.id}`)
      }
   } catch (e: any) {
      toast.add({
         title: 'Đặt hàng thất bại',
         description: e?.data?.message || 'Vui lòng thử lại',
         color: 'error',
      })
   } finally {
      placing.value = false
   }
}

onMounted(async () => {
   await cartStore.fetchCart()
   if (import.meta.client) {
      const saved = sessionStorage.getItem('checkout_item_ids')
      selectedItemIds.value = saved
         ? JSON.parse(saved)
         : cartStore.items.map(i => i.id)
   }
   fillProfile()
})
</script>