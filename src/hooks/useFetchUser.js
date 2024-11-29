import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
} from "../store/user/actions"
import { fetchUser } from "../services/user"

const useFetchUser = () => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)

  useEffect(() => {
    const callFetchUser = async () => {
      if (!userState.user && !userState.loading) {
        dispatch(fetchUserStart())
        try {
          const response = await fetchUser()
          dispatch(fetchUserSuccess(response.data))
        } catch (error) {
          dispatch(fetchUserFailure(error.message))
        }
      }
    }

    callFetchUser()
  }, [dispatch, userState.user, userState.loading])

  return {
    user: userState.user,
    loading: userState.loading,
    error: userState.error,
  }
}

export default useFetchUser
