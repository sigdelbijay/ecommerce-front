import { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { IsAuthenticated } from '../auth'
import { Link, Redirect } from 'react-router-dom'
import { getProduct, getCategories, updateProduct } from './apiAdmin'

const UpdateProduct = ({match}) => { //props.match
  const { user, token } = IsAuthenticated()
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    shipping: '',
    quantity: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: ''
  })

  const init = (productId) => {
    getProduct(productId).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          
        })
        initCategories()
      }
    })
  }  

  //load categories and set form data
  const initCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({categories: data, formData: new FormData()}) //populate categories and make form data ready to use
      }
    })
  }

  useEffect(() => {
    init(match.params.productId)
  }, [])

  const {name, description, price, category, categories, shipping, quantity, loading, error, createdProduct, redirectToProfile, formData} = values
  
  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    formData.set(name, value)
    setValues({...values, [name]: value})
  }

  const clickSubmit = event => {
    event.preventDefault()
    setValues({ ...values, error: '', loading: true })
    console.log("formData", formData)
    updateProduct(match.params.productId, token, user._id, formData)
    .then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: '',
          price: '',
          quantity: '',
          loading: false,
          error: false,
          redirectToProfile: true,
          createdProduct: data.name
        })
      }
    })
  }

  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} type="text" className="form-control" value={name}/>
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea onChange={handleChange('description')} className="form-control" value={description}/>
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input type="number" onChange={handleChange('price')} className="form-control" value={price}/>
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select
          onChange={handleChange("category")}
          className="form-control"
        >
          <option>Please select</option>
          {categories && categories.map((category, i) => (<option key={i} value={category._id}>{category.name}</option>))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select
          onChange={handleChange("shipping")}
          className="form-control">
          <option>Please select</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input type="number" onChange={handleChange('quantity')} className="form-control" value={quantity}/>
      </div>
      <button className="btn btn-outline primary">Update Product</button>
    </form>
  )

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      <h2>{error}</h2>
    </div>
  )

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
      {`${createdProduct} is updated`}
    </div>
  )

  const showLoading = () => (
    loading && (<div className="alert alert-success"><h2>Loading...</h2></div>)
  )

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to= "/" />
      }
    }
  }

  const goBack = () => (
    <div className="mb-5">
      <Link to='/admin/dashboard' className='text-warning'>
        Back to Dashboard
      </Link>
    </div>
  )

  return (
    <Layout title="Add a new Product" description={`G'day ${user.name}, ready to add a new product`}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {goBack()}
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  )
}

export default UpdateProduct