<template>
   <div class="space-y-3">
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
         <img :src="displayMainImage" :alt="alt" class="w-full h-full object-cover transition-all duration-300" />
      </div>
      <div v-if="productImages.length > 1" class="flex gap-2 overflow-x-auto pb-1">
         <button v-for="img in productImages" :key="img.id"
            class="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all" :class="manualSelectedUrl === img.url
               ? 'border-primary-500 scale-95'
               : 'border-transparent hover:border-gray-300'" @click="manualSelectedUrl = img.url">
            <img :src="img.url" class="w-full h-full object-cover" />
         </button>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '~/types'

const props = defineProps<{
   productImages: ProductImage[]
   variantImageUrl?: string | null
   selectedColor?: string | null
   alt?: string
}>()

const manualSelectedUrl = ref<string | null>(null)

const displayMainImage = computed(() => {
   if (props.variantImageUrl) return props.variantImageUrl
   if (manualSelectedUrl.value) return manualSelectedUrl.value
   const mainImg = props.productImages.find(img => img.isMain)
   if (mainImg) return mainImg.url
   return props.productImages[0]?.url || ''
})

watch(() => props.variantImageUrl, () => {
   manualSelectedUrl.value = null
})
</script>