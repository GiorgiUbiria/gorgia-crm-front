export const STATUS_MAPPINGS = {
  pending: "მიმდინარე",
  in_progress: "მუშავდება",
  completed: "დასრულებული",
  cancelled: "გაუქმებული",
}

export const PRIORITY_MAPPINGS = {
  low: "დაბალი",
  medium: "საშუალო",
  high: "მაღალი",
  urgent: "სასწრაფო",
}

export const STATUS_COLORS = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:!bg-blue-900 dark:!text-blue-300",
  completed:
    "bg-green-100 text-green-800 dark:!bg-green-900 dark:!text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:!bg-red-900 dark:!text-red-300",
}

export const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800 dark:!bg-gray-900 dark:!text-gray-300",
  medium: "bg-blue-100 text-blue-800 dark:!bg-blue-900 dark:!text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:!bg-orange-900 dark:!text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:!bg-red-900 dark:!text-red-300",
}
