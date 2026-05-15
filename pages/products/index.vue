<template>
   <div class="container mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
         <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
         </div>
         <USelect v-model="store.filter.sortBy" :items="sortOptions" class="w-44" @update:model-value="applyFilter" />
      </div>

      <div class="flex gap-6">
         <aside class="hidden lg:block w-60 shrink-0">
            <UCard>
               <ProductFilter v-model="filterModel" :categories="categories" @reset="doReset"
                  :brands="store.availableBrands" />
            </UCard>
         </aside>
         <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-4 lg:hidden">
               <UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-funnel"
                  @click="filterDrawerOpen = true">
                  Bộ lọc
                  <UBadge v-if="activeFilterCount > 0" color="primary" size="xs" class="ml-1">
                     {{ activeFilterCount }}
                  </UBadge>
               </UButton>
               <span class="text-sm text-gray-500">{{ store.total }} kết quả</span>
            </div>
            <div v-if="activeTags.length > 0" class="flex flex-wrap gap-2 mb-4">
               <UBadge v-for="tag in activeTags" :key="tag.key" color="primary" variant="soft"
                  class="cursor-pointer flex items-center gap-1" @click="removeTag(tag.key)">
                  {{ tag.label }}
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
               </UBadge>
               <UBadge v-if="activeTags.length > 1" color="neutral" variant="soft" class="cursor-pointer"
                  @click="doReset">
                  Xóa tất cả
               </UBadge>
            </div>

            <div v-if="!store.isFetched && store.loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
               <div v-for="i in 9" :key="i" class="animate-pulse bg-white rounded-2xl overflow-hidden border h-80">
                  <div class="h-48 bg-gray-200" />
                  <div class="p-4 space-y-2">
                     <div class="h-3 bg-gray-200 rounded" />
                     <div class="h-3 bg-gray-200 rounded w-2/3" />
                     <div class="h-5 bg-gray-200 rounded w-1/2" />
                  </div>
               </div>
            </div>

            <template v-else>
               <CommonAppEmpty v-if="store.items.length === 0 && !store.loading" icon="i-heroicons-magnifying-glass"
                  title="Không tìm thấy sản phẩm" description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  action-label="Xóa bộ lọc" @action="doReset" />
               <div v-else class="relative">
                  <Transition enter-active-class="transition-opacity duration-150"
                     leave-active-class="transition-opacity duration-150" enter-from-class="opacity-0"
                     leave-to-class="opacity-0">
                     <div v-if="store.loading"
                        class="absolute inset-0 bg-white/60 z-10 rounded-2xl flex items-start justify-center pt-16">
                        <div
                           class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border text-sm text-gray-600">
                           <div
                              class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                           Đang tải...
                        </div>
                     </div>
                  </Transition>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                     <ProductCard v-for="product in store.items" :key="product.id" :product="product" />
                  </div>
               </div>
            </template>

            <CommonAppPagination :current-page="store.page" :total-pages="store.totalPages" @change="changePage" />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

useHead({ title: 'Sản phẩm' })

const route = useRoute()
const store = useProductStore()
const { formatCurrency } = useFormat()

const filterDrawerOpen = ref(false)

const { data: catData } = await useApiFetch<Category[]>('/categories', {
   key: 'product-categories',
})
const categories = computed(() => (catData.value as any) || [])

function syncFromQuery() {
   const q = route.query
   store.filter.search = (q.search as string) || ''
   store.filter.categoryId = (q.categoryId as string) || ''
   store.filter.brand = (q.brand as string) || ''
   store.filter.minPrice = (q.minPrice as string) || ''
   store.filter.maxPrice = (q.maxPrice as string) || ''
   store.filter.sortBy = (q.sortBy as string) || 'newest'
}

const filterModel = computed({
   get: () => ({
      categoryId: store.filter.categoryId,
      brand: store.filter.brand,
      minPrice: store.filter.minPrice,
      maxPrice: store.filter.maxPrice,
   }),
   set: (val) => {
      store.filter.categoryId = val.categoryId || ''
      store.filter.brand = val.brand || ''
      store.filter.minPrice = val.minPrice || ''
      store.filter.maxPrice = val.maxPrice || ''
      applyFilter()
   },
})

const sortOptions = [
   { label: 'Mới nhất', value: 'newest' },
   { label: 'Bán chạy', value: 'best_seller' },
   { label: 'Giá tăng dần', value: 'price_asc' },
   { label: 'Giá giảm dần', value: 'price_desc' },
]

const activeTags = computed(() => {
   const tags: { key: string; label: string }[] = []
   if (store.filter.search) tags.push({ key: 'search', label: `"${store.filter.search}"` })
   if (store.filter.brand) tags.push({ key: 'brand', label: store.filter.brand })
   if (store.filter.categoryId) {
      const cat = (categories.value as any[]).find(
         (c: any) => String(c.id) === store.filter.categoryId
      )
      if (cat) tags.push({ key: 'categoryId', label: cat.name })
   }
   if (store.filter.minPrice || store.filter.maxPrice) {
      const label =
         store.filter.minPrice && store.filter.maxPrice
            ? `${formatCurrency(Number(store.filter.minPrice))} - ${formatCurrency(Number(store.filter.maxPrice))}`
            : store.filter.minPrice
               ? `Từ ${formatCurrency(Number(store.filter.minPrice))}`
               : `Đến ${formatCurrency(Number(store.filter.maxPrice))}`
      tags.push({ key: 'price', label })
   }
   return tags
})

const activeFilterCount = computed(() => activeTags.value.length)

const pageTitle = computed(() => {
   if (store.filter.search) return `Kết quả: "${store.filter.search}"`
   if (store.filter.categoryId) {
      const cat = (categories.value as any[]).find(
         (c: any) => String(c.id) === store.filter.categoryId
      )
      return cat?.name || 'Sản phẩm'
   }
   return 'Tất cả sản phẩm'
})

function removeTag(key: string) {
   if (key === 'search') store.filter.search = ''
   else if (key === 'brand') store.filter.brand = ''
   else if (key === 'categoryId') store.filter.categoryId = ''
   else if (key === 'price') {
      store.filter.minPrice = ''
      store.filter.maxPrice = ''
   }
   applyFilter()
}

async function applyFilter() {
   store.page = 1
   const query: Record<string, string> = {}
   if (store.filter.search) query.search = store.filter.search
   if (store.filter.categoryId) query.categoryId = store.filter.categoryId
   if (store.filter.brand) query.brand = store.filter.brand
   if (store.filter.minPrice) query.minPrice = store.filter.minPrice
   if (store.filter.maxPrice) query.maxPrice = store.filter.maxPrice
   if (store.filter.sortBy && store.filter.sortBy !== 'newest') query.sortBy = store.filter.sortBy
   navigateTo({ path: '/products', query }, { replace: true })
}

async function doReset() {
   store.resetFilter()
   filterDrawerOpen.value = false
   navigateTo('/products', { replace: true })
}

async function changePage(p: number) {
   store.page = p
   store.fetchAll()
   window.scrollTo({ top: 0, behavior: 'smooth' })
}

syncFromQuery()
await Promise.all([
   store.fetchAll(),
   store.fetchBrands(),
])
watch(() => route.query, () => {
   syncFromQuery()
   store.fetchAll()
})
</script>