import React from "react"
import { useForm } from "@tanstack/react-form"
import { useCreateTask } from "queries/oneCTasks"

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

export const AddOneCTaskForm = ({ onSuccess }) => {
  const createTaskMutation = useCreateTask()

  const form = useForm({
    defaultValues: {
      task_title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      phone_number: "",
      assigned_users: [],
      due_date: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      await createTaskMutation.mutateAsync(value)
      onSuccess?.(onSuccess)
    },
  })

  return (
    <form
      id="addOneCTaskForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <form.Field
          name="task_title"
          validators={{
            onChange: ({ value }) =>
              !value ? "პრობლემის ტიპის მითითება სავალდებულოა" : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.task_title}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                პრობლემის ტიპი
              </label>
              <select
                id={field.task_title}
                name={field.task_title}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              >
                <option value="">აირჩიეთ პრობლემის ტიპი</option>
                <option value="ბაზის ჩაწერა">ბაზის ჩაწერა</option>
                <option value="ოფლაინ და თვითმომსახურების სალარო">
                  ოფლაინ და თვითმომსახურების სალარო
                </option>
                <option value="სასწორი">სასწორი</option>
                <option value="სკანერი">სკანერი</option>
                <option value="ბანკის ტერმინალები">ბანკის ტერმინალები</option>
                <option value="ხელის მოკრების ტერმინალები">
                  ხელის მოკრების ტერმინალები
                </option>
                <option value="ტრენინგები და გამოცდები">
                  ტრენინგები და გამოცდები
                </option>
                <option value="1C -ERP">1C -ERP</option>
                <option value="WMS">WMS</option>
                <option value="Agent+">Agent+</option>
                <option value="ანთა.ჯი">ანთა.ჯი</option>
                <option value="ავტოინვესტი">ავტოინვესტი</option>
              </select>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field name="description">
          {field => (
            <div>
              <label
                htmlFor={field.description}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                აღწერა
              </label>
              <textarea
                id={field.description}
                name={field.description}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="phone_number"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "ტელეფონის ნომრის მითითება სავალდებულოა"
                : value.length !== 9
                ? "ტელეფონის ნომერი უნდა შეიცავდეს ზუსტად 9 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.phone_number}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ტელეფონის ნომერი
              </label>
              <input
                type="text"
                id={field.phone_number}
                name={field.phone_number}
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
          name="ip_address"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "IP მითითება სავალდებულოა"

              const ipPattern =
                /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

              if (!ipPattern.test(value)) {
                return "გთხოვთ მიუთითოთ სწორი IP მისამართის ფორმატი (მაგ. 192.168.1.1)"
              }

              return undefined
            },
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.ip_address}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                IP მისამართი
              </label>
              <input
                type="text"
                id={field.ip_address}
                name={field.ip_address}
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
          name="priority"
          validators={{
            onChange: ({ value }) =>
              !value ? "პრიორიტეტის მითითება აუცილებელია" : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.priority}
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                პრიორიტეტი
              </label>
              <select
                id={field.priority}
                name={field.priority}
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              >
                <option value="Low">
                  <span> დაბალი </span>
                </option>
                <option value="Medium">
                  <span> საშუალო </span>
                </option>
                <option value="High">
                  <span> მაღალი </span>
                </option>
              </select>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

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
