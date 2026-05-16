<template>
   <div class="space-y-4">
      <div v-if="selectedVariant"
         class="p-4 bg-linear-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
         <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-baseline gap-2">
               <span class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(selectedVariant.salePrice) }}
               </span>
               <span v-if="selectedVariant.originalPrice > selectedVariant.salePrice"
                  class="text-sm text-gray-400 line-through">
                  {{ formatCurrency(selectedVariant.originalPrice) }}
               </span>
               <UBadge v-if="discount > 0" color="error" size="sm" class="-translate-y-1">
                  -{{ discount }}%
               </UBadge>
            </div>
            <UBadge :color="selectedVariant.stock > 0 ? 'success' : 'error'" variant="soft">
               {{ selectedVariant.stock > 0 ? `Còn ${selectedVariant.stock} sản phẩm` : 'Hết hàng' }}
            </UBadge>
         </div>
      </div>
      <div v-if="colors.length > 0" class="flex gap-4 items-center flex-wrap">
         <p class="text-lg font-medium text-gray-700">Màu sắc:</p>
         <div class="flex flex-wrap gap-2">
            <button v-for="color in colors" :key="color.value"
               class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all" :class="selectedColor === color.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'" @click="selectColor(color.value)">
               <img v-if="color.imageUrl" :src="color.imageUrl"
                  class="w-6 h-6 rounded-md object-cover border border-gray-200" :alt="color.value" />
               <div v-else class="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                  <UIcon name="i-heroicons-swatch" class="w-3.5 h-3.5 text-gray-400" />
               </div>
               {{ color.value }}
            </button>
         </div>
      </div>
      <div v-if="filteredStorages.length > 0" class="flex gap-4 items-center flex-wrap">
         <p class="text-lg font-medium text-gray-700">Dung lượng:</p>
         <div class="flex flex-wrap gap-2">
            <button v-for="storage in filteredStorages" :key="storage"
               class="px-3 py-1.5 rounded-xl border-2 text-sm font-medium transition-all" :class="selectedStorage === storage
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'" @click="selectStorage(storage)">
               {{ storage }}
            </button>
         </div>
      </div>
      <div v-if="filteredRams.length > 0" class="flex gap-4 items-center flex-wrap">
         <p class="text-sm font-medium text-gray-700">RAM:</p>
         <div class="flex flex-wrap gap-2">
            <button v-for="ram in filteredRams" :key="ram"
               class="px-3 py-1.5 rounded-xl border-2 text-sm font-medium transition-all" :class="selectedRam === ram
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'" @click="selectRam(ram)">
               {{ ram }}
            </button>
         </div>
      </div>
      <div v-if="filteredVersions.length > 0" class="flex gap-4 items-center flex-wrap">
         <p class="text-sm font-medium text-gray-700">Phiên bản:</p>
         <div class="flex flex-wrap gap-2">
            <button v-for="version in filteredVersions" :key="version"
               class="px-3 py-1.5 rounded-xl border-2 text-sm font-medium transition-all" :class="selectedVersion === version
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'" @click="selectedVersion = version">
               {{ version }}
            </button>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { ProductVariant } from '~/types'

const props = defineProps<{
   variants: ProductVariant[]
}>()

const emit = defineEmits<{
   'update:selected': [variant: ProductVariant | null]
   'update:variantImageUrl': [url: string | null]
   'update:selectedColor': [color: string | null]
}>()

const { formatCurrency, discountPercent } = useFormat()
const colors = computed(() => {
   const colorMap = new Map<string, string | null>()
   props.variants.forEach(v => {
      if (v.color && !colorMap.has(v.color)) {
         colorMap.set(v.color, v.imageUrl || null)
      }
   })
   return Array.from(colorMap.entries()).map(([value, imageUrl]) => ({ value, imageUrl }))
})

const filteredStorages = computed(() => {
   const variants = selectedColor.value
      ? props.variants.filter(v => v.color === selectedColor.value)
      : props.variants
   return [...new Set(variants.map(v => v.storage).filter(Boolean) as string[])]
})

const filteredRams = computed(() => {
   const variants = props.variants.filter(v => {
      if (selectedColor.value && v.color !== selectedColor.value) return false
      if (selectedStorage.value && v.storage !== selectedStorage.value) return false
      return true
   })
   return [...new Set(variants.map(v => v.ram).filter(Boolean) as string[])]
})

