<template>
   <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" :disabled="currentPage <= 1"
         @click="$emit('change', currentPage - 1)" />
      <div class="flex gap-1">
         <button v-for="p in displayedPages" :key="String(p)"
            class="w-9 h-9 rounded-lg text-sm font-medium transition-all" :class="p === currentPage
               ? 'bg-primary-600 text-white'
               : p === '...'
                  ? 'text-gray-300 cursor-default'
                  : 'text-gray-700 hover:bg-gray-100'" :disabled="p === '...'"
            @click="typeof p === 'number' && $emit('change', p)">
            {{ p }}
         </button>
      </div>
      <UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right"
         :disabled="currentPage >= totalPages" @click="$emit('change', currentPage + 1)" />
   </div>
</template>

<script setup lang="ts">
const props = defineProps<{
   currentPage: number
   totalPages: number
}>()

defineEmits<{ change: [page: number] }>()
const displayedPages = computed(() => {
   const pages: (number | string)[] = []
   const delta = 1

   for (let i = 1; i <= props.totalPages; i++) {
      if (
         i === 1 ||
         i === props.totalPages ||
         (i >= props.currentPage - delta && i <= props.currentPage + delta)
      ) {
         pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
         pages.push('...')
      }
   }
   return pages
})
</script>