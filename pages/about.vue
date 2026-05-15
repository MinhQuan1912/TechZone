<template>
    <div
        class="flex flex-col md:flex-row pt-10.5 xl:pl-33.75 px-3 xs:px-0 xs:container xs:mx-auto xl:max-w-full xl:mx-0 gap-10 lg:gap-18.75 items-center justify-between">

        <div class="flex flex-col gap-10 text-black flex-1 order-2 md:order-1">
            <p class="text-[54px] leading-16 font-medium tracking-[6%]">Câu chuyện của chúng tôi</p>

            <div class="flex flex-col gap-6 ">
                <p class="leading-6.5">
                    Được thành lập vào năm 2015, TechZone là một trong những nền tảng thương mại điện tử hàng đầu tại
                    Nam Á,
                    với sự hiện diện mạnh mẽ tại Bangladesh. Được hỗ trợ bởi các giải pháp tiếp thị, dữ liệu và dịch vụ
                    được
                    tùy chỉnh, TechZone hiện có hơn 10.500 người bán và 300 thương hiệu, phục vụ hơn 3 triệu khách hàng
                    trong khu vực.
                </p>

                <p class="leading-6.5">
                    TechZone cung cấp hơn 1 triệu sản phẩm và đang phát triển rất nhanh. Nền tảng mang đến danh mục đa
                    dạng
                    từ nhiều lĩnh vực khác nhau, đáp ứng nhu cầu tiêu dùng của khách hàng.
                </p>
            </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-55/100 order-1 md:order-2">
            <img src="/images/aboutUs/aboutUs.png" alt="about" class="w-full object-contain">
        </div>
    </div>
    <div class="px-3 xs:px-0 xs:container xs:mx-auto">
        <div class="py-15 lg:py-35 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-7.5">
            <template v-for="item in service1" :key="item.label">
                <div
                    class="item min-w-55 py-7.5 flex flex-col items-center gap-6 border border-black/30 rounded-sm hover:bg-secondary-02 active:bg-secondary-02 group transition-all duration-300 ease">

                    <div
                        class="h-20 w-20 border-11 border-primary-01/30 group-hover:border-white/30 flex justify-center items-center bg-black group-hover:bg-white bg-clip-content rounded-full text-text transition-all duration-300 ease">
                        <component :is="item.icon" class="group-hover:text-black transition-all duration-300 ease" />
                    </div>

                    <div
                        class="flex flex-col text-black transition-all duration-300 ease group-hover:text-text items-center gap-3">
                        <p class="text-[32px] leading-7.5 font-bold tracking-[4%]">
                            {{ formatNum(item.value) }}
                        </p>
                        <p class="leading-6">{{ item.label }}</p>
                    </div>
                </div>
            </template>
        </div>

        <div class="about-us">
            <swiper :modules="[Navigation, Pagination]"
                :pagination="({ clickable: true, el: '.custom-pagination' } as any)" :loop="true" :initial-slide="2"
                :autoplay="{ delay: 3000, disableOnInteraction: false }" :breakpoints="{
                    768: { slidesPerView: 2, spaceBetween: 30 },
                    1024: { slidesPerView: 3, spaceBetween: 30 }
                }">
                <swiper-slide v-for="cus in customer" :key="cus.name">
                    <div class="flex flex-col gap-8">
                        <div class="w-full h-107.5 cursor-pointer">
                            <img :src="cus.image" :alt="cus.name" class="object-cover w-full h-full">
                        </div>

                        <div class="flex flex-col gap-4 text-black">
                            <div class="flex flex-col gap-2">
                                <NuxtLink
                                    class="text-[32px] leading-7.5 font-medium cursor-pointer hover:text-secondary-02">
                                    {{ cus.name }}
                                </NuxtLink>
                                <p class="leading-6">{{ cus.job }}</p>
                            </div>

                            <div class="flex gap-4">
                                <a href="" class="hover:text-secondary-02"><icons-social-media-twitter /></a>
                                <a href="" class="hover:text-secondary-02"><icons-social-media-instagram /></a>
                                <a href="" class="hover:text-secondary-02"><icons-social-media-linkedin /></a>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>

            <div class="custom-pagination mt-10 flex items-center justify-center"></div>
        </div>

        <service />
    </div>
</template>

<script setup lang="ts">
import {
    LazyIconsAboutUsMoneyBag,
    LazyIconsAboutUsSale,
    LazyIconsAboutUsShop,
    LazyIconsAboutUsShoppingBag
} from '#components';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
const { formatNum } = useFormat()
useHead({ title: 'Về chúng tôi' })
const service1 = shallowRef([
    { label: 'Người dùng đang hoạt động', value: 10532, icon: LazyIconsAboutUsShop },
    { label: 'Sản phẩm bán mỗi tháng', value: 33012, icon: LazyIconsAboutUsSale },
    { label: 'Khách hàng đang hoạt động', value: 45542, icon: LazyIconsAboutUsShoppingBag },
    { label: 'Doanh thu hằng năm', value: 25042, icon: LazyIconsAboutUsMoneyBag },
])

const customer = ref([
    { name: 'Morgan Freeman', job: 'Diễn viên', image: '/images/aboutUs/morgan-freeman.png' },
    { name: 'Stan Lee', job: 'Cha đẻ Marvel Comics', image: '/images/aboutUs/stan-lee.png' },
    { name: 'Tom Cruise', job: 'Nhà sáng lập & Chủ tịch', image: '/images/aboutUs/tom-cruise.png' },
    { name: 'Emma Watson', job: 'Giám đốc điều hành', image: '/images/aboutUs/emma-watson.png' },
    { name: 'Will Smith', job: 'Nhà thiết kế sản phẩm', image: '/images/aboutUs/will-smith.png' },
])
</script>

<style lang="scss" scoped>
.item:hover {
    box-shadow: 0px 2px 10px 2px #00000033;
}
</style>