const filteredVersions = computed(() => {
   const variants = props.variants.filter(v => {
      if (selectedColor.value && v.color !== selectedColor.value) return false
      if (selectedStorage.value && v.storage !== selectedStorage.value) return false
      if (selectedRam.value && v.ram !== selectedRam.value) return false
      return true
   })
   return [...new Set(variants.map(v => v.version).filter(Boolean) as string[])]
})

const selectedColor = ref<string | null>(null)
const selectedStorage = ref<string | null>(null)
const selectedRam = ref<string | null>(null)
const selectedVersion = ref<string | null>(null)

const selectedVariant = computed(() => {
   return props.variants.find(v => {
      const colorOk = !colors.value.length || !selectedColor.value || v.color === selectedColor.value
      const storageOk = !filteredStorages.value.length || !selectedStorage.value || v.storage === selectedStorage.value
      const ramOk = !filteredRams.value.length || !selectedRam.value || v.ram === selectedRam.value
      const versionOk = !filteredVersions.value.length || !selectedVersion.value || v.version === selectedVersion.value
      return colorOk && storageOk && ramOk && versionOk
   }) || null
})

const discount = computed(() => {
   if (!selectedVariant.value) return 0
   return discountPercent(selectedVariant.value.originalPrice, selectedVariant.value.salePrice)
})

function selectColor(color: string) {
   selectedColor.value = color

   const availableStorages = [...new Set(
      props.variants
         .filter(v => v.color === color)
         .map(v => v.storage)
         .filter(Boolean) as string[]
   )]

   if (selectedStorage.value && !availableStorages.includes(selectedStorage.value)) {
      selectedStorage.value = availableStorages[0] ?? null
   } else if (!selectedStorage.value) {
      selectedStorage.value = availableStorages[0] ?? null
   }

   resetRamAndVersion()
}

function selectStorage(storage: string) {
   selectedStorage.value = storage
   resetRamAndVersion()
}

function selectRam(ram: string) {
   selectedRam.value = ram

   const availableVersions = [...new Set(
      props.variants
         .filter(v => {
            if (selectedColor.value && v.color !== selectedColor.value) return false
            if (selectedStorage.value && v.storage !== selectedStorage.value) return false
            if (v.ram !== ram) return false
            return true
         })
         .map(v => v.version)
         .filter(Boolean) as string[]
   )]
   selectedVersion.value = availableVersions[0] ?? null
}

function resetRamAndVersion() {
   const availableRams = [...new Set(
      props.variants
         .filter(v => {
            if (selectedColor.value && v.color !== selectedColor.value) return false
            if (selectedStorage.value && v.storage !== selectedStorage.value) return false
            return true
         })
         .map(v => v.ram)
         .filter(Boolean) as string[]
   )]
   selectedRam.value = availableRams[0] ?? null

   const availableVersions = [...new Set(
      props.variants
         .filter(v => {
            if (selectedColor.value && v.color !== selectedColor.value) return false
            if (selectedStorage.value && v.storage !== selectedStorage.value) return false
            if (selectedRam.value && v.ram !== selectedRam.value) return false
            return true
         })
         .map(v => v.version)
         .filter(Boolean) as string[]
   )]
   selectedVersion.value = availableVersions[0] ?? null
}

onMounted(() => {
   if (!props.variants?.length) return

   const firstColor = colors.value[0]?.value ?? null
   selectedColor.value = firstColor


   const availableStorages = [...new Set(
      props.variants
         .filter(v => !firstColor || v.color === firstColor)
         .map(v => v.storage)
         .filter(Boolean) as string[]
   )]
   selectedStorage.value = availableStorages[0] ?? null

   const availableRams = [...new Set(
      props.variants
         .filter(v => {
            if (firstColor && v.color !== firstColor) return false
            if (selectedStorage.value && v.storage !== selectedStorage.value) return false
            return true
         })
         .map(v => v.ram)
         .filter(Boolean) as string[]
   )]
   selectedRam.value = availableRams[0] ?? null

   const availableVersions = [...new Set(
      props.variants
         .filter(v => {
            if (firstColor && v.color !== firstColor) return false
            if (selectedStorage.value && v.storage !== selectedStorage.value) return false
            if (selectedRam.value && v.ram !== selectedRam.value) return false
            return true
         })
         .map(v => v.version)
         .filter(Boolean) as string[]
   )]
   selectedVersion.value = availableVersions[0] ?? null
})

watch(selectedVariant, v => emit('update:selected', v), { immediate: true })

watch(selectedColor, color => {
   emit('update:selectedColor', color)
   const colorData = colors.value.find(c => c.value === color)
   emit('update:variantImageUrl', colorData?.imageUrl || null)
})
</script>