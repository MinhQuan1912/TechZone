<template>
   <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
         <div>
            <h3 class="text-lg font-semibold text-gray-900">Đánh giá sản phẩm</h3>
            <p class="text-sm text-gray-500 mt-0.5">{{ total }} đánh giá</p>
         </div>
         <div v-if="avgRating > 0" class="text-center">
            <div class="text-4xl font-bold text-gray-900">{{ avgRating.toFixed(1) }}</div>
            <div class="flex justify-center mt-1">
               <UIcon v-for="s in 5" :key="s" name="i-heroicons-star-solid" class="w-5 h-5"
                  :class="s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'" />
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ total }} đánh giá</p>
         </div>
      </div>
      <div v-if="authStore.isAuthenticated">
         <div v-if="canReviewStatus === null" class="text-center py-4">
            <div class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
         </div>
         <UAlert v-else-if="!canReviewStatus.hasPurchased" color="info" variant="soft"
            icon="i-heroicons-information-circle" title="Chỉ khách đã mua mới đánh giá được"
            description="Mua sản phẩm và nhận hàng thành công để để lại đánh giá." />
         <UAlert v-else-if="canReviewStatus.hasReviewed" color="success" variant="soft" icon="i-heroicons-check-circle"
            title="Bạn đã đánh giá sản phẩm này" description="Cảm ơn bạn đã chia sẻ trải nghiệm!" />
         <UCard v-else-if="canReviewStatus.canReview" class="border-2 border-primary-100">
            <template #header>
               <h4 class="font-semibold text-gray-900">Viết đánh giá của bạn</h4>
            </template>
            <div class="space-y-4">
               <div>
                  <p class="text-sm text-gray-600 mb-2">Đánh giá của bạn:</p>
                  <div class="flex items-center gap-1">
                     <button v-for="s in 5" :key="s" type="button" @click="reviewForm.rating = s"
                        @mouseenter="hoverRating = s" @mouseleave="hoverRating = 0">
                        <UIcon name="i-heroicons-star-solid" class="w-8 h-8 transition-colors"
                           :class="s <= (hoverRating || reviewForm.rating) ? 'text-yellow-400' : 'text-gray-200'" />
                     </button>
                     <span v-if="reviewForm.rating" class="ml-2 text-sm text-gray-600 font-medium">
                        {{ ratingLabels[reviewForm.rating] }}
                     </span>
                  </div>
               </div>
               <UFormField label="Nội dung đánh giá *">
                  <UTextarea v-model="reviewForm.content" :rows="4"
                     placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này..." class="w-full" />
               </UFormField>
            </div>
            <template #footer>
               <div class="flex justify-end">
                  <UButton color="primary" :loading="submitting"
                     :disabled="!reviewForm.rating || !reviewForm.content.trim()" @click="submitReview">
                     Gửi đánh giá
                  </UButton>
               </div>
            </template>
         </UCard>
      </div>
      <div v-else class="p-4 bg-gray-50 rounded-xl text-center">
         <p class="text-sm text-gray-600">
            <NuxtLink :to="`/sign-in?redirect=/products/${$route.params.slug}`"
               class="text-primary-600 font-medium hover:underline">
               Đăng nhập
            </NuxtLink>
            để viết đánh giá (chỉ khách đã mua hàng)
         </p>
      </div>

      <div v-if="loading && reviews.length === 0" class="space-y-4">
         <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3 p-4 bg-gray-50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div class="flex-1 space-y-2">
               <div class="h-3 bg-gray-200 rounded w-1/4" />
               <div class="h-3 bg-gray-200 rounded w-3/4" />
               <div class="h-3 bg-gray-200 rounded w-1/2" />
            </div>
         </div>
      </div>

      <div v-else-if="reviews.length === 0" class="text-center py-8 text-gray-400">
         <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-12 h-12 mx-auto mb-3" />
         <p>Chưa có đánh giá nào</p>
      </div>

      <div v-else class="space-y-4">
         <div v-for="review in reviews" :key="review.id"
            class="p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div class="flex items-start gap-3">
               <div
                  class="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-blue-500 flex items-center justify-center shrink-0">
                  <span class="text-white font-semibold text-sm">
                     {{ review.user?.name?.[0]?.toUpperCase() }}
                  </span>
               </div>

               <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                     <span class="font-medium text-sm text-gray-900">{{ review.user?.name }}</span>
                     <div class="flex">
                        <UIcon v-for="s in 5" :key="s" name="i-heroicons-star-solid" class="w-3.5 h-3.5"
                           :class="s <= review.rating ? 'text-yellow-400' : 'text-gray-200'" />
                     </div>
                     <span class="text-xs text-gray-400">{{ formatDate(review.createdAt) }}</span>
                  </div>
                  <p v-if="editingId !== review.id" class="text-sm text-gray-700 mt-1.5 leading-relaxed">
                     {{ review.content }}
                  </p>
                  <div v-else class="mt-3 space-y-3">
                     <div class="flex items-center gap-1">
                        <button v-for="s in 5" :key="s" type="button" @click="editForm.rating = s"
                           @mouseenter="editHoverRating = s" @mouseleave="editHoverRating = 0">
                           <UIcon name="i-heroicons-star-solid" class="w-6 h-6 transition-colors"
                              :class="s <= (editHoverRating || editForm.rating) ? 'text-yellow-400' : 'text-gray-200'" />
                        </button>
                        <span v-if="editForm.rating" class="ml-2 text-xs text-gray-600">
                           {{ ratingLabels[editForm.rating] }}
                        </span>
                     </div>
                     <UTextarea v-model="editForm.content" :rows="3" class="w-full text-sm" />
                     <div class="flex gap-2 justify-end">
                        <UButton size="xs" color="neutral" variant="outline" :disabled="updating" @click="cancelEdit">
                           Hủy
                        </UButton>
                        <UButton size="xs" color="primary" :loading="updating"
                           :disabled="!editForm.rating || !editForm.content.trim()" @click="saveEdit(review.id)">
                           Lưu
                        </UButton>
                     </div>
                  </div>

                  <div v-if="editingId !== review.id" class="flex items-center gap-4 mt-3">
                     <button class="flex items-center gap-1.5 text-xs transition-colors"
                        :class="myLike(review) === true ? 'text-blue-600 font-medium' : 'text-gray-400 hover:text-blue-500'"
                        @click="handleLike(review.id, true)">
                        <UIcon name="i-heroicons-hand-thumb-up" class="w-4 h-4" />
                        {{ review.likeCount }} Hữu ích
                     </button>
                     <button class="flex items-center gap-1.5 text-xs transition-colors"
                        :class="myLike(review) === false ? 'text-red-500 font-medium' : 'text-gray-400 hover:text-red-400'"
                        @click="handleLike(review.id, false)">
                        <UIcon name="i-heroicons-hand-thumb-down" class="w-4 h-4" />
                        {{ review.dislikeCount }}
                     </button>
                     <div v-if="authStore.user?.id === review.userId" class="flex items-center gap-3 ml-auto">
                        <button class="text-xs text-gray-400 hover:text-primary-500 transition-colors"
                           @click="startEdit(review)">
                           Sửa
                        </button>
                        <span class="text-gray-200">|</span>
                        <button class="text-xs text-gray-400 hover:text-red-500 transition-colors"
                           @click="deleteReview(review.id)">
                           Xóa
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div v-if="currentPage < totalPages" class="text-center">
            <UButton color="neutral" variant="outline" :loading="loading" @click="loadMore">
               Xem thêm đánh giá
            </UButton>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Review, CanReviewResult } from '~/types'

