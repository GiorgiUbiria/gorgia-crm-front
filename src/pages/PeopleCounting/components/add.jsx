import React from "react"
import { useForm } from "@tanstack/react-form"
import {
  useCreatePeopleCounting,
  useGetCities,
  useGetBranches,
} from "queries/peopleCounting"

export const FieldInfo = ({ field }) => {
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

export const AddPeopleCountingForm = ({ onSuccess }) => {
  const createPeopleCountingMutation = useCreatePeopleCounting()
  const { data: citiesData } = useGetCities()
  const [selectedCity, setSelectedCity] = React.useState("")
  const { data: branchesData } = useGetBranches(selectedCity)

  const form = useForm({
    defaultValues: {
      date: "",
      visitor_count: "",
      city: "",
      branch: "",
    },
    onSubmit: async ({ value }) => {
      await createPeopleCountingMutation.mutateAsync(value)
      onSuccess?.()
    },
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <form.Field
          name="date"
          validators={{
            onChange: ({ value }) =>
              !value ? "თარიღის მითითება სავალდებულოა" : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                თარიღი
              </label>
              <input
                type="date"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="visitor_count"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "ვიზიტორების რაოდენობის მითითება სავალდებულოა"
                : isNaN(value) || parseInt(value) < 0
                ? "ვიზიტორების რაოდენობა უნდა იყოს დადებითი რიცხვი"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ვიზიტორების რაოდენობა
              </label>
              <input
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="city"
          validators={{
            onChange: ({ value }) =>
              !value ? "ქალაქის მითითება სავალდებულოა" : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ქალაქი
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => {
                  field.handleChange(e.target.value)
                  setSelectedCity(e.target.value)
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              >
                <option value="">აირჩიეთ ქალაქი</option>
                {citiesData?.cities?.map(city => (
                  <option key={city} value={city}>
                    {city}
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
          name="branch"
          validators={{
            onChange: ({ value }) =>
              !value ? "ფილიალის მითითება სავალდებულოა" : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ფილიალი
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                disabled={!selectedCity}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">აირჩიეთ ფილიალი</option>
                {branchesData?.branches?.map(branch => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "მიმდინარეობს..." : "დამატება"}
            </button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}

export default AddPeopleCountingForm
