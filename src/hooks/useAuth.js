const useAuth = () => {
  if (!sessionStorage.getItem("authUser")) {
    return false
  }
  return true
}

export default useAuth
