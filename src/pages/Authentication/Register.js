import React, { useState, useEffect } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "services/auth"
import { getPublicDepartments } from "services/admin/department"
import profileImg from "../../assets/images/profile-img.png"
import { toast } from "store/zustand/toastStore"

const InputField = ({ label, name, type = "text", placeholder, formik }) => (
  <div className="space-y-1">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name] || ""}
      className={`block w-full h-11 rounded-md shadow-sm px-3
        ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500 dark:border-red-500"
            : "border-gray-300 dark:border-gray-600"
        } 
        focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        {formik.errors[name]}
      </p>
    )}
  </div>
)

const Register = () => {
  document.title = "Register | Gorgia LLC"
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getPublicDepartments()
        setDepartments(response.data?.data || [])
      } catch (error) {
        console.error("დეპარტამენტები ვერ მოიძებნა: ", error)
        setDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      name: "",
      sur_name: "",
      password: "",
      mobile_number: "",
      department_id: "",
      position: "",
      id_number: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("გთხოვთ შეიყვანოთ Email")
        .email("არასწორი Email ფორმატი")
        .matches(/@gorgia\.ge$/, "Email უნდა მთავრდებოდეს @gorgia.ge-ით"),
      name: Yup.string()
        .required("გთხოვთ შეიყვანოთ სახელი")
        .matches(
          /^[\u10A0-\u10FF]{2,30}$/,
          "სახელი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)"
        ),
      sur_name: Yup.string()
        .required("გთხოვთ შეიყვანოთ გვარი")
        .matches(
          /^[\u10A0-\u10FF]{2,30}$/,
          "გვარი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)"
        ),
      password: Yup.string()
        .required("გთხოვთ შეიყვანოთ პაროლი")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
          "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, რომელშიც არის ერთი ციფრი, ერთი დიდი ასო, ერთი პატარა ასო და ერთი სპეციალური სიმბოლო"
        ),
      department_id: Yup.number().required("გთხოვთ აირჩიოთ დეპარტამენტი"),
      position: Yup.string().required("გთხოვთ ჩაწეროთ პოზიცია"),
      id_number: Yup.number().required("გთხოვთ ჩაწეროთ პირადი ნომერი"),
      mobile_number: Yup.string()
        .required("გთხოვთ შეიყვანოთ მობილურის ნომერი")
        .matches(/^[0-9]+$/, "ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს")
        .min(9, "ტელეფონის ნომერი უნდა იყოს მინიმუმ 9 ციფრი"),
    }),
    onSubmit: async values => {
      if (validation.isValid) {
        try {
          const response = await registerUser({
            ...values,
            department_id: Number(values.department_id),
          })

          if (response.status === 200) {
            toast.success(
              "მომხმარებელი წარმატებით დარეგისტრირდა! გთხოვთ დაელოდოთ ადმინისტრატორის დადასტურებას.",
              "წარმატება",
              {
                duration: 2000,
                size: "small",
              }
            )
            navigate("/auth/login")
          }
        } catch (error) {
          const errorMessage = error.response?.data
            ? typeof error.response.data === "object"
              ? Object.values(error.response.data).flat().join(", ")
              : error.response.data.message
            : "რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."

          toast.error("რეგისტრაცია ვერ მოხერხდა: " + errorMessage, "შეცდომა", {
            duration: 2000,
            size: "small",
          })
        }
      } else {
        toast.error("გთხოვთ შეავსეთ ყველა ველი სწორად", "შეცდომა", {
          duration: 2000,
          size: "small",
        })
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-primary-100 dark:bg-primary-900 p-6">
            <div className="grid grid-cols-12">
              <div className="col-span-7">
                <div className="text-primary-600 dark:text-primary-400">
                  <h5 className="text-xl font-bold">რეგისტრაცია</h5>
                  <p className="mt-2">შექმენით თქვენი ანგარიში Gorgia LLC-ში</p>
                </div>
              </div>
              <div className="col-span-5">
                <img src={profileImg} alt="" className="w-full h-auto" />
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            <form
              onSubmit={e => {
                e.preventDefault()
                validation.handleSubmit()
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="ელ-ფოსტა"
                  name="email"
                  type="email"
                  placeholder="ჩაწერეთ ელ-ფოსტა (@gorgia.ge)"
                  formik={validation}
                />

                <InputField
                  label="სახელი"
                  name="name"
                  placeholder="ჩაწერეთ თქვენი სახელი"
                  formik={validation}
                />

                <InputField
                  label="გვარი"
                  name="sur_name"
                  placeholder="ჩაწერეთ თქვენი გვარი"
                  formik={validation}
                />

                <InputField
                  label="პირადი ნომერი"
                  name="id_number"
                  placeholder="ჩაწერეთ პირადი ნომერი"
                  formik={validation}
                />

                <div className="space-y-1">
                  <label
                    htmlFor="department_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    დეპარტამენტი
                  </label>
                  <select
                    id="department_id"
                    name="department_id"
                    value={validation.values.department_id || ""}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className={`block w-full h-11 rounded-md shadow-sm px-3
                      ${
                        validation.touched.department_id &&
                        validation.errors.department_id
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } 
                      focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">აირჩიე დეპარტამენტი</option>
                    {Array.isArray(departments) &&
                      departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                  </select>
                  {validation.touched.department_id &&
                    validation.errors.department_id && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validation.errors.department_id}
                      </p>
                    )}
                </div>

                <InputField
                  label="პოზიცია"
                  name="position"
                  placeholder="ჩაწერეთ თქვენი პოზიცია"
                  formik={validation}
                />

                <InputField
                  label="ტელეფონის ნომერი"
                  name="mobile_number"
                  type="tel"
                  placeholder="ჩაწერეთ ტელეფონის ნომერი"
                  formik={validation}
                />

                <InputField
                  label="პაროლი"
                  name="password"
                  type="password"
                  placeholder="ჩაწერეთ პაროლი"
                  formik={validation}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                რეგისტრაცია
              </button>
            </form>
          </div>
        </div>
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            უკვე გაქვთ ანგარიში?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              ავტორიზაცია
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Gorgia LLC. Crafted with{" "}
            <span className="text-red-500">&hearts;</span> by GORGIA
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
