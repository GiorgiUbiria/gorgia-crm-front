export const tableStyles = {
  container: "rounded-xl shadow-lg overflow-hidden transition-colors duration-200",
  table: "w-full border-collapse border-x border-gray-200 dark:border-gray-700",
  
  // Header styles
  thead: "bg-gradient-to-r from-primary-600 to-primary-700",
  th: "first:rounded-tl-lg last:rounded-tr-lg px-6 py-4 text-left text-sm font-medium tracking-wider transition-colors duration-200 border-r border-primary-500 last:border-r-0",
  thContent: "flex items-center gap-3",
  sortIcon: "flex flex-col",
  
  // Body styles
  tbody: "divide-y divide-gray-200 dark:divide-gray-700",
  tr: "transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50",
  td: "px-6 py-4 text-sm whitespace-nowrap transition-colors duration-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0",
  expandedRow: "bg-gray-50/80 dark:bg-gray-800/50",
  
  // Toolbar styles
  toolbar: "p-6 border-b dark:border-gray-700 transition-colors duration-200",
  toolbarContent: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between",
  
  // Filter styles
  filterContainer: "flex items-center gap-4",
  filterSelect: "min-w-[180px] px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200",
  filterInput: "w-full pl-11 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200",
  
  // Pagination styles
  pagination: "flex flex-col sm:flex-row gap-4 items-center justify-between px-6 py-4 bg-white dark:!bg-gray-900 border-t dark:!border-gray-700 transition-colors duration-200",
  paginationButton: "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200",
  paginationSelect: "min-w-[120px] px-4 py-2 text-sm rounded-lg border border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200",
  paginationText: "text-sm text-gray-600 dark:text-gray-300",
  
  // Status badge styles
  statusBadge: {
    base: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200",
    colors: {
      success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      error: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      default: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
    },
  },
  
  // Theme variants
  themes: {
    light: {
      background: "bg-white",
      text: "text-gray-900",
      border: "border-gray-200",
      header: {
        text: "text-white",
        background: "bg-primary-600",
      }
    },
    dark: {
      background: "bg-gray-900",
      text: "text-gray-100",
      border: "border-gray-700",
      header: {
        text: "text-white",
        background: "bg-primary-700",
      }
    },
  },
  
  // Size variants
  sizes: {
    sm: {
      td: "px-4 py-2 text-xs",
      th: "px-4 py-3 text-xs",
    },
    md: {
      td: "px-6 py-4 text-sm",
      th: "px-6 py-4 text-sm",
    },
    lg: {
      td: "px-8 py-6 text-base",
      th: "px-8 py-6 text-base",
    },
  },
  
  // Utility classes
  utils: {
    clickable: "cursor-pointer",
    disabled: "opacity-50 cursor-not-allowed",
    hidden: "hidden",
    truncate: "truncate",
    center: "text-center",
    right: "text-right",
    noWrap: "whitespace-nowrap",
    wrap: "whitespace-normal",
  },
}

export const getTableStyle = (base, variant) => {
  return `${base} ${variant}`
}

export const getStatusBadgeStyle = (status, styles = tableStyles) => {
  const baseStyle = styles.statusBadge.base
  const colorStyle = styles.statusBadge.colors[status] || styles.statusBadge.colors.default
  return `${baseStyle} ${colorStyle}`
}

export const getSizeStyles = (size = "md", styles = tableStyles) => {
  return styles.sizes[size] || styles.sizes.md
}

export const getThemeStyles = (theme = "light", styles = tableStyles) => {
  return styles.themes[theme] || styles.themes.light
} 