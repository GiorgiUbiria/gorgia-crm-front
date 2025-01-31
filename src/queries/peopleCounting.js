import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPeopleCounting,
  createPeopleCounting,
  updatePeopleCounting,
  deletePeopleCounting,
  bulkDeletePeopleCounting,
  getCities,
  getBranches,
} from "../services/peopleCounting"
import { toast } from "../store/zustand/toastStore"

export const peopleCountingKeys = {
  all: ["peopleCounting"],
  lists: () => [...peopleCountingKeys.all, "list"],
  list: filters => [...peopleCountingKeys.lists(), { filters }],
  cities: () => [...peopleCountingKeys.all, "cities"],
  branches: city => [...peopleCountingKeys.all, "branches", city],
}

export const useGetPeopleCounting = (filters = {}) => {
  return useQuery({
    queryKey: peopleCountingKeys.list(filters),
    queryFn: () => getPeopleCounting(filters),
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

export const useCreatePeopleCounting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPeopleCounting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.lists() })
      toast.success("ვიზიტორების რაოდენობა წარმატებით დაემატა")
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdatePeopleCounting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updatePeopleCounting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.lists() })
      toast.success("ვიზიტორების რაოდენობა წარმატებით განახლდა")
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeletePeopleCounting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePeopleCounting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.lists() })
      toast.success("ვიზიტორების რაოდენობა წარმატებით წაიშალა")
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useBulkDeletePeopleCounting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bulkDeletePeopleCounting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleCountingKeys.lists() })
      toast.success("ვიზიტორების რაოდენობები წარმატებით წაიშალა")
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
