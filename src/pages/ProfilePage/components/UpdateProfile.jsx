import React from "react"
import { FiMail } from "react-icons/fi"

const UpdateProfile = ({
  profileForm,
  profileError,
  handleChangeProfile,
  onSubmit,
  isFormChanged,
}) => {
  return (
    <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
        <FiMail className="text-blue-600" size={20} />
        <span>პროფილის განახლება</span>
      </h2>
      <p className="text-gray-600 text-xs sm:text-sm mb-6">
        განაახლეთ თქვენი პროფილის ინფორმაცია
      </p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">სახელი</label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleChangeProfile}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {profileError?.name && (
              <p className="text-sm text-red-600">{profileError.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">გვარი</label>
            <input
              type="text"
              name="sur_name"
              value={profileForm.sur_name}
              onChange={handleChangeProfile}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {profileError?.sur_name && (
              <p className="text-sm text-red-600">{profileError.sur_name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              ელ-ფოსტა
            </label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleChangeProfile}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {profileError?.email && (
              <p className="text-sm text-red-600">{profileError.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              მობილური
            </label>
            <input
              type="text"
              name="mobile_number"
              value={profileForm.mobile_number}
              onChange={handleChangeProfile}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {profileError?.mobile_number && (
              <p className="text-sm text-red-600">
                {profileError.mobile_number}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={!isFormChanged}
            className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            შენახვა
          </button>
        </div>
      </form>
    </section>
  )
}

export default UpdateProfile
