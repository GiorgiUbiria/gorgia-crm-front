import { useGetUsers } from "../queries/user"

const useFetchUsers = (options = {}) => {
  const { data: users = [], isLoading: loading, error, refetch } = useGetUsers(options)
  return {
    users,
    loading,
    error: error?.message,
    refetch,
  }
}

export default useFetchUsers
