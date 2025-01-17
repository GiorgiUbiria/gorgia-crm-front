import React from "react"
import { useForm } from "@tanstack/react-form"
import { useUpdateUser } from "queries/admin"

function FieldInfo({ field }) {
  if (!field.state.meta.isTouched) return null

  return (
    <div className="mt-1">
      {field.state.meta.errors.length > 0 && (
        <em className="text-sm text-red-500">
          {field.state.meta.errors.join(", ")}
        </em>
      )}
      {field.state.meta.isValidating && (
        <span className="text-sm text-blue-500">მოწმდება...</span>
      )}
    </div>
  )
}

export const EditUserForm = ({
  onSuccess,
  departments = [],
  roles = [],
  canEditRoles,
  user,
}) => {
  const updateUserMutation = useUpdateUser()

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      sur_name: user?.sur_name || "",
      email: user?.email || "",
      mobile_number: user?.mobile_number || "",
      position: user?.position || "",
      department_id: user?.department_id?.toString() || "",
      location: user?.location || "",
      working_start_date: user?.working_start_date || "",
      date_of_birth: user?.date_of_birth || "",
      id_number: user?.id_number || "",
      roles: user?.roles?.map(role => role.id) || [],
    },
    onSubmit: async ({ value }) => {
      await updateUserMutation.mutateAsync({ id: user.id, data: value })
      onSuccess?.()
    },
  })

  return (
    <form
      id="editUserForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "მომხმარებლის სახელის მითითება სავალდებულოა"
                : value.length < 2
                ? "მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                მომხმარებლის სახელი
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="sur_name"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "მომხმარებლის გვარის მითითება სავალდებულოა"
                : value.length < 2
                ? "მომხმარებლის გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                მომხმარებლის გვარი
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "მომხმარებლის ელ-ფოსტის მითითება სავალდებულოა"
                : value.length < 2
                ? "მომხმარებლის ელ-ფოსტა უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"
                : !value.includes("@")
                ? "მომხმარებლის ელ-ფოსტა უნდა შეიცავდეს @ სიმბოლოს"
                : !value.endsWith("gorgia.ge")
                ? "მომხმარებლის ელ-ფოსტა უნდა მთავრდებოდეს gorgia.ge-ით"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                მომხმარებლის ელ-ფოსტა
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="mobile_number"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "მომხმარებლის ტელეფონის ნომერის მითითება სავალდებულოა"
                : value.length !== 9
                ? "მომხმარებლის ტელეფონის ნომერი უნდა შეიცავდეს 9 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                მომხმარებლის ტელეფონის ნომერი
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="position"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "მომხმარებლის პოზიციის მითითება სავალდებულოა"
                : value.length < 2
                ? "მომხმარებლის პოზიცია უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                მომხმარებლის პოზიცია
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="id_number"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "მომხმარებლის პირადი ნომერის მითითება სავალდებულოა"
                : value.length !== 11
                ? "მომხმარებლის პირადი ნომერი უნდა შეიცავდეს 11 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                მომხმარებლის პირადი ნომერი
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      {canEditRoles && (
        <>
          <div>
            <form.Field
              name="department_id"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "მომხმარებლის დეპარტამენტის მითითება სავალდებულოა"
                    : undefined,
              }}
            >
              {field => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    მომხმარებლის დეპარტამენტი
                  </label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">აირჩიეთ დეპარტამენტი</option>
                    {departments.map(department => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field
              name="roles"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "მომხმარებლის როლის მითითება სავალდებულოა"
                    : undefined,
              }}
            >
              {field => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    მომხმარებლის როლი
                  </label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">აირჩიეთ როლი</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>
        </>
      )}

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="hidden">
            <button type="submit" disabled={!canSubmit || isSubmitting} />
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
