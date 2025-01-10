import { useGetUsers } from "../queries/user"

const useFetchUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useGetUsers()
  console.log("users", users)
  return {
    users,
    loading,
    error: error?.message,
    refetch,
  }
}

export default useFetchUsers
