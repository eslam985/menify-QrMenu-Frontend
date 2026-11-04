// app/composables/useDashboardLayout.ts
export const useDashboardLayout = () => {
  const isMobileOpen = useState('dashboard_mobile_open', () => false)

  const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const closeMobile = () => {
    isMobileOpen.value = false
  }

  return {
    isMobileOpen,
    toggleMobile,
    closeMobile,
  }
}