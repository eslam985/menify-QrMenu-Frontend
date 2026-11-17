<script setup lang="ts">
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "rYTEb-Ob4kJMCp7tqf-aoMBDK9BpigLTl4n2T_h6WK8",
    },
  ],
});

useSeoMeta({
  title: "Tabloz | منيو إلكتروني ذكي للمطاعم والكافيهات عبر QR كود",
  description:
    "ودّع المنيوهات الورقية، وابدأ المستقبل مع Tabloz. أنشئ منيو إلكتروني تفاعلي لمطعمك أو الكافيه الخاص بك مع QR كود دائم ولوحة تحكم لحظية.",
  ogTitle: "Tabloz - منيو إلكتروني ذكي للمطاعم والكافيهات",
  ogDescription:
    "منيو إلكتروني تفاعلي عبر QR كود مع حاسبة فاتورة ذكية ولوحة تحكم كاملة لتعديل الأسعار والأصناف في ثوانٍ.",
  ogType: "website",
  ogLocale: "ar_AR",
  ogUrl: "https://tabloz-bice.vercel.app",
  twitterCard: "summary_large_image",
});

useSchemaOrg([
  defineWebSite({
    name: "Tabloz",
    description:
      "منصة إنشاء وإدارة المنيو الإلكتروني الذكي للمطاعم والكافيهات.",
    inLanguage: "ar",
  }),
  {
    "@type": "SoftwareApplication",
    name: "Tabloz",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EGP",
      description: "تجربة مجانية لأول شهر بالكامل",
    },
  },
]);
</script>

<template>
  <div class="bg-bg text-text flex min-h-screen flex-col justify-between">
    <main
      class="px-fluid p-section-fluid gap-section mx-auto my-auto flex w-full flex-col items-center text-center 2xl:max-w-[80%]"
    >
      <HomeHeroHome />

      <HomeRestaurants />

      <HomeSubscriptionPrices />

      <HomeFeaturesCards />
    </main>
  </div>
</template>
