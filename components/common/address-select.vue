<template>
   <div class="relative" ref="containerRef">
      <UInput v-model="query" :placeholder="placeholder" :disabled="disabled" :loading="loading" class="w-full"
         autocomplete="off" @focus="open = true" @input="open = true" />
      <div v-if="open && filtered.length > 0"
         class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
         <button v-for="item in filtered" :key="item.value" type="button"
            class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-200 transition-colors"
            @mousedown.prevent="select(item)">
            {{ item.label }}
         </button>
      </div>
      <div v-if="open && query && filtered.length === 0 && !loading"
         class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-400">
         Không tìm thấy kết quả
      </div>
   </div>
</template>

<script setup lang="ts">
interface Item {
   label: string
   value: number
}

const props = defineProps<{
   modelValue: number | null
   items: Item[]
   placeholder?: string
   disabled?: boolean
   loading?: boolean
}>()

const emit = defineEmits<{
   'update:modelValue': [value: number | null]
   'select': [item: Item]
}>()

const open = ref(false)
const query = ref('')
const containerRef = ref<HTMLElement>()

function normalize(str: string) {
   return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
}

const filtered = computed(() => {
   if (!query.value) return props.items
   const q = normalize(query.value)
   return props.items.filter(item => normalize(item.label).includes(q))
})

function select(item: Item) {
   query.value = item.label
   open.value = false
   emit('update:modelValue', item.value)
   emit('select', item)
}

watch(() => props.modelValue, (val) => {
   if (!val) {
      query.value = ''
      return
   }
   const found = props.items.find(i => i.value === val)
   if (found) query.value = found.label
})

watch(() => props.items, (items) => {
   if (!props.modelValue) return
   const found = items.find(i => i.value === props.modelValue)
   if (found) query.value = found.label
})

onMounted(() => {
   document.addEventListener('mousedown', handleOutsideClick)
})
onUnmounted(() => {
   document.removeEventListener('mousedown', handleOutsideClick)
})

function handleOutsideClick(e: MouseEvent) {
   if (!containerRef.value?.contains(e.target as Node)) {
      open.value = false
      const matched = props.items.find(i => i.label === query.value)
      if (!matched && props.modelValue) {
         const current = props.items.find(i => i.value === props.modelValue)
         query.value = current?.label || ''
      }
      if (!matched && !props.modelValue) {
         query.value = ''
      }
   }
}
</script>