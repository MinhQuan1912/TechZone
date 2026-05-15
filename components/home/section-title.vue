<template>
   <div class="flex flex-col gap-5">
      <div class="flex gap-4 items-center">
         <div class="w-5 h-10 bg-secondary-02 rounded-sm"></div>
         <p class="text-secondary-02 text-[32px] leading-5 font-semibold">{{ title }}</p>
      </div>
      <p class="text-3xl xs:text-4xl leading-12 font-semibold tracking-[4%]">{{ subTitle }}</p>
   </div>
</template>

<script setup lang="ts">
defineProps({
   title: {
      type: String,
      require: true
   },
   subTitle: {
      type: String,
      require: true
   }
})
</script>

<style scoped></style>