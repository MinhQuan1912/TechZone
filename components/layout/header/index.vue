<template>
  <div class="bg-white sticky top-0 z-5">
    <div class="h-12 bg-secondary-02 hidden sm:flex items-center fixed top-0 left-0 w-full z-50 
           transition-all duration-500 ease"
      :class="scrollY > 50 ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'">
      <div class="px-3 m:px-0 m:container m:mx-auto w-full h-8 relative flex items-center">
        <div class="absolute inset-0 flex items-center overflow-hidden">
          <div class="marketing-marquee">
            <div v-for="(item, index) in [...marketing, ...marketing]" :key="index" class="marketing-item">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="pt-4 md:pt-10 pb-4 border-b-[0.5px] border-black/30 bg-white w-full sticky top-0 transition-all duration-500 ease"
      :class="scrollY > 50 ? 'pt-4!' : 'sm:pt-22!'">
      <div class="px-3 m:px-0 m:container m:mx-auto">
        <div class="flex items-center justify-between h-9.5 gap-6 xs:gap-10">
          <NuxtLink to="/">
            <img src="/images/logo.png" alt="logo" class="object-cover h-16" />
          </NuxtLink>
          <div class="relative flex-1" ref="searchContainer">
            <div class="flex justify-between items-center gap-4 bg-secondary pl-3 xs:pl-5 pr-3 h-9.5 rounded-sm">
              <input v-model="searchQuery" type="text" autocomplete="off"
                class="text-xs leading-4.5 opacity-50 text-black w-30 md:w-43 md:flex-1 placeholder-transparent md:placeholder-black focus:placeholder-transparent focus:outline-none bg-transparent"
                placeholder="Bạn muốn mua gì hôm nay?" @input="onInput" @focus="onFocus" />
              <icons-search class="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer shrink-0" @click="doSearchNavigate" />
            </div>
            <Transition enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1">
              <div v-if="dropdownOpen && searchQuery.length >= 1"
                class="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl">
                <div v-if="searching" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-500">
                  <div class="w-4 h-4 border-2 border-secondary-02 border-t-transparent rounded-full animate-spin" />
                  Đang tìm kiếm...
                </div>
                <div v-else-if="suggestions.length === 0"
                  class="px-4 py-6 flex justify-center items-center gap-2 text-center text-sm text-gray-400">
                  <icons-search class="w-8 h-8 text-gray-300" />
                  Không tìm thấy sản phẩm nào
                </div>
                <template v-else>
                  <ul class="py-1">
                    <li v-for="(product, idx) in suggestions.slice(0, 4)" :key="product.id"
                      class="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors"
                      :class="highlightedIndex === idx ? 'bg-secondary/60' : 'hover:bg-secondary/40'"
                      @click="selectProduct(product)" @mouseenter="highlightedIndex = idx">
                      <img v-if="product.images?.[0]?.url" :src="product.images[0].url" :alt="product.name"
                        class="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div v-else class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <icons-search class="w-5 h-5 text-gray-400" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span class="text-xs text-gray-500">{{ product.brand }}</span>
                          <span class="text-gray-300">·</span>
                          <span class="text-xs text-gray-500">{{ product.category?.name }}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div v-if="suggestions.length > 4" class="border-t border-gray-100">
                    <button
                      class="w-full px-4 py-2.5 text-sm text-secondary-02 font-medium hover:bg-secondary/40 transition-colors flex items-center justify-center gap-2"
                      @click="doSearchNavigate">
                      Xem tất cả kết quả cho
                      <span class="font-semibold">"{{ searchQuery }}"</span>
                      <icons-search class="w-4 h-4" />
                    </button>
                  </div>
                </template>
              </div>
            </Transition>
          </div>

          <div class="flex justify-between gap-2 m:gap-6 items-center h-7 m:h-full">
            <button v-if="!authStore.isAuthenticated && route.path !== '/sign-in' && route.path !== '/sign-up'"
              @click="router.push('/sign-in')"
              class="hidden md:flex whitespace-nowrap items-center justify-center text-xs px-3 h-full rounded-sm bg-secondary-02 text-white hover:bg-secondary hover:text-secondary-02 transition-colors duration-300 ease">
              Đăng nhập
            </button>

            <div v-if="authStore.isAuthenticated" class="hidden md:flex justify-between gap-2 m:gap-4 items-center">
              <NuxtLink to="/wishlist">
                <icons-wishlist class="h-6 w-6 m:h-8 m:w-8 hover:text-secondary-02 transition-all duration-300 ease" />
              </NuxtLink>
              <NuxtLink to="/cart" class="relative">
                <icons-cart class="h-6 w-6 m:h-8 m:w-8 hover:text-secondary-02 transition-all duration-300 ease" />
                <Transition enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-50" enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-50">
                  <span v-if="cartStore.items.length > 0" class="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1
             bg-red-500 text-white text-[10px] font-bold rounded-full
             flex items-center justify-center leading-none">
                    {{ cartStore.items.length > 99 ? '99+' : cartStore.items.length }}
                  </span>
                </Transition>
              </NuxtLink>
              <div class="group relative inline-block cursor-pointer">
                <icons-header-user class="transition-all duration-300 group-hover:opacity-0 ease" />
                <icons-header-user2
                  class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease" />
                <div
                  class="absolute top-9 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-300 ease pt-4.5 pb-2.5 flex flex-col gap-3 rounded-sm bg-gray-500">
                  <template v-for="item in accountDropdown" :key="item.label">
                    <button v-if="item.type === 'action'" @click="item.action?.()"
                      class="pl-5 pr-3 flex gap-4 h-6 items-center text-text w-full text-left hover:text-red-400 transition-all duration-300 ease">
                      <component :is="item.icon" class="h-6 w-6 shrink-0" />
                      <p class="whitespace-nowrap text-sm leading-5.25">{{ item.label }}</p>
                    </button>
                    <NuxtLink v-else :to="item.to"
                      class="pl-5 pr-3 flex gap-4 h-6 items-center text-text transition-all hover:text-red-400 duration-300 ease">
                      <component :is="item.icon" class="h-6 w-6 shrink-0" />
                      <p class="whitespace-nowrap text-sm leading-5.25">{{ item.label }}</p>
                    </NuxtLink>
                  </template>
                </div>
              </div>
            </div>

            <button
              class="flex md:hidden w-8 h-8 rounded-lg justify-center items-center bg-gray-200 active:text-white active:bg-black">
              <icons-menu-header class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LazyIconsHeaderLogOut, LazyIconsHeaderMallbag, LazyIconsHeaderUser } from '#components'
const { y } = useWindowScroll()
const scrollY = computed(() => y.value)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const toast = useToast()

const marketing = ref([
  'Theo dõi fanpage để nhận mã giảm giá mới nhất',
  'Giao hàng nhanh - Kiểm tra hàng trước khi thanh toán',
  'Mua sắm thông minh - Công nghệ dẫn đầu',
  'Hỗ trợ kỹ thuật tận tâm 24/7',
  'Tai nghe, loa Bluetooth ưu đãi cực hấp dẫn',
])

const accountDropdown = shallowRef([
  { label: 'Thông tin cá nhân', icon: LazyIconsHeaderUser, to: '/account', type: 'link' },
  { label: 'Đơn hàng', icon: LazyIconsHeaderMallbag, to: '/orders', type: 'link' },
  { label: 'Đăng xuất', icon: LazyIconsHeaderLogOut, action: handleLogout, type: 'action' },
])

const searchQuery = ref((route.query.search as string) || '')
const suggestions = ref<any[]>([])
const searching = ref(false)
const dropdownOpen = ref(false)
const highlightedIndex = ref(-1)
const searchContainer = ref<HTMLElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput() {
  dropdownOpen.value = true
  highlightedIndex.value = -1
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!searchQuery.value.trim()) {
    suggestions.value = []
    return
  }
  debounceTimer = setTimeout(fetchSuggestions, 300)
}

function onFocus() {
  if (searchQuery.value.length >= 1) dropdownOpen.value = true
}

async function fetchSuggestions() {
  if (!searchQuery.value.trim()) return
  searching.value = true
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string;
  try {
    const res = await $fetch<any>('/products', {
      baseURL,
      credentials: 'include',
      query: { search: searchQuery.value, limit: 5 },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
    suggestions.value = res.data.products || []
  } catch {
    suggestions.value = []
  } finally {
    searching.value = false
  }
}


function closeDropdown() {
  dropdownOpen.value = false
  highlightedIndex.value = -1
}

function selectProduct(product: any) {
  closeDropdown()
  searchQuery.value = ''
  suggestions.value = []
  navigateTo(`/products/${product.slug}`)
}

function doSearchNavigate() {
  if (!searchQuery.value.trim()) return
  closeDropdown()
  navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`)
}

function handleClickOutside(e: MouseEvent) {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

watch(() => route.query.search, (val) => {
  searchQuery.value = (val as string) || ''
})

async function handleLogout() {
  await authStore.logout()
  cartStore.items = []
  wishlistStore.items = []
  toast.add({ title: 'Đã đăng xuất', color: 'info' })
  await navigateTo('/')
}
</script>

<style scoped>
.marketing-marquee {
  display: flex;
  align-items: center;
  width: max-content;
  animation: marquee 22s linear infinite;
  gap: 0;
}

.marketing-item {
  white-space: nowrap;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-left: 2rem;
  padding-right: 2rem;
  position: relative;
}

.marketing-item::after {
  content: "•";
  opacity: 0.5;
  font-size: 16px;
  position: absolute;
  right: -3px;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  display: flex;
  align-items: center;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>