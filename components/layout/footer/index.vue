<template>
  <div class=" bg-black text-text">
    <div class="px-3 m:px-0 m:container m:mx-auto">
      <div class="pt-5 lg:pt-20 pb-5 lg:pb-15 gap-4 lg:gap-0 flex flex-wrap lg:flex-nowrap justify-between">
        <div class="flex flex-col gap-4 w-[calc(50%-8px)] lg:w-auto">
          <div class="flex flex-col gap-6">
            <p class="text-2xl font-bold leading-6 tracking-[3%]">TechZone</p>
            <p class="text-xl leading-7 font-medium">Đăng ký</p>
          </div>
          <div
            class="xs:w-54.25 p-3 pl-4 flex justify-between items-center gap-2 border-[1.5px] rounded-sm border-text h-12">
            <input type="text"
              class="leading-6 placeholder-transparent xs:placeholder-text  placeholder:opacity-40 w-20 xs:w-38.5"
              placeholder="Nhập email">
            <icons-send-mail class="cursor-pointer hover:text-secondary-02 transition-colors duration-300 ease" />
          </div>
        </div>
        <div class="flex flex-col gap-6 w-[calc(50%-8px)] lg:w-auto">
          <p class="text-xl leading-7 font-medium">Hỗ trợ</p>
          <div class="flex flex-col justify-between gap-4">
            <p class="leading-6"> Đường Nghiêm Xuân Yêm, P.<br /> Đại Kim, Q. Hoàng Mai, TP. Hà Nộ</p>
            <a href="mailto:exclusive@gmail.com" class="leading-6 hover:text-secondary-02 ease">techzone@gmail.com</a>
            <a href="tel:+88015-88888-9999" class="leading-6 hover:text-secondary-02 ease">+88015-88888-9999</a>
          </div>
        </div>
        <div class="flex flex-col gap-6 w-[calc(50%-8px)] lg:w-auto">
          <p class="text-xl leading-7 font-medium">Tài khoản</p>
          <div class="flex flex-col justify-between gap-4">
            <template v-for="item in account">
              <NuxtLink :to="item.to" class="leading-6 hover:text-secondary-02">{{ item.label }}</NuxtLink>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-6 w-[calc(50%-8px)] lg:w-auto">
          <p class="text-xl leading-7 font-medium">Quick Link</p>
          <div class="flex flex-col justify-between gap-4">
            <template v-for="item in quickLink">
              <NuxtLink :to="item.to" class="leading-6 hover:text-secondary-02">{{ item.label }}</NuxtLink>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-6 w-full lg:w-auto">
          <p class="text-xl leading-7 font-medium">Tải ứng dụng</p>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2 justify-evenly lg:justify-between">
              <div class="w-40 h-40 lg:w-20 lg:h-20">
                <img src="/images/QR.png" class="object-contain" alt="QR Code" />
              </div>
              <div class="flex flex-col md:flex-row lg:flex-col gap-1 justify-center items-center">
                <a href="" class="h-15 md:h-25 lg:h-10 aspect-11/4">
                  <img src="/images/GooglePlay.png" alt="Google Play" class=" w-full" />
                </a>
                <a href="" class="h-15 md:h-25 lg:h-10 aspect-11/4">
                  <img src="/images/AppStore.png" alt="App Store" class="object-fill w-full" />
                </a>
              </div>
            </div>
          </div>
          <div class="flex gap-6">
            <template v-for="item in socialMedia">
              <a :href="item.to" class="hover:text-secondary-02">
                <component :is="item.label" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IconsSocialMediaFacebook, IconsSocialMediaInstagram, IconsSocialMediaLinkedin, IconsSocialMediaTwitter } from '#components';

const account = ref([
  { label: 'Tài khoản của tôi', to: '/account' },
  { label: 'Đăng nhập / Đăng ký', to: '/sign-in' },
  { label: 'Giỏ hàng', to: '/cart' },
  { label: 'Yêu thích', to: '/wishlist' },
  { label: 'Sản phẩm', to: '/products' },
])
const quickLink = ref([
  { label: 'Chính sách bảo mật', to: '/' },
  { label: 'Điều khoản sử dụng', to: '/' },
  { label: 'FAQ', to: '/' },
  { label: 'Liên hệ', to: '/' },
  { label: 'Về chúng tôi', to: '/about' },
])
const socialMedia = ref([
  { label: markRaw(IconsSocialMediaFacebook), to: '/' },
  { label: markRaw(IconsSocialMediaTwitter), to: '/daw' },
  { label: markRaw(IconsSocialMediaInstagram), to: '/dwa' },
  { label: markRaw(IconsSocialMediaLinkedin), to: '/dwd' },
])
</script>
