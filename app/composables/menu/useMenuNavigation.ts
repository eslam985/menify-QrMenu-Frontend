/**
 * Composable مخصص للتحكم في التنقل بين أقسام المنيو وتثبيت شريط الأقسام (Sticky Navigation)
 * يعتمد على قياس موضع الشريط ديناميكياً بالنسبة للشاشة لتفادي أي أرقام ثابتة (Hardcoded Scroll)
 * مهما اختلف ارتفاع سكشن العروض أو الهيرو في الأعلى
 */
export const useMenuNavigation = (sentinelId = "category-tabs-sentinel") => {
  const isSticky = ref(false);
  const activeCategory = ref<string | number | null>(null);

  /**
   * حساب موضع التثبيت ديناميكياً بالكامل
   */
  const handleScroll = () => {
    if (!import.meta.client) return;

    // جلب نقطة الارتكاز (Sentinel) المحددة في الـ DOM
    const target = document.getElementById(sentinelId);
    if (!target) return;
    
    // حساب المسافة الحقيقية للقسم من أعلى الشاشة
    // عندما يصل إلى أعلى نافذة العرض (<= 0)، يتم تفعيل التثبيت
    const rect = target.getBoundingClientRect();
    isSticky.value = rect.top <= 0;
  };

  /**
   * التمرير السلس إلى قسم محدد
   */
  const scrollToCategory = (categoryId: string | number) => {
    if (!categoryId) return;

    activeCategory.value = categoryId;

    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return {
    isSticky,
    activeCategory,
    handleScroll,
    scrollToCategory,
  };
};
