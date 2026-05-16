<template>
   <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <Transition enter-active-class="transition-all duration-300 ease-out"
         enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
         leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
         leave-to-class="opacity-0 scale-95 translate-y-4">
         <div v-if="chat.isChatOpen.value"
            class="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style="height: 480px">
            <div class="bg-secondary-02 px-4 py-3 flex items-center justify-between shrink-0">
               <div class="flex items-center gap-3">
                  <div class="relative">
                     <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-white" />
                     </div>
                     <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-primary-600"
                        :class="chat.isConnected.value ? 'bg-green-400' : 'bg-gray-400'" />
                  </div>
                  <div>
                     <p class="text-white font-semibold text-sm">Hỗ trợ TechZone</p>
                     <p class="text-primary-200 text-xs">
                        {{ chat.isConnected.value ? 'Đang trực tuyến' : 'Đang kết nối...' }}
                     </p>
                  </div>
               </div>
               <button class="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  @click="chat.toggleChat()">
                  <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
               </button>
            </div>

            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
               <div v-if="!chat.messages.value.length" class="text-center py-6">
                  <div class="w-14 h-14 bg-secondary-02/50 rounded-full flex items-center justify-center mx-auto mb-3">
                     <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-7 h-7 text-secondary-02" />
                  </div>
                  <p class="text-sm font-medium text-gray-700">Xin chào!</p>
                  <p class="text-xs text-gray-500 mt-1">Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
               </div>
               <template v-for="msg in chat.messages.value" :key="msg.id">
                  <div v-if="msg.sender?.role === 'ADMIN'" class="flex gap-2">
                     <div class="w-7 h-7 rounded-full bg-secondary-02 flex items-center justify-center shrink-0 mt-3">
                        <UIcon name="i-heroicons-user" class="w-4 h-4 text-white" />
                     </div>
                     <div class="max-w-[75%]">
                        <div
                           class="bg-white text-gray-800 text-sm px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                           {{ msg.content }}
                        </div>
                        <p class="text-[10px] text-gray-400 mt-1 ml-1">{{ formatTime(msg.createdAt) }}</p>
                     </div>
                  </div>

                  <div v-else class="flex items-end justify-end gap-2">
                     <div class="max-w-[75%]">
                        <div class="bg-secondary-02 text-white text-sm px-3 py-2 rounded-2xl rounded-br-sm shadow-sm">
                           {{ msg.content }}
                        </div>
                        <p class="text-[10px] text-gray-400 mt-1 mr-1 text-right">{{ formatTime(msg.createdAt) }}</p>
                     </div>
                  </div>
               </template>

               <div v-if="chat.isTyping.value" class="flex gap-2">
                  <div class="w-7 h-7 rounded-full bg-secondary-02 flex items-center justify-center shrink-0 mt-3">
                     <UIcon name="i-heroicons-user" class="w-4 h-4 text-white" />
                  </div>
                  <div class="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                     <div class="flex gap-1 items-center h-4">
                        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                     </div>
                  </div>
               </div>
            </div>

            <div class="px-3 py-3 border-t bg-white shrink-0">
               <div v-if="!authStore.isAuthenticated" class="text-center py-1">
                  <p class="text-xs text-gray-500 mb-2">Vui lòng đăng nhập để chat</p>
                  <NuxtLink to="/sign-in" @click="chat.toggleChat()">
                     <UButton size="xs" class="bg-secondary-02!">Đăng nhập</UButton>
                  </NuxtLink>
               </div>
               <div v-else class="flex items-center gap-2">
                  <UInput v-model="inputText" placeholder="Nhập tin nhắn..." class="flex-1" size="sm"
                     :disabled="!chat.isConnected.value" @keydown.enter.prevent="handleSend"
                     @input="chat.emitTyping()" />
                  <UButton size="sm" class="bg-secondary-02!" :disabled="!inputText.trim() || !chat.isConnected.value"
                     icon="i-heroicons-paper-airplane" @click="handleSend" />
               </div>
            </div>
         </div>
      </Transition>
      <button
         class="w-14 h-14 bg-secondary-02 hover:bg-secondary-01  text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative"
         @click="handleToggle">
         <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 rotate-90 scale-50"
            enter-to-class="opacity-100 rotate-0 scale-100" leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 rotate-0 scale-100" leave-to-class="opacity-0 rotate-90 scale-50"
            mode="out-in">
            <UIcon :key="chat.isChatOpen.value ? 'close' : 'open'"
               :name="chat.isChatOpen.value ? 'i-heroicons-x-mark' : 'i-heroicons-chat-bubble-left-right'"
               class="w-6 h-6" />
         </Transition>

         <span v-if="chat.unreadCount.value > 0 && !chat.isChatOpen.value"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
            {{ chat.unreadCount.value > 9 ? '9+' : chat.unreadCount.value }}
         </span>
      </button>
   </div>
</template>

<script setup lang="ts">
const chat = useChat()
const authStore = useAuthStore()
const inputText = ref('')
const messagesContainer = ref<HTMLElement>()

function scrollToBottom() {
   nextTick(() => {
      if (messagesContainer.value) {
         messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
   })
}

function handleToggle() {
   chat.toggleChat()
   if (chat.isChatOpen.value && authStore.isAuthenticated && !chat.isConnected.value) {
      chat.connect()
   }
}

function handleSend() {
   if (!inputText.value.trim()) return
   chat.sendMessage(inputText.value)
   inputText.value = ''
}

function formatTime(dateStr: string) {
   const date = new Date(dateStr)
   const today = new Date()
   const isToday = date.toDateString() === today.toDateString()

   if (isToday) {
      return date.toLocaleTimeString('vi-VN', {
         hour: '2-digit',
         minute: '2-digit',
      })
   }

   return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   })
}

watch(() => chat.messages.value.length, scrollToBottom)
watch(
   () => chat.isChatOpen.value,
   (open) => {
      if (open) scrollToBottom()
   }
)
watch(
   () => authStore.isAuthenticated,
   (logged) => {
      if (!logged) chat.disconnect()
   },
)
onUnmounted(() => chat.disconnect())
</script>