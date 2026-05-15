<template>
   <div class="space-y-5">
      <div>
         <h4 class="font-semibold text-gray-900 mb-3 text-sm">Danh mục</h4>
         <div class="space-y-1">
            <button class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors" :class="!modelValue.categoryId
               ? 'bg-primary-50 text-primary-700 font-medium'
               : 'text-gray-600 hover:bg-gray-50'" @click="update('categoryId', '')">
               Tất cả danh mục
            </button>
            <button v-for="cat in categories" :key="cat.id"
               class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors" :class="modelValue.categoryId === String(cat.id)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'" @click="update('categoryId', String(cat.id))">
               {{ cat.name }}
            </button>
         </div>
      </div>
      <USeparator />
      <div>
         <h4 class="font-semibold text-gray-900 mb-3 text-sm">Khoảng giá</h4>
         <div class="space-y-1">
            <button v-for="range in priceRanges" :key="range.label"
               class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors" :class="modelValue.minPrice === range.min && modelValue.maxPrice === range.max
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'" @click="updatePriceRange(range.min, range.max)">
               {{ range.label }}
            </button>
         </div>
      </div>
      <USeparator />
      <div>
         <h4 class="font-semibold text-gray-900 mb-3 text-sm">Nhãn hàng</h4>
         <div v-if="brands.length === 0" class="flex flex-wrap gap-2">
            <div v-for="i in 6" :key="i" class="h-7 w-16 bg-gray-100 rounded-full animate-pulse" />
         </div>
         <div v-else class="flex flex-wrap gap-2">
            <button v-for="brand in brands" :key="brand"
               class="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all" :class="modelValue.brand === brand
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'"
               @click="update('brand', modelValue.brand === brand ? '' : brand)">
               {{ brand }}
            </button>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

const props = defineProps<{
   categories: Category[]
   modelValue: Record<string, string>
   brands: string[]
}>()

const emit = defineEmits<{
   'update:modelValue': [value: Record<string, string>]
   reset: []
}>()


const priceRanges = [
   { label: 'Dưới 5 triệu', min: '', max: '5000000' },
   { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
   { label: '10 - 20 triệu', min: '10000000', max: '20000000' },
   { label: '20 - 30 triệu', min: '20000000', max: '30000000' },
   { label: 'Trên 30 triệu', min: '30000000', max: '' },
]

function update(key: string, value: string) {
   emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updatePriceRange(min: string, max: string) {
   if (props.modelValue.minPrice === min && props.modelValue.maxPrice === max) {
      emit('update:modelValue', { ...props.modelValue, minPrice: '', maxPrice: '' })
   } else {
      emit('update:modelValue', { ...props.modelValue, minPrice: min, maxPrice: max })
   }
}
</script>