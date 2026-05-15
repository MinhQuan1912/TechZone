<template>
   <div class="container mx-auto">
      <div class="flex justify-center">
         <div class="py-15 lg:py-35 flex flex-wrap gap-5 lg:gap-10 xl:gap-22 w-full  m:w-max">
            <template v-for="item in service" :key="item.content">
               <div class="w-full md:w-[calc(50%-10px)] m:w-76 flex m:flex-col justify-center items-center gap-5">
                  <div
                     class="w-20 h-20 rounded-full border-11 border-primary-01/30 bg-black bg-clip-content flex justify-center items-center text-text">
                     <component :is="item.icon" />
                  </div>
                  <div class="flex flex-col items-center gap-2 text-black">
                     <p class="text-xl leading-7 font-semibold">{{ item.label }}</p>
                     <p class="text-sm leading-5.25 ">{{ item.content }}</p>
                  </div>
               </div>
            </template>
         </div>
      </div>
   </div>

</template>

<script setup lang="ts">
import {
   IconsAboutUsCustomerService,
   IconsAboutUsDelivery,
   IconsAboutUsSecure,
} from '#components';
const service = shallowRef([
   {
      label: 'GIAO HÀNG NHANH & MIỄN PHÍ',
      content: 'Miễn phí giao hàng trên toàn quốc',
      icon: IconsAboutUsDelivery
   },
   {
      label: 'HỖ TRỢ KHÁCH HÀNG 24/7',
      content: 'Đội ngũ hỗ trợ thân thiện, phục vụ 24/7',
      icon: IconsAboutUsCustomerService
   },
   {
      label: 'HOÀN TIỀN ĐẢM BẢO',
      content: 'Hoàn tiền trong vòng 30 ngày',
      icon: IconsAboutUsSecure
   },
])
</script>

<style scoped></style>