<script setup lang="ts">
const { siteName } = useBrand();
</script>

<template>
  <div class="gap-fluid my-section-fluid flex max-w-3xl flex-col">
    <h1 class="text-fluid-h1 leading-tight font-black tracking-tighter">
      ودّع المنيوهات الورقية، <br />
      <span class="text-primary">وابدأ المستقبل مع {{ siteName }}</span>
    </h1>
    <p class="text-text text-fluid-p mx-auto leading-relaxed">
      وفر لعملائك تجربة تصفح سريعة ومرنة، وعدّل أسعارك أو أصناف طعامك او
      مشروباتك في ثوانٍ معدودة دون الحاجة لإعادة طباعة المنيو الورقي أبداً.
    </p>
  </div>
</template>
