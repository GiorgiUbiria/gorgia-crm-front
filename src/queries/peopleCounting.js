import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPeopleCounting,
  uploadMonthlyReport,
  uploadWeeklyReport,
  getUploadedFiles,
  getCities,
  getBranches,
  getEntrances,
} from "../services/peopleCounting"
import { toast } from "../store/zustand/toastStore"

export const peopleCountingKeys = {
  all: ["peopleCounting"],
  lists: () => [...peopleCountingKeys.all, "list"],
  list: filters => [...peopleCountingKeys.lists(), { filters }],
  files: () => [...peopleCountingKeys.all, "files"],
  filesList: filters => [...peopleCountingKeys.files(), { filters }],
  cities: () => [...peopleCountingKeys.all, "cities"],
  branches: city => [...peopleCountingKeys.all, "branches", city],
  entrances: branch => [...peopleCountingKeys.all, "entrances", branch],
}

export const useGetPeopleCounting = (filters = {}) => {
  return useQuery({
    queryKey: peopleCountingKeys.list(filters),
    queryFn: () => getPeopleCounting(filters),
  })
}

export const useGetUploadedFiles = (filters = {}) => {
  return useQuery({
    queryKey: peopleCountingKeys.filesList(filters),
    queryFn: () => getUploadedFiles(filters),
  })
}

export const useGetCities = () => {
  return useQuery({
    queryKey: peopleCountingKeys.cities(),
    queryFn: getCities,
  })
}

export const useGetBranches = city => {
  return useQuery({
    queryKey: peopleCountingKeys.branches(city),
    queryFn: () => getBranches(city),
    enabled: Boolean(city),
  })
}

export const useGetEntrances = branch => {
  return useQuery({
    queryKey: peopleCountingKeys.entrances(branch),
    queryFn: () => getEntrances(branch),
    enabled: Boolean(branch),
  })
}

export const useUploadMonthlyReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, reportPeriod }) => uploadMonthlyReport(file, reportPeriod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.lists() })
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.files() })
      toast.success("თვიური რეპორტი წარმატებით აიტვირთა")
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUploadWeeklyReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, reportPeriod }) => uploadWeeklyReport(file, reportPeriod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.lists() })
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.files() })
      toast.success("კვირის რეპორტი წარმატებით აიტვირთა")
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
