export const useMenuNavigation = () => {
  const isSticky = ref(false);
  const activeCategory = ref<string | number | null>(null);

  const handleScroll = () =>
    window.scrollY > 1000 ? (isSticky.value = true) : (isSticky.value = false);

  const scrollToCategory = (categoryId: string | number) => {
    if (!categoryId) return;

    activeCategory.value = categoryId;

    const element = document.getElementById(`category-${categoryId}`);

    element
      ? element.scrollIntoView({ behavior: "smooth", block: "start" })
      : null;
  };

  return { isSticky, activeCategory, handleScroll, scrollToCategory };
};
