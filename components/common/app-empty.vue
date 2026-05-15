<template>
   <div class="text-center py-16 px-4">
      <UIcon :name="icon" class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-600">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
         {{ description }}
      </p>
      <UButton v-if="actionLabel" :to="actionTo" color="primary" class="mt-4" @click="$emit('action')">
         {{ actionLabel }}
      </UButton>
   </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
   icon?: string
   title: string
   description?: string
   actionLabel?: string
   actionTo?: string
}>(), {
   icon: 'i-heroicons-inbox',
})

defineEmits<{ action: [] }>()
</script>