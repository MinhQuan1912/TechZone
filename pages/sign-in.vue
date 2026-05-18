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

            <div>
                <div id="google-login-btn"></div>
                <div v-if="googleAuth.loading.value"
                    class="flex items-center justify-center gap-2 py-2 text-sm text-gray-500">
                    <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
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
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
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
    googleAuth.initGoogleButton('google-login-btn', async () => {
        const redirect = route.query.redirect as string
        await navigateTo(redirect || '/')
    })
})
onUnmounted(() => googleAuth.cleanup())

</script>

<style scoped></style>