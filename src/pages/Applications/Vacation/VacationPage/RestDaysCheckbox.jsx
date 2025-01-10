import React from "react"
import { Label, Input } from "reactstrap"

const RestDaysCheckbox = React.memo(function RestDaysCheckbox({
  holidays,
  formik,
  handleCheckboxChange,
}) {
  return (
    <div className="mb-3">
      <Label className="mb-2 text-lg font-semibold">დასვენების დღეები</Label>
      <div className="d-flex flex-wrap">
        {holidays.map(holiday => (
          <div className="form-check form-check-inline" key={holiday.value}>
            <Input
              type="checkbox"
              id={holiday.value}
              name={holiday.value}
              checked={formik.values[holiday.value] === "yes"}
              onChange={handleCheckboxChange(holiday.value)}
              className="form-check-input"
            />
            <Label className="form-check-label" for={holiday.value}>
              {holiday.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
})

export default RestDaysCheckbox 