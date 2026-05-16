<template>
   <div class="space-y-3">
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
         <swiper :modules="modules" :loop="allImages.length > 1" :allow-touch-move="true" :initial-slide="activeIndex"
            class="w-full h-full" @swiper="onSwiper" @slide-change="onSlideChange">
            <swiper-slide v-for="img in allImages" :key="img.url">
               <img :src="img.url" :alt="alt" class="w-full h-full object-cover" />
            </swiper-slide>
         </swiper>
         <button v-if="allImages.length > 1" class="absolute left-2 top-1/2 -translate-y-1/2 z-10
               w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow
               flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition-opacity duration-200
               hover:bg-white hover:scale-110 active:scale-95" @click="swiperInstance?.slidePrev()">
            <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-gray-700" />
         </button>
         <button v-if="allImages.length > 1" class="absolute right-2 top-1/2 -translate-y-1/2 z-10
               w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow
               flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition-opacity duration-200
               hover:bg-white hover:scale-110 active:scale-95" @click="swiperInstance?.slideNext()">
            <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-700" />
         </button>
         <div v-if="allImages.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            <span v-for="(_, i) in allImages" :key="i" class="w-1.5 h-1.5 rounded-full transition-all duration-300"
               :class="i === activeIndex ? 'bg-white w-4' : 'bg-white/50'" />
         </div>
      </div>
      <div v-if="allImages.length > 1" class="flex gap-2 overflow-x-auto pb-1">
         <button v-for="(img, i) in allImages" :key="img.url"
            class="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all" :class="activeIndex === i
               ? 'border-primary-500 scale-95'
               : 'border-transparent hover:border-gray-300'" @click="goTo(i)">
            <img :src="img.url" class="w-full h-full object-cover" />
         </button>
      </div>
   </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import type { ProductImage } from '~/types'
import 'swiper/css'

const props = defineProps<{
   productImages: ProductImage[]
   variantImageUrl?: string | null
   alt?: string
}>()

const modules = [Navigation]
const swiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)

const allImages = computed(() => {
   if (props.variantImageUrl) {
      return [
         { url: props.variantImageUrl },
         ...props.productImages.map(img => ({ url: img.url }))
      ]
   }
   const sorted = [...props.productImages].sort((a, b) =>
      a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
   )
   return sorted.map(img => ({ url: img.url }))
})

function onSwiper(swiper: SwiperType) {
   swiperInstance.value = swiper
}

function onSlideChange() {
   if (!swiperInstance.value) return
   activeIndex.value = swiperInstance.value.realIndex
}

function goTo(index: number) {
   activeIndex.value = index
   swiperInstance.value?.slideToLoop(index)
}

watch(() => props.variantImageUrl, () => {
   activeIndex.value = 0
   nextTick(() => {
      swiperInstance.value?.slideToLoop(0, 0) 
   })
})
</script>