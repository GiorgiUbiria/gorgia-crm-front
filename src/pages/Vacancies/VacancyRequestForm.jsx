import React from "react"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "react-router-dom"
import {
  useCreateVacancyRequest,
  useUpdateVacancyRequest,
} from "../../queries/vacancyRequests"
import { useToast } from "../../store/zustand/toastStore"
import { useStore } from "@tanstack/react-form"

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

const FormSection = ({ title, children }) => (
  <div className="bg-gray-50 dark:!bg-gray-700 p-6 rounded-lg mb-6">
    <h4 className="text-lg font-medium text-gray-900 dark:!text-gray-100 mb-4 border-b pb-2">
      {title}
    </h4>
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
      {children}
    </div>
  </div>
)

const FormField = ({ label, children, span = 1 }) => (
  <div className={`${span === 2 ? "sm:col-span-2" : ""}`}>
    <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
)

const VacancyRequestForm = ({ initialValues, isEdit }) => {
  const navigate = useNavigate()
  const createMutation = useCreateVacancyRequest()
  const updateMutation = useUpdateVacancyRequest()
  const toast = useToast()

  const form = useForm({
    defaultValues: initialValues || {
      position_title: "",
      number_of_vacancies: 1,
      requester_name: "",
      requester_position: "",
      location: "",
      department: "",
      submission_date: new Date().toISOString().split("T")[0],
      is_new_position: false,
      vacancy_reason: "increased_workload",
      vacancy_reason_other: "",
      new_position_justification: "",
      training_description: "",
      internal_transfer: false,
      external_recruitment: true,
      desired_start_date: "",
      education_requirements: "",
      work_experience: "",
      required_knowledge: "",
      required_skills: "",
      main_responsibilities: "",
      trial_period_salary_range: "",
      post_trial_salary_range: "",
      contract_duration: "",
      contract_type: "employment",
      work_schedule: "full_time",
      work_schedule_other: "",
      working_hours: "",
    },
    onSubmit: async ({ value }) => {
      if (
        !value.is_new_position &&
        value.vacancy_reason === "other" &&
        !value.vacancy_reason_other
      ) {
        toast.error("გთხოვთ მიუთითეთ სხვა მიზეზი ვაკანსიისთვის")
        return
      }
      if (value.is_new_position && !value.new_position_justification) {
        toast.error("გთხოვთ მიუთითეთ ახალი პოზიციის დასაბუთება")
        return
      }
      if (
        new Date(value.desired_start_date) <= new Date(value.submission_date)
      ) {
        toast.error(
          "სასურველი დაწყების თარიღი უნდა იყოს შექმნის თარიღზე შემდეგ"
        )
        return
      }
      if (value.contract_type === "project" && !value.contract_duration) {
        toast.error(
          "გთხოვთ მიუთითეთ კონტრაქტის ხანგრძლივობა პროექტზე დაფუძნებული კონტრაქტისთვის"
        )
        return
      }
      if (value.work_schedule === "other" && !value.work_schedule_other) {
        toast.error("გთხოვთ მიუთითეთ სხვა სამუშაო გრაფიკი")
        return
      }
      if (!value.working_hours) {
        toast.error("გთხოვთ მიუთითეთ სამუშაო საათები")
        return
      }

      try {
        if (isEdit) {
          await updateMutation.mutateAsync({
            id: initialValues.id,
            ...value,
          })
          toast.success("ვაკანსიის მოთხოვნა წარმატებით განახლდა")
        } else {
          await createMutation.mutateAsync(value)
          toast.success("ვაკანსიის მოთხოვნა წარმატებით შეიქმნა")
        }
        navigate("/vacancy-requests")
      } catch (error) {
        toast.error("დაფიქსირდა შეცდომა, გთხოვთ სცადოთ თავიდან")
        console.error("Error submitting vacancy request:", error)
      }
    },
  })

  const watchedVacancyReason = useStore(
    form.store,
    state => state.values.vacancy_reason
  )

  const watchedContractType = useStore(
    form.store,
    state => state.values.contract_type
  )

  const watchedWorkSchedule = useStore(
    form.store,
    state => state.values.work_schedule
  )

  const watchedIsNewPosition = useStore(
    form.store,
    state => state.values.is_new_position
  )

  const watchedSubmissionDate = useStore(
    form.store,
    state => state.values.submission_date
  )

  const inputClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white"
  const textareaClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white h-32"
  const selectClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:!bg-gray-800 shadow-lg rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-2xl font-medium leading-6 text-gray-900 dark:!text-gray-100 mb-8 border-b pb-4">
            {isEdit
              ? "ვაკანსიის მოთხოვნის რედაქტირება"
              : "ახალი ვაკანსიის მოთხოვნა"}
          </h3>

          <form
            onSubmit={e => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <FormSection title="ზოგადი ინფორმაცია">
              <form.Field
                name="position_title"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "პოზიციის დასახელება სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="პოზიციის დასახელება">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="number_of_vacancies"
                validators={{
                  onChange: ({ value }) =>
                    !value || value < 1
                      ? "ვაკანსიების რაოდენობა უნდა იყოს მინიმუმ 1"
                      : undefined,
                }}
              >
                {field => (
                  <FormField label="ვაკანსიების რაოდენობა">
                    <input
                      type="number"
                      min="1"
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="requester_name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "მომთხოვნის სახელი სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="მომთხოვნის სახელი">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="requester_position"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "მომთხოვნის პოზიცია სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="მომთხოვნის პოზიცია">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="location"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "მდებარეობა სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="მდებარეობა">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="department"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "დეპარტამენტი სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="დეპარტამენტი">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <FormSection title="დეტალური ინფორმაცია">
              <form.Field name="is_new_position">
                {field => (
                  <FormField label="ახალი პოზიციაა?">
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={e => field.handleChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:!text-gray-300">
                        დიახ
                      </span>
                    </div>
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>
              {!watchedIsNewPosition ? (
                <>
                  <form.Field
                    name="vacancy_reason"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "ვაკანსიის მიზეზი სავალდებულოა" : undefined,
                    }}
                  >
                    {field => (
                      <FormField label="ვაკანსიის მიზეზი">
                        <select
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          className={selectClassName}
                        >
                          <option value="increased_workload">
                            გენერალური დატვირთვა
                          </option>
                          <option value="employee_departure">
                            თანამშრომლის წასვლა
                          </option>
                          <option value="other">სხვა</option>
                        </select>
                        <FieldInfo field={field} />
                      </FormField>
                    )}
                  </form.Field>
                  {watchedVacancyReason === "other" && (
                    <form.Field
                      name="vacancy_reason_other"
                      validators={{
                        onChange: ({ value }) =>
                          watchedVacancyReason === "other" && !value
                            ? "გთხოვთ მიუთითეთ სხვა მიზეზი"
                            : undefined,
                      }}
                    >
                      {field => (
                        <FormField label="სხვა მიზეზი">
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                            className={inputClassName}
                          />
                          <FieldInfo field={field} />
                        </FormField>
                      )}
                    </form.Field>
                  )}
                </>
              ) : (
                <form.Field
                  name="new_position_justification"
                  validators={{
                    onChange: ({ value }) =>
                      watchedIsNewPosition && !value
                        ? "გთხოვთ მიუთითეთ ახალი პოზიციის დასაბუთება"
                        : undefined,
                  }}
                >
                  {field => (
                    <FormField label="ახალი პოზიციის დასაბუთება" span={2}>
                      <textarea
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        className={textareaClassName}
                      />
                      <FieldInfo field={field} />
                    </FormField>
                  )}
                </form.Field>
              )}
              <form.Field
                name="training_description"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "ტრენინგის აღწერა სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="ტრენინგის აღწერა" span={2}>
                    <textarea
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={textareaClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <FormSection title="ვაკანსიის შევსების ოფციები">
              <form.Field name="internal_transfer">
                {field => (
                  <FormField label="შიდა გადაყვანა">
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={e => field.handleChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:!text-gray-300">
                        დიახ
                      </span>
                    </div>
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field name="external_recruitment">
                {field => (
                  <FormField label="გარე დაქირავება">
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={e => field.handleChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:!text-gray-300">
                        დიახ
                      </span>
                    </div>
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="desired_start_date"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "სასურველი დაწყების თარიღი სავალდებულოა"
                      : undefined,
                }}
              >
                {field => (
                  <FormField label="სასურველი დაწყების თარიღი">
                    <input
                      type="date"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                      min={watchedSubmissionDate}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <FormSection title="საჭირო კვალიფიკაცია">
              <form.Field
                name="education_requirements"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "განათლების მოთხოვნები სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="განათლების მოთხოვნები" span={2}>
                    <textarea
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={textareaClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="work_experience"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "სამუშაო გამოცდილება სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="სამუშაო გამოცდილება" span={2}>
                    <textarea
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={textareaClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="required_knowledge"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "საჭირო ცოდნა სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="საჭირო ცოდნა" span={2}>
                    <textarea
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={textareaClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="required_skills"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "საჭირო უნარები სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="საჭირო უნარები" span={2}>
                    <textarea
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={textareaClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="main_responsibilities"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "მთავარი მოვალეობები სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="მთავარი მოვალეობები" span={2}>
                    <textarea
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={textareaClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <FormSection title="სამუშაო პირობები">
              <form.Field
                name="trial_period_salary_range"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "საცდელი პერიოდის ხელფასის დიაპაზონი სავალდებულოა"
                      : undefined,
                }}
              >
                {field => (
                  <FormField label="საცდელი პერიოდის ხელფასის დიაპაზონი">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="post_trial_salary_range"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "საცდელი პერიოდის შემდეგ ხელფასის დიაპაზონი სავალდებულოა"
                      : undefined,
                }}
              >
                {field => (
                  <FormField label="საცდელი პერიოდის შემდეგ ხელფასის დიაპაზონი">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              {watchedContractType === "project" && (
                <form.Field
                  name="contract_duration"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "კონტრაქტის ხანგრძლივობა სავალდებულოა"
                        : undefined,
                  }}
                >
                  {field => (
                    <FormField label="კონტრაქტის ხანგრძლივობა">
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        className={inputClassName}
                      />
                      <FieldInfo field={field} />
                    </FormField>
                  )}
                </form.Field>
              )}

              <form.Field
                name="contract_type"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "კონტრაქტის ტიპი სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="კონტრაქტის ტიპი">
                    <select
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={selectClassName}
                    >
                      <option value="employment">დასაქმება</option>
                      <option value="project">პროექტი</option>
                    </select>
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              <form.Field
                name="work_schedule"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "სამუშაო გრაფიკი სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="სამუშაო გრაფიკი">
                    <select
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={selectClassName}
                    >
                      <option value="full_time">სრული განაკვეთი</option>
                      <option value="part_time">ნახევარი განაკვეთი</option>
                      <option value="other">სხვა</option>
                    </select>
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>

              {watchedWorkSchedule === "other" && (
                <form.Field
                  name="work_schedule_other"
                  validators={{
                    onChange: ({ value }) =>
                      watchedWorkSchedule === "other" && !value
                        ? "გთხოვთ მიუთითეთ სხვა სამუშაო გრაფიკი"
                        : undefined,
                  }}
                >
                  {field => (
                    <FormField label="სხვა სამუშაო გრაფიკი">
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        className={inputClassName}
                      />
                      <FieldInfo field={field} />
                    </FormField>
                  )}
                </form.Field>
              )}

              <form.Field
                name="working_hours"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "სამუშაო საათები სავალდებულოა" : undefined,
                }}
              >
                {field => (
                  <FormField label="სამუშაო საათები">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      className={inputClassName}
                    />
                    <FieldInfo field={field} />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white dark:!hover:bg-gray-600"
              >
                გაუქმება
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:!bg-blue-500 dark:!hover:bg-blue-600"
              >
                {isEdit ? "განახლება" : "შექმნა"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VacancyRequestForm
