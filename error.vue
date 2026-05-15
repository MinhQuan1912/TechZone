<template>
    <div class="relative min-h-screen">
        <div class="fixed left-0 right-0 z-11 w-full">
            <LayoutHeader />
        </div>
        <div class="relative top-17.5 sm:top-29.5 md:top-35.5 right-0 left-0 w-full">
            <div class="py-35 gap-20 flex flex-col items-center justify-center">
                <div class="flex flex-col gap-10 items-center text-black">
                    <p class="text-[110px] leading-28.75 tracking-[3%] font-medium font-[Inter]">
                         {{ error?.message }}
                    </p>
                    <p class="leading-6">Your visited page not found. You may go home page.</p>
                </div>
                <NuxtLink to="/"
                    class="py-4 px-12 hover:shadow-lg text-text bg-secondary-02 hover:text-secondary-02 active:text-secondary-02 hover:bg-text active:bg-text rounded-sm">Back
                    to home page</NuxtLink>
            </div>
            <LayoutFooter />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
    error: NuxtError
}>()


</script>

<style scoped></style>
