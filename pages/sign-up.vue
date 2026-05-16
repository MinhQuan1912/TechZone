<template>
    <div class="flex flex-col gap-12 w-full md:w-3/5 xl:w-auto">
        <div class="flex flex-col gap-6 text-black">
            <p class="text-4xl leading-7.5 font-medium">Đăng ký tài khoản</p>
            <p class="leading-6">Nhập thông tin bên dưới</p>
        </div>
        <div class="flex flex-col gap-10">
            <form class="space-y-4" @submit.prevent="handleRegister">
                <UFormField label="Tên đăng nhập">
                    <div class="relative">
                        <UInput v-model="form.username" placeholder="nguyenvana_123" icon="i-heroicons-at-symbol"
                            class="w-full" size="lg" :disabled="loading" autocomplete="username"
                            @input="onUsernameInput" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div v-if="form.username && usernameState.checking"
                                class="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                            <UIcon v-else-if="form.username && usernameState.available === true"
                                name="i-heroicons-check-circle-solid" class="w-5 h-5 text-green-500" />
                            <UIcon v-else-if="form.username && usernameState.available === false"
                                name="i-heroicons-x-circle-solid" class="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                    <template #help>
                        <span v-if="form.username && usernameState.available === true" class="text-green-600 text-xs">
                            Tên đăng nhập có thể dùng
                        </span>
                        <span v-else-if="form.username && usernameState.available === false"
                            class="text-red-500 text-xs">
                            {{ usernameState.message }}
                        </span>
                        <span v-else-if="form.username" class="text-gray-400 text-xs">
                            3-30 ký tự, chỉ chữ, số và dấu gạch dưới (_)
                        </span>
                    </template>
                </UFormField>

                <UFormField label="Họ và tên">
                    <UInput v-model="form.name" placeholder="Nguyễn Văn A" icon="i-heroicons-user" class="w-full"
                        size="lg" :disabled="loading" />
                </UFormField>

                <UFormField label="Email">
                    <UInput v-model="form.email" type="email" placeholder="email@example.com"
                        icon="i-heroicons-envelope" class="w-full" size="lg" :disabled="loading" autocomplete="email" />
                </UFormField>

                <UFormField label="Mật khẩu">
                    <UInput v-model="form.password" :type="showPass ? 'text' : 'password'"
                        placeholder="Tối thiểu 6 ký tự" icon="i-heroicons-lock-closed" class="w-full" size="lg"
                        @input="updateStrength">
                        <template #trailing>
                            <button type="button" @click="showPass = !showPass">
                                <UIcon :name="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                            </button>
                        </template>
                    </UInput>
                    <div v-if="form.password" class="mt-2">
                        <div class="flex gap-1 h-1 mb-1">
                            <div v-for="i in 4" :key="i" class="flex-1 rounded-full transition-all duration-300"
                                :class="i <= strength.level ? strength.color : 'bg-gray-200'"></div>
                        </div>
                        <p class="text-xs" :class="strength.textColor">{{ strength.label }}</p>
                    </div>
                </UFormField>

                <UFormField label="Xác nhận mật khẩu">
                    <UInput v-model="form.confirm" :type="showPass ? 'text' : 'password'"
                        placeholder="Nhập lại mật khẩu" icon="i-heroicons-lock-closed" class="w-full" size="lg"
                        :disabled="loading">
                        <template #trailing>
                            <button type="button" @click="showPass = !showPass">
                                <UIcon :name="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                            </button>
                        </template>
                    </UInput>
                    <template v-if="form.confirm && form.password !== form.confirm" #help>
                        <span class="text-red-500 text-xs">Mật khẩu không khớp</span>
                    </template>
                </UFormField>
                <UAlert v-if="error" color="error" variant="soft" :description="error" />
            </form>
            <div class="flex flex-col gap-4">
                <button type="submit" class="h-14 bg-secondary-02 flex justify-center items-center font-medium leading-6 
         hover:bg-secondary hover:text-secondary-02 transition-all ease-300 
         hover:shadow-lg text-text rounded-sm" :disabled="!canSubmit || loading" @click="handleRegister">
                    <span v-if="!loading">Đăng ký tài khoản</span>
                    <span v-else>Đang xử lý...</span>
                </button>
                <div class="flex flex-col gap-8 items-center">
                    <div class="h-7 flex gap-4 items-center">
                        <p class="text-black leading-6">Đã có tài khoản?</p>
                        <NuxtLink to="/sign-in"
                            class="h-full font-medium leading-6 opacity-70 border-b hover:text-secondary-02 hover:border-secondary-02">
                            Đăng
                            nhập</NuxtLink>
                    </div>
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
useHead({ title: 'Đăng ký' })
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const toast = useToast()
const { api } = useApi()

const form = reactive({ username: '', name: '', email: '', password: '', confirm: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

const googleAuth = useGoogleAuth()

const usernameState = reactive({
    checking: false,
    available: null as boolean | null,
    message: '',
})

let usernameTimer: ReturnType<typeof setTimeout>

function onUsernameInput() {
    usernameState.available = null
    if (usernameTimer) clearTimeout(usernameTimer)

    const val = form.username.trim()
    if (!val) {
        usernameState.checking = false
        usernameState.available = null
        usernameState.message = ''
        return
    }

    if (val.length < 3) {
        usernameState.available = false
        usernameState.message = 'Tối thiểu 3 ký tự'
        return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
        usernameState.available = false
        usernameState.message = 'Chỉ dùng chữ, số và dấu _'
        return
    }

    usernameState.checking = true
    usernameTimer = setTimeout(async () => {
        try {
            await api('/auth/check-username', {
                method: 'POST',
                body: { username: val },
                server: true,
            })
            usernameState.available = true
        } catch (e: any) {
            usernameState.available = false
            usernameState.message = e?.data?.message || 'Tên đăng nhập đã tồn tại'
        } finally {
            usernameState.checking = false
        }
    }, 500)
}

const strength = reactive({
    level: 0, label: '', color: 'bg-gray-200', textColor: 'text-gray-400',
})

function updateStrength() {
    const p = form.password
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
    const index = Math.min(level, map.length - 1)

    strength.level = level
    Object.assign(strength, {
        level,
        ...map[index]
    })
}

const canSubmit = computed(() =>
    form.username && form.name && form.email &&
    form.password && form.password === form.confirm &&
    usernameState.available !== false && !loading.value
)

async function handleRegister() {
    error.value = ''
    if (form.password !== form.confirm) {
        error.value = 'Mật khẩu xác nhận không khớp'
        return
    }
    loading.value = true
    try {
        await authStore.register(form.email, form.name, form.password, form.username)
        toast.add({ title: 'Đăng ký thành công!',description: 'Vui lòng đăng nhập để tiếp tục', color: 'success' })
        await navigateTo('/sign-in')
    } catch (e: any) {
        error.value = e?.data?.message || 'Đăng ký thất bại'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    googleAuth.initGoogleButton('google-register-btn')
})

onUnmounted(() => {
    googleAuth.cleanup()
    if (usernameTimer) clearTimeout(usernameTimer)
})
</script>

<style scoped></style>