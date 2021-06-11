import {useState} from 'react'
import { Link, Redirect } from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
import {addItem, deleteItem, updateItem} from './cartHelpers'

const Card = ({ product, showViewProductButton = true, showAddToCartButton = true, cartUpdate = false, showDeleteProductButton = false, run=undefined, setRun=f=>f }) => {

  const [redirect, setRedirect] = useState(false)
  const [count, setCount] = useState(product.count) //??
  
  const showViewButton = (showViewProductButton) => (
    showViewProductButton && (
      <Link to={`/product/${product._id}`} className="mr-2">
        <div className='btn btn-outline-primary mt-2 mb-2'>
          View Product
        </div>
      </Link>
    )
  )

  const showAddButton = (showAddToCartButton) => (
    showAddToCartButton && (
      <button onClick={addToCart} className='btn btn-outline-warning mt-2 mb-2'>
        Add to Cart
      </button>
    )
  )

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true)
    })
  }

  const showDeleteButton = (showDeleteProductButton) => (
    showDeleteProductButton && (
      <button onClick={deleteFromCart} className='btn btn-outline-danger mt-2 mb-2'>
        Delete Cart
      </button>
    )
  )

  const deleteFromCart = () => {
    setRun(!run)
    deleteItem(product._id)
  }

  const shouldRedirect = redirect => redirect ? <Redirect to='/cart' /> : ''

  const showStock = quantity => {
    return quantity > 0 ? (
      <span className='badge badge-primary badge-pill'>In Stock</span>
    ) : (
        <span className='badge badge-primary badge-pill'>Out of stock</span>
    )
  }

  const handleChange = productId => event => {
    setRun(!run)
    setCount(event.target.value < 1 ? 1 : event.target.value) //no 0 or -ve values
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value)
    } 
  }

  const showCartUpdateOptions = cartUpdate => (
    cartUpdate && (
      <div>
        <div input="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text"> Adjust Quantity</span>
            <input type="number" className="form-control" value={count} onChange={handleChange(product._id)}/>
          </div>
        </div>
      </div>
    )
  )

  return (
    <div className='card'>
      <div className='card-header name'>{product.name}</div>
      <div className='card-body'>
        {shouldRedirect(redirect)}
        <ShowImage item={product} url='product'/>
        <p className='lead mt-2'>
          {product.description.substring(0, 100)}
        </p>
        <p className='black-10'>${product.price}</p>
        <p className='black-9'>Category: {product.category && product.category.name}</p>
        <p className='black-8'>Added {moment(product.createdAt).fromNow()}</p>
      
        <p>Sold Units: {product.sold}</p>
        {showStock(product.quantity)}
        <br/>
        {showViewButton(showViewProductButton)}
        {showAddButton(showAddToCartButton)}
        {showDeleteButton(showDeleteProductButton)}
        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  )
}

export default Card