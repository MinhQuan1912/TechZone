<template>
   <div class="flex flex-col gap-10 w-full md:w-3/5 xl:w-auto">

      <div v-if="step === 'email'" class="flex flex-col gap-12">
         <div class="flex flex-col gap-6 text-black">
            <p class="text-4xl font-medium tracking-[4%]">Quên mật khẩu</p>
            <p class="leading-6 text-gray-500">Nhập email đã đăng ký — chúng tôi sẽ gửi mã 6 số</p>
         </div>
         <div class="flex flex-col gap-6">
            <UFormField label="Email của bạn">
               <UInput v-model="email" type="email" icon="i-heroicons-envelope" class="w-full" :disabled="loading" />
            </UFormField>
            <UAlert v-if="error" color="error" variant="soft" :description="error" />
            <button class="h-14 px-12 bg-secondary-02 text-white flex justify-center items-center font-medium rounded-sm
          hover:bg-secondary hover:text-secondary-02 transition-colors disabled:opacity-50"
               :disabled="loading || !email.trim()" @click="handleSendCode">
               <span v-if="loading" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-white" />
                  Đang gửi...
               </span>
               <span v-else>Gửi mã xác nhận</span>
            </button>
         </div>
      </div>
      <div v-if="step === 'verify'" class="flex flex-col gap-12">
         <div class="flex flex-col gap-6 text-black">
            <p class="text-4xl font-medium tracking-[4%]">Nhập mã xác nhận</p>
            <p class="leading-6 text-gray-500">
               Mã 6 số đã được gửi đến <strong>{{ email }}</strong>
            </p>
         </div>
         <div class="flex flex-col gap-6">
            <UFormField label="Mã xác nhận">
               <UInput v-model="code" placeholder="Nhập mã 6 số" maxlength="6" icon="i-heroicons-key" class="w-full"
                  :disabled="loading" />
            </UFormField>
            <UAlert v-if="error" color="error" variant="soft" :description="error" />
            <div class="flex justify-between items-center text-sm">
               <button class="text-gray-500 hover:text-secondary-02" @click="backToEmail">
                  Đổi email
               </button>
               <button v-if="countdown > 0" class="text-gray-400" disabled>
                  Gửi lại sau {{ countdown }}s
               </button>
               <button v-else class="text-secondary-02 hover:text-black" @click="handleResend">
                  Gửi lại mã
               </button>
            </div>
            <button class="h-14 px-12 bg-secondary-02 text-white flex justify-center items-center font-medium rounded-sm
          hover:bg-secondary hover:text-secondary-02 transition-colors disabled:opacity-50"
               :disabled="loading || code.length !== 6" @click="handleVerifyCode">
               <span v-if="loading" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-white" />
                  Đang xác nhận...
               </span>
               <span v-else >Xác nhận mã</span>
            </button>
         </div>
      </div>
      <div v-if="step === 'reset'" class="flex flex-col gap-12">
         <div class="flex flex-col gap-6 text-black">
            <p class="text-4xl font-medium tracking-[4%]">Đặt lại mật khẩu</p>
            <p class="leading-6 text-gray-500">Nhập mật khẩu mới cho tài khoản của bạn</p>
         </div>
         <div class="flex flex-col gap-6">
            <UFormField label="Mật khẩu mới">
               <UInput v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Tối thiểu 6 ký tự"
                  icon="i-heroicons-lock-closed" class="w-full">
                  <template #trailing>
                     <button type="button" @click="showPass = !showPass">
                        <UIcon :name="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                     </button>
                  </template>
               </UInput>
               <div v-if="password" class="mt-2">
                  <div class="flex gap-1 h-1 mb-1">
                     <div v-for="i in 4" :key="i" class="flex-1 rounded-full transition-all duration-300"
                        :class="i <= strength.level ? strength.color : 'bg-gray-200'" />
                  </div>
                  <p class="text-xs" :class="strength.textColor">{{ strength.label }}</p>
               </div>
            </UFormField>
            <UFormField label="Xác nhận mật khẩu">
               <UInput v-model="confirm" :type="showPass ? 'text' : 'password'" placeholder="Nhập lại mật khẩu"
                  icon="i-heroicons-lock-closed" class="w-full" />
               <template v-if="confirm && password !== confirm" #help>
                  <span class="text-red-500 text-xs">Mật khẩu không khớp</span>
               </template>
            </UFormField>
            <UAlert v-if="error" color="error" variant="soft" :description="error" />
            <button class="h-14 px-12 bg-secondary-02 text-white flex justify-center items-center font-medium rounded-sm
          hover:bg-secondary hover:text-secondary-02 transition-colors disabled:opacity-50"
               :disabled="loading || !canSubmit" @click="handleReset">
               <span v-if="loading" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-white" />
                  Đang xử lý...
               </span>
               <span v-else>Đặt lại mật khẩu</span>
            </button>
         </div>
      </div>
      <div v-if="step === 'done'" class="flex flex-col gap-6">
         <UAlert color="success" variant="soft" icon="i-heroicons-check-circle" title="Thành công!"
            description="Mật khẩu đã được đặt lại. Bạn có thể đăng nhập ngay." />
         <NuxtLink to="/sign-in" class="h-14 px-12 bg-secondary-02 text-white flex justify-center items-center
        font-medium rounded-sm hover:bg-secondary hover:text-secondary-02 transition-colors">
            Đăng nhập ngay
         </NuxtLink>
      </div>
      <NuxtLink v-if="step !== 'done'" to="/sign-in"
         class="text-gray-500 hover:text-secondary-02 flex items-center gap-1 text-sm">
         <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
         Quay lại đăng nhập
      </NuxtLink>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'authentication',
   middleware: 'guest',
})

