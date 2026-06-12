<template>
   <div class="space-y-5">
      <div>
         <h4 class="font-semibold text-gray-900 mb-3 text-sm">Danh mục</h4>
         <div class="space-y-1">
            <button class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors" :class="!modelValue.categoryId
               ? 'bg-primary-50 text-primary-700 font-medium'
               : 'text-gray-600 hover:bg-gray-50'" @click="updateCategory('')">
               Tất cả danh mục
            </button>
            <button v-for="cat in categories" :key="cat.id"
               class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors" :class="modelValue.categoryId === String(cat.id)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'" @click="updateCategory(String(cat.id))">
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

         <template v-if="modelValue.categoryId">
            <div v-if="brandsLoading" class="flex flex-wrap gap-2">
               <div v-for="i in 5" :key="i" class="h-7 w-16 bg-gray-100 rounded-full animate-pulse" />
            </div>

            <div v-else-if="brands.length > 0" class="flex flex-wrap gap-2">
               <button v-for="brand in brands" :key="brand"
                  class="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all" :class="modelValue.brand === brand
                     ? 'border-primary-500 bg-primary-50 text-primary-700'
                     : 'border-gray-200 text-gray-600 hover:border-gray-400'"
                  @click="update('brand', modelValue.brand === brand ? '' : brand)">
                  {{ brand }}
               </button>
            </div>

            <p v-else class="text-xs text-gray-400 italic">
               Không có nhãn hàng trong danh mục này
            </p>
         </template>

         <template v-else>
            <div class="relative">
               <UInput v-model="brandInput" placeholder="Tìm theo nhãn hàng..." icon="i-heroicons-magnifying-glass"
                  size="sm" @blur="onInputBlur" @keyup.enter="commitBrand" @keydown.escape="closeDropdown"
                  @keydown.down.prevent="moveDown" @keydown.up.prevent="moveUp">
                  <template v-if="brandInput" #trailing>
                     <button class="flex items-center" @mousedown.prevent="clearBrandInput">
                        <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-gray-400 hover:text-gray-600" />
                     </button>
                  </template>
               </UInput>

               <Transition enter-active-class="transition-all duration-150 ease-out"
                  enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-all duration-100 ease-in"
                  leave-to-class="opacity-0 -translate-y-1">
                  <div v-if="showDropdown && !brandsLoading && filteredBrands.length > 0"
                     class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto">
                     <button v-for="(brand, idx) in filteredBrands" :key="brand"
                        class="w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2"
                        :class="idx === activeIdx
                           ? 'bg-primary-50 text-primary-700'
                           : modelValue.brand === brand
                              ? 'bg-primary-50/50 text-primary-600'
                              : 'text-gray-700 hover:bg-gray-50'" @mousedown.prevent="selectBrand(brand)">
                        <span :class="modelValue.brand === brand ? 'font-medium' : ''">{{ brand }}</span>
                        <UIcon v-if="modelValue.brand === brand" name="i-heroicons-check"
                           class="w-3.5 h-3.5 shrink-0 text-primary-500" />
                     </button>
                  </div>
               </Transition>

               <div v-if="showDropdown && brandsLoading"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-50 px-3 py-2.5">
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                     <div
                        class="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin shrink-0" />
                     Đang tải danh sách nhãn hàng...
                  </div>
               </div>

               <div v-if="showDropdown && !brandsLoading && brandInput.trim() && filteredBrands.length === 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-50 px-3 py-2.5">
                  <p class="text-xs text-gray-400">Không tìm thấy nhãn hàng phù hợp</p>
               </div>
            </div>
         </template>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

const props = defineProps<{
   categories: Category[]
   modelValue: Record<string, string>
   brands: string[]
   brandsLoading: boolean
}>()

const emit = defineEmits<{
   'update:modelValue': [value: Record<string, string>]
   reset: []
}>()

const brandInput = ref(props.modelValue.brand || '')
const showDropdown = ref(false)
const activeIdx = ref(-1)
const isSelecting = ref(false)
watch(() => props.modelValue.brand, (val) => {
   brandInput.value = val || ''
})

watch(() => props.modelValue.categoryId, () => {
   brandInput.value = ''
   closeDropdown()
})

watch(brandInput, (val) => {
   if (isSelecting.value) return
   activeIdx.value = -1
   if (val.trim()) {
      showDropdown.value = true
   } else {
      closeDropdown()
   }
})


const filteredBrands = computed(() => {
   const a = brandInput.value.toLowerCase().trim()
   if (!a) return []
   return props.brands.filter(b => b.toLowerCase().includes(a))
})

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

function updateCategory(categoryId: string) {
   emit('update:modelValue', {
      ...props.modelValue,
      categoryId,
      brand: '',
   })
}

function updatePriceRange(min: string, max: string) {
   if (props.modelValue.minPrice === min && props.modelValue.maxPrice === max) {
      emit('update:modelValue', { ...props.modelValue, minPrice: '', maxPrice: '' })
   } else {
      emit('update:modelValue', { ...props.modelValue, minPrice: min, maxPrice: max })
   }
}

function onInputBlur() {
   setTimeout(closeDropdown, 150)
}

function closeDropdown() {
   showDropdown.value = false
   activeIdx.value = -1
}

function moveDown() {
   if (!brandInput.value.trim()) return
   if (!showDropdown.value) {
      showDropdown.value = true
      return
   }
   activeIdx.value = Math.min(activeIdx.value + 1, filteredBrands.value.length - 1)
}

function moveUp() {
   activeIdx.value = Math.max(activeIdx.value - 1, -1)
}

function selectBrand(brand) {
   isSelecting.value = true
   if (props.modelValue.brand === brand) {
      brandInput.value = ''
      update('brand', '')
   } else {
      brandInput.value = brand
      update('brand', brand)
   }
   closeDropdown()
   nextTick(() => { isSelecting.value = false })
}

function commitBrand() {
   if (activeIdx.value >= 0 && filteredBrands.value[activeIdx.value]) {
      selectBrand(filteredBrands.value[activeIdx.value])
   } else {
      update('brand', brandInput.value.trim())
      closeDropdown()
   }
}

function clearBrandInput() {
   brandInput.value = ''
   update('brand', '')
   closeDropdown()
}
</script>