const props = defineProps<{
   productId: number
   avgRating: number
}>()

const authStore = useAuthStore()
const { api } = useApi()
const toast = useToast()
const { formatDate } = useFormat()

const reviews = ref<Review[]>([])
const loading = ref(false)
const submitting = ref(false)
const updating = ref(false)
const total = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const canReviewStatus = ref<CanReviewResult | null>(null)
const hoverRating = ref(0)


const reviewForm = reactive({ rating: 0, content: '' })

const editingId = ref<number | null>(null)
const editHoverRating = ref(0)
const editForm = reactive({ rating: 0, content: '' })

const ratingLabels: Record<number, string> = {
   1: 'Rất tệ', 2: 'Tệ', 3: 'Bình thường', 4: 'Tốt', 5: 'Tuyệt vời',
}

function myLike(review: Review): boolean | null {
   if (!authStore.isAuthenticated) return null
   const like = review.likes?.find(l => l.userId === authStore.user?.id)
   return like ? like.isLike : null
}

function startEdit(review: Review) {
   editingId.value = review.id
   editForm.rating = review.rating
   editForm.content = review.content
   editHoverRating.value = 0
}

function cancelEdit() {
   editingId.value = null
   editForm.rating = 0
   editForm.content = ''
}

async function saveEdit(reviewId: number) {
   if (!editForm.rating || !editForm.content.trim()) return
   updating.value = true
   try {
      await api(`/reviews/${reviewId}`, {
         method: 'PATCH',
         body: {
            rating: editForm.rating,
            content: editForm.content,
         },
      })
      const idx = reviews.value.findIndex(r => r.id === reviewId)
      if (idx !== -1) {
         const oldReview = reviews.value[idx]
         if (oldReview) {
            reviews.value[idx] = {
               ...oldReview,
               rating: editForm.rating,
               content: editForm.content,
               updatedAt: new Date().toISOString(),
            }
         }
      }
      cancelEdit()
      toast.add({ title: 'Đã cập nhật đánh giá', color: 'success' })
   } catch (e: any) {
      toast.add({
         title: 'Cập nhật thất bại',
         description: e?.data?.message || 'Vui lòng thử lại',
         color: 'error',
      })
   } finally {
      updating.value = false
   }
}

