import { useQuery } from "@tanstack/react-query"
import { getRoles } from "services/role"

export const useGetRoles = (options = {}) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    select: response => response.data.roles,
    ...options,
  })
}
