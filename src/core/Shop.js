import Layout from './Layout'
import { useState, useEffect } from 'react'
import Card from './Card'
import { getCategories, getFilteredProducts } from './apiCore'
import Checkbox from './Checkbox'
import RadioBox from './RadioBox'
import { prices } from './fixedPrices'

const Shop = () => {
  const [categories, setCategories] = useState([])
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: []
    }
  })
  const [error, setError] = useState(false)
  const [limit, setLimit] = useState(6)
  const [skip, setSkip] = useState(0)
  const [filteredResults, setFilteredResults] = useState([])

  //load categories and set form data
  const init = () => {
    getCategories().then(data => {
      if (data.error) {
        setError(data.error)
      } else {
        setCategories(data) //populate categories and make form data ready to use
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters }
    newFilters.filters[filterBy] = filters

    if (filterBy === 'price') {
      const priceArr = prices.filter(price => price._id === parseInt(filters))
      newFilters.filters[filterBy] = priceArr[0].array
    }

    loadFilteredResults(myFilters.filters)
    setMyFilters(newFilters)
  }

  const loadFilteredResults = (filters) => {
    getFilteredProducts(skip, limit, filters)
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setFilteredResults(data)
        }
      })
  }

  return (
    <Layout
      title="Home Page"
      description="Shop and find book of your choice"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={filters => handleFilters(filters, 'category')}
            />
          </ul>
          <h4>Filter by price range</h4>
          <div>
            <RadioBox
              prices={prices}
              handleFilters={filters => handleFilters(filters, 'price')}
            />
          </div>
        </div>
        <div className="col-4">
          {JSON.stringify(filteredResults)}
        </div>
      </div>

    </Layout>
  )
}

export default Shop