async function loadReviews(page = 1) {
   loading.value = true
   try {
      const res = await api<any>(`/reviews/product/${props.productId}`, {
         query: { page, limit: 10 },
      })
      if (page === 1) reviews.value = res.reviews
      else reviews.value.push(...res.reviews)
      total.value = res.total
      totalPages.value = res.totalPages
      currentPage.value = page
   } finally {
      loading.value = false
   }
}

async function checkCanReview() {
   if (!authStore.isAuthenticated) return
   try {
      canReviewStatus.value = await api<CanReviewResult>(
         `/reviews/can-review/${props.productId}`
      )
   } catch {
      canReviewStatus.value = { canReview: false, hasPurchased: false, hasReviewed: false }
   }
}

async function submitReview() {
   if (!reviewForm.rating) {
      toast.add({ title: 'Vui lòng chọn số sao', color: 'error' })
      return
   }
   if (!reviewForm.content.trim()) {
      toast.add({ title: 'Nhập nội dung đánh giá', color: 'error' })
      return
   }
   submitting.value = true
   try {
      await api('/reviews', {
         method: 'POST',
         body: {
            productId: props.productId,
            rating: reviewForm.rating,
            content: reviewForm.content,
         },
      })
      toast.add({ title: 'Cảm ơn đánh giá của bạn!', color: 'success' })
      reviewForm.rating = 0
      reviewForm.content = ''
      await checkCanReview()
      await loadReviews(1)
   } finally {
      submitting.value = false
   }
}

async function handleLike(reviewId: number, isLike: boolean) {
   if (!authStore.isAuthenticated) {
      await navigateTo('/sign-in')
      return
   }
   await api(`/reviews/${reviewId}/like`, {
      method: 'POST',
      body: { isLike },
   })
   await loadReviews(currentPage.value)
}

async function deleteReview(id: number) {
   await api(`/reviews/${id}`, { method: 'DELETE' })
   reviews.value = reviews.value.filter(r => r.id !== id)
   total.value -= 1
   await checkCanReview()
   toast.add({ title: 'Đã xóa đánh giá', color: 'info' })
}

async function loadMore() {
   await loadReviews(currentPage.value + 1)
}

onMounted(async () => {
   await loadReviews()
   await checkCanReview()
})
</script>