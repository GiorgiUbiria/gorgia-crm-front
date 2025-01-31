import React from "react"
import { useForm } from "@tanstack/react-form"
import {
  useUpdatePeopleCounting,
  useGetCities,
  useGetBranches,
} from "queries/peopleCounting"
import { FieldInfo } from "./add"

const EditPeopleCountingForm = ({ data, onSuccess }) => {
  const updatePeopleCountingMutation = useUpdatePeopleCounting()
  const { data: citiesData } = useGetCities()
  const { data: branchesData } = useGetBranches(data.city)

  const form = useForm({
    defaultValues: {
      date: data.date,
      visitor_count: data.visitor_count,
      city: data.city,
      branch: data.branch,
    },
    onSubmit: async ({ value }) => {
      try {
        await updatePeopleCountingMutation.mutateAsync({
          id: data.id,
          data: value,
        })
        onSuccess?.()
      } catch (error) {
        console.error("Failed to update people counting:", error)
      }
    },
  })

  return (
    <form
      id="editPeopleCountingForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
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
              onChange={e => field.handleChange(parseInt(e.target.value, 10))}
              min="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

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
              onChange={e => field.handleChange(e.target.value)}
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
              disabled={!form.getFieldValue("city")}
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

export default EditPeopleCountingForm
