import Layout from './Layout'
import { getProducts } from './apiCore'
import { useState, useEffect } from 'react'
import Card from './Card'
import Search from './Search'

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([])
  const [productsByArrival, setProductsByArrival] = useState([])
  const [error, setError] = useState(false)

  const loadProductsBySell = () => {
    getProducts('sold')
      .then(data => {
        if (data.error) {
          setError(data.error)
        }
        else {
          setProductsBySell(data)
        }
      })
  }

  const loadProductByArrival = () => {
    getProducts('createdAt')
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setProductsByArrival(data)
        }
      })
  }

  useEffect(() => {
    loadProductByArrival()
    loadProductsBySell()
  }, [])

  return (
    <Layout title="Home Page" description="Node React E-commerce App" className="container-fluid">
      <h2 className="mb-4">Search bar</h2>
      <div className="row">
        <Search />
      </div>
      <h2 className="mb-4">New Arrivals</h2>
      <div className="row">
        {productsByArrival.map((product, index) => (
          <div key={index} className="col-4 mb-3">
            <Card product={product}/>
          </div>
        ))}
      </div>

      <h2 className="mb-4">Best Sellers</h2>
      <div className="row">
        {productsBySell.map((product, index) => (
          <div key={index} className="col-4 mb-3">
            <Card product={product}/>
          </div>
        ))}
      </div>

    </Layout>
  ) 
}

export default Home