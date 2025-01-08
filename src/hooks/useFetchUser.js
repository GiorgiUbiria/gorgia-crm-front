import { useGetUser } from "../queries/user"

const useFetchUser = () => {
  const { data: user, isLoading: loading, error } = useGetUser()

  return {
    user,
    loading,
    error: error?.message,
  }
}

export default useFetchUser
