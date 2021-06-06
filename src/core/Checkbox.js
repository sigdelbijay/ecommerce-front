import { useState, useEffect } from 'react'

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([])

  const handleToggle = categoryId => {
    const currentCategoryIndex = checked.indexOf(categoryId)
    const newCheckedCategoryId = [...checked]
    if (currentCategoryIndex === -1) {
      newCheckedCategoryId.push(categoryId)
    } else {
      newCheckedCategoryId.splice(currentCategoryIndex, 1)
    }
    // console.log(newCheckedCategoryId)
    setChecked(newCheckedCategoryId)
    handleFilters(newCheckedCategoryId)
  }

  return categories.map((category, index) => (
    <li key={index} className="list-unstyled">
      <input
        type="checkbox"
        className="form-check-input"
        onChange={() => handleToggle(category._id)}
        value={checked.indexOf(category._id) === -1}
      />
      <label className="form-check-label">{category.name}</label>
    </li>
  ))
}

export default Checkbox