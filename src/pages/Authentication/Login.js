import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import { useLogin } from "../../queries/auth"
import useAuth from "hooks/useAuth"
import { useToast } from "../../store/zustand/toastStore"
import profile from "assets/images/profile-img.png"

const Login = () => {
  document.title = "Login | Gorgia LLC"

  const navigate = useNavigate()
  const toast = useToast()
  const { mutateAsync: login } = useLogin()
  const { user, isInitialized, setUser, initialize } = useAuth()

  useEffect(() => {
    if (isInitialized && user) {
      navigate("/dashboard")
    }
  }, [isInitialized, user, navigate])

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("არასწორი ელ-ფოსტის ფორმატი")
        .required("გთხოვთ შეიყვანოთ ელ-ფოსტა"),
      password: Yup.string().required("გთხოვთ შეიყვანოთ პაროლი"),
    }),
    onSubmit: async values => {
      try {
        const res = await login(values)

        if (res.data.status !== 200) {
          toast.error(
            "ავტორიზაცია ვერ მოხერხდა, გთხოვთ სცადოთ თავიდან",
            "შეცდომა",
            {
              duration: 2000,
              size: "small",
            }
          )
          return
        }

        sessionStorage.setItem("token", res.data.token)
        sessionStorage.setItem("authUser", JSON.stringify(res.data.user))

        setUser(res.data.user)

        initialize()

        toast.success("წარმატებით გაიარეთ ავტორიზაცია", "შესრულდა", {
          duration: 2000,
          size: "small",
        })
        navigate("/dashboard")
      } catch (error) {
        toast.error(
          "ავტორიზაცია ვერ მოხერხდა, გთხოვთ სცადოთ თავიდან",
          "შეცდომა",
          {
            duration: 2000,
            size: "small",
          }
        )
      }
    },
  })

  const handleSubmit = e => {
    e.preventDefault()
    validation.handleSubmit()
    return false
  }

  if (!isInitialized || user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-100 dark:!bg-primary-900 p-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-7 flex flex-col justify-center">
                <div className="text-primary-600 dark:!text-primary-400">
                  <h5 className="text-xl font-bold">მოგესალმებით !</h5>
                  <p className="mt-2">გაიარეთ ავტორიზაცია Gorgia LLC-ში.</p>
                </div>
              </div>
              <div className="col-span-5 flex items-center justify-end">
                <img src={profile} alt="" className="w-full h-auto" />
              </div>
            </div>
          </div>
          <div className="px-6 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:!text-gray-300"
                >
                  ელ-ფოსტა
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`mt-1 block w-full h-11 rounded-md shadow-sm px-3
                    ${
                      validation.touched.email && validation.errors.email
                        ? "border-red-500 dark:!border-red-500"
                        : "border-gray-300 dark:!border-gray-600"
                    } 
                    focus:ring-primary-500 focus:border-primary-500 dark:!bg-gray-700 dark:!text-white`}
                  placeholder="ჩაწერეთ ელ-ფოსტა"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.email || ""}
                />
                {validation.touched.email && validation.errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:!text-red-400">
                    {validation.errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:!text-gray-300"
                >
                  პაროლი
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`mt-1 block w-full h-11 rounded-md shadow-sm px-3
                    ${
                      validation.touched.password && validation.errors.password
                        ? "border-red-500 dark:!border-red-500"
                        : "border-gray-300 dark:!border-gray-600"
                    } 
                    focus:ring-primary-500 focus:border-primary-500 dark:!bg-gray-700 dark:!text-white`}
                  placeholder="ჩაწერეთ პაროლი"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.password || ""}
                />
                {validation.touched.password && validation.errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:!text-red-400">
                    {validation.errors.password}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:!bg-primary-500 dark:!hover:bg-primary-600"
              >
                ავტორიზაცია
              </button>
            </form>
          </div>
        </div>
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:!text-gray-400">
            არ გაქვს ანგარიში?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-primary-600 hover:text-primary-500 dark:!text-primary-400"
            >
              რეგისტრაცია
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:!text-gray-400">
            © {new Date().getFullYear()} Gorgia LLC. Crafted with{" "}
            <span className="text-red-500">&hearts;</span> by GORGIA
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

Login.propTypes = {
  history: PropTypes.object,
}