const { api } = useApi()
const toast = useToast()

const step = ref<'email' | 'verify' | 'reset' | 'done'>('email')
const email = ref('')
const code = ref('')
const password = ref('')
const confirm = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref('')
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval>

const canSubmit = computed(() =>
   password.value.length >= 6 && password.value === confirm.value
)

const strength = computed(() => {
   const p = password.value
   let level = 0
   if (p.length >= 6) level++
   if (p.length >= 10) level++
   if (/[A-Z]/.test(p) && /[0-9]/.test(p)) level++
   if (/[^A-Za-z0-9]/.test(p)) level++
   const map = [
      { label: 'Rất yếu', color: 'bg-red-500', textColor: 'text-red-500' },
      { label: 'Yếu', color: 'bg-orange-400', textColor: 'text-orange-500' },
      { label: 'Trung bình', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
      { label: 'Mạnh', color: 'bg-green-400', textColor: 'text-green-600' },
      { label: 'Rất mạnh', color: 'bg-green-600', textColor: 'text-green-700' },
   ]
   return { level, ...(map[Math.max(0, level - 1)] || map[0]) }
})

async function handleSendCode() {
   if (!email.value.trim()) return
   error.value = ''
   loading.value = true
   try {
      await api('/auth/forgot-password', {
         method: 'POST',
         body: { email: email.value.trim() },
      })
      step.value = 'verify'
      startCountdown()
      toast.add({ title: 'Đã gửi mã xác nhận!', color: 'success' })
   } catch (e: any) {
      error.value = e?.data?.message || 'Không tìm thấy email này'
   } finally {
      loading.value = false
   }
}

async function handleVerifyCode() {
   if (code.value.length !== 6) return
   error.value = ''
   loading.value = true
   try {
      await api('/auth/verify-reset-code', {
         method: 'POST',
         body: { token: code.value },
      })
      step.value = 'reset'
      toast.add({ title: 'Mã xác nhận hợp lệ!', color: 'success' })
   } catch (e: any) {
      error.value = e?.data?.message || 'Mã không đúng hoặc đã hết hạn'
   } finally {
      loading.value = false
   }
}

async function handleReset() {
   if (!canSubmit.value) return
   error.value = ''
   loading.value = true
   try {
      await api('/auth/reset-password', {
         method: 'POST',
         body: { token: code.value, newPassword: password.value },
      })
      step.value = 'done'
   } catch (e: any) {
      error.value = e?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại'
      if (e?.status === 400) step.value = 'verify'
   } finally {
      loading.value = false
   }
}

async function handleResend() {
   code.value = ''
   error.value = ''
   await handleSendCode()
}

function backToEmail() {
   step.value = 'email'
   code.value = ''
   error.value = ''
   clearInterval(countdownTimer)
}

function startCountdown() {
   countdown.value = 60
   clearInterval(countdownTimer)
   countdownTimer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) clearInterval(countdownTimer)
   }, 1000)
}

onUnmounted(() => clearInterval(countdownTimer))
</script>