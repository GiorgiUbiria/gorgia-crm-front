import { useGetUsers } from "../queries/user"

const useFetchUsers = ({ isAdmin = false } = {}) => {
  const {
    data: users = [],
    isLoading: loading,
    error,
    refetch,
  } = useGetUsers({
    enabled: isAdmin,
  })

  return {
    users,
    loading,
    error: error?.message,
    refetch,
  }
}

export default useFetchUsers
