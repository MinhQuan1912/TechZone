<template>
    <div class="relative min-h-screen">
        <div class="fixed left-0 right-0 z-11 w-full">
            <LayoutHeader />
        </div>
        <div class="relative top-17.5 sm:top-29.5 md:top-35.5 right-0 left-0 w-full">
            <div
                class="pt-10 px-3 xs:px-10 xl:pl-0 xl:pr-33.75 pb-10 xs:pb-35 flex items-center justify-center md:justify-between gap-8">
                <div class="xl:h-full w-3/5 hidden md:flex items-center">
                    <img src="/images/sign-up.png" class="object-contain" alt="sign-up">
                </div>
                <slot />
            </div>
            <LayoutFooter />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>