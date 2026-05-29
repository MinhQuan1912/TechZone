<template>
    <div class="flex flex-col gap-10 w-full md:w-3/5 xl:w-100">
        <div class="flex flex-col gap-12">
            <div class="flex flex-col gap-6 text-black">
                <p class="text-4xl leading-7.5 font-medium tracking-[4%]">Đăng nhập TechZone</p>
                <p class="leading-6">Nhập thông tin chi tiết bên dưới</p>
            </div>
            <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
                <UFormField label="Email hoặc tên đăng nhập">
                    <UInput v-model="form.emailOrUsername" icon="i-heroicons-user-circle" class="w-full" size="xl"
                        :disabled="loading" autocomplete="username" />
                </UFormField>
                <UFormField label="Mật khẩu">
                    <UInput v-model="form.password" :type="showPass ? 'text' : 'password'"
                        icon="i-heroicons-lock-closed" class="w-full" size="xl" :disabled="loading"
                        :trailing-icon="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                        @click:trailing="showPass = !showPass">
                        <template #trailing>
                            <button type="button" @click="showPass = !showPass">
                                <UIcon :name="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                            </button>
                        </template>
                    </UInput>
                </UFormField>
            </form>
        </div>
        <div class="flex flex-col gap-4">
            <UAlert v-if="error" color="error" variant="soft" icon="i-heroicons-exclamation-circle"
                :description="error" />
            <div class="flex justify-between items-center">
                <NuxtLink to="/sign-up" class=" text-gray-500 hover:text-secondary-02">
                    Chưa có tài khoản? Đăng ký
                </NuxtLink>
                <NuxtLink to="/forgot-password" class="text-secondary-02 leading-6 hover:text-black">Quên mật khẩu?
                </NuxtLink>
            </div>
            <button
                class="h-14 px-12 bg-secondary-02 flex justify-center items-center font-medium leading-6 text-text rounded-sm hover:bg-secondary hover:text-secondary-02 hover:shadow-lg transition-colors duration-300 ease"
                @click="handleLogin">
                Đăng nhập
            </button>
            <div class="flex items-center gap-3">
                <div class="flex-1 h-px bg-gray-200" />
                <span class="text-xs text-gray-400 font-medium">HOẶC</span>
                <div class="flex-1 h-px bg-gray-200" />
            </div>

            <div class="relative w-full h-11 cursor-pointer">
                <div id="google-login-btn"
                    class="absolute inset-0 z-0 overflow-hidden rounded-sm [&>div]:!w-full [&_iframe]:!w-full" />

                <div class="absolute inset-0 z-10 pointer-events-none flex items-center justify-center gap-3
    border border-gray-300 rounded-sm bg-white">
                    <span v-if="googleAuth.loading.value"
                        class="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <svg v-else viewBox="0 0 24 24" class="w-5 h-5 shrink-0">
                        <path fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">
                        {{ googleAuth.loading.value ? 'Đang xử lý...' : 'Tiếp tục với Google' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authentication',
    middleware: 'guest'
})
useHead({ title: 'Đăng nhập' })
const authStore = useAuthStore()

const toast = useToast()
const route = useRoute()

const form = reactive({ emailOrUsername: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

const googleAuth = useGoogleAuth()

async function handleLogin() {
    if (!form.emailOrUsername || !form.password) {
        error.value = 'Vui lòng nhập đầy đủ thông tin'
        return
    }
    error.value = ''
    loading.value = true
    try {
        await authStore.login(form.emailOrUsername, form.password)
        toast.add({ title: 'Đăng nhập thành công!', color: 'success' })
        const redirect = route.query.redirect as string
        await navigateTo(redirect || '/')
    } catch (e: any) {
        error.value = e?.data?.message || 'Email/tên đăng nhập hoặc mật khẩu không đúng'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    googleAuth.initGoogleAuth(async () => {
        const redirect = route.query.redirect as string
        await navigateTo(redirect || '/')
    })
})
onUnmounted(() => googleAuth.cleanup())

</script>

<style scoped></style>