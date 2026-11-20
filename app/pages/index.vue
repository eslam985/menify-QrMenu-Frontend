<script setup lang="ts">
import { useHomeSeo } from "~/composables/home/useHomeSeo";

useHomeSeo();
</script>

<template>
  <div class="bg-bg text-text flex min-h-screen flex-col justify-between">
    <main
      class="px-fluid p-section-fluid gap-section mx-auto my-auto flex w-full flex-col items-center text-center 2xl:max-w-[80%]"
    >
      <HomeHeroHome />

      <HomeFeaturesCards />

      <HomeRestaurants />

      <HomeSubscriptionPrices />
    </main>
  </div>
</template>
