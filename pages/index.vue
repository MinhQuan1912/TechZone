<template>
    <div class=" m:container m:mx-auto flex justify-center">
        <div class="pt-10 banner w-full overflow-hidden">
            <ClientOnly>
                <swiper :modules="[Pagination, Autoplay, Navigation]" :slides-per-view="1" :loop="true"
                    :pagination="{ clickable: true }" :initial-slide="2"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }">
                    <swiper-slide v-for="item in bannerStore.banners" :key="item.id">
                        <NuxtLink class="flex items-center h-120 " :to="`/products/${item.product.slug}`">
                            <img :src="item.imageUrl" :alt="item.product.name"
                                class="w-full h-full object-cover rounded-xl">
                        </NuxtLink>
                    </swiper-slide>
                </swiper>
            </ClientOnly>
        </div>
    </div>
    <div class="m:container mx-auto px-4 sm:px-6 py-10">
        <HomeSectionTitle title="Danh mục sản phẩm" />
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <NuxtLink v-for="cat in categoryStore.categories" :key="cat.id" :to="`/products?categoryId=${cat.id}`"
                class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-secondary-02 transition-all">
                <img :src="cat.imageUrl" class="object-cover w-12 h-12" />
                <span class="text-xs font-medium text-gray-700 text-center leading-tight">
                    {{ cat.name }}
                </span>
            </NuxtLink>
        </div>
    </div>
    <div class="m:container mx-auto px-4 sm:px-6 py-6">
        <div class="flex items-center justify-between mb-5">
            <HomeSectionTitle title="Top bán chạy" />
        </div>
        <div v-if="productStore.topSelling.length"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ProductCard v-for="p in productStore.topSelling" :key="p.id" :product="p" />
        </div>
        <CommonAppEmpty v-else title="Chưa có sản phẩm" />
    </div>

    <div class="m:container mx-auto px-4 sm:px-6 py-6 pb-12">
        <div class="flex items-center justify-between mb-5">
            <HomeSectionTitle title="Hàng mới về" />
        </div>
        <div v-if="productStore.newArrivals.length"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ProductCard v-for="p in productStore.newArrivals" :key="p.id" :product="p" />
        </div>
        <CommonAppEmpty v-else title="Chưa có sản phẩm" />
    </div>
    <service />
</template>

<script setup lang="ts">
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
useHead({ title: 'TechZone' })
const productStore = useProductStore()
const bannerStore = useBannerStore()
const categoryStore = useCategoryStore()
await Promise.all([
    useAsyncData('top-selling', () => productStore.fetchTopSelling()),
    useAsyncData('new-arrivals', () => productStore.fetchNewArrivals()),
    useAsyncData('banners', () => bannerStore.fetchBanners()),
    useAsyncData('categories', () => useCategoryStore().fetchCategories()),
])


</script>