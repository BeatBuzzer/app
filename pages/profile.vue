<script setup lang="ts">
    import HeaderFooterView from "~/layouts/FooterView.vue";
</script>

<template>
    <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
        <HeaderFooterView>
            <template #content>
                <ProfileOverview/>
            </template>

            <template #footer>
                <div class="text-4xl">A</div>
                <div class="text-4xl">B</div>
                <div class="text-4xl">C</div>
            </template>
        </HeaderFooterView>
    </div>
</template>