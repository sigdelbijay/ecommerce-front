import { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { IsAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import {getAllProducts, deleteProduct} from './apiAdmin'

const ManageProducts = () => {

  const [products, setProducts] = useState([])
  useEffect(() => {
    loadProducts()
  }, [])

  const {user, token} = IsAuthenticated()
  const loadProducts = () => {
    getAllProducts(products).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    }) 
  }

  const removeProduct = (productId) => {
    deleteProduct(productId, token, user._id).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        loadProducts()
      }
    })
  }

  return (
    <Layout title="Manage Products" description="Perform CRUD on products" className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Total {products.length} products</h2>
          <hr />
          <ul className="list-group">
            {products.map((p, iProduct) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={iProduct}>
                <strong>{p.name}</strong>
                <Link to={`/admin/product/update/${p._id}`}>
                  <span className="badge badge-warning badge-pill">Update</span>
                </Link>
                <span className="badge badge-danger badge-pill" onClick={() => removeProduct(p._id)}>Delete</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default ManageProducts