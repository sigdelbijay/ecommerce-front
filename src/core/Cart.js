import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import Layout from './Layout'
import { getCart } from './cartHelpers'
import Card from './Card'
import Checkout from './Checkout'

const Cart = () => {
  const [items, setItems] = useState([])
  //run, setRun passed to child and changed when we change/delete item in child component
  //so we run useEffect hook in parent to update the items in state and re-render and to avoid infinite loop
  const [run, setRun] = useState(false) 

  useEffect(() => {
    setItems(getCart())
  }, [run])

  const showItems = items => (
    <div>
      <h2 className="mb-4">Your cart has {`${items.length}`} items</h2>
      <hr />
      {items.map((product, i) => (
        <Card
          key={i}
          product={product}
          showAddToCartButton={false}
          cartUpdate={true}
          showDeleteProductButton={true}
          run={run}
          setRun={setRun}
        />
      ))}
    </div>
  )

  const noItemsMessage = () => (   
    <div>
      <h2 className="mb-4">Your cart is empty.</h2>
      <hr />
      <Link to="/shop">Continue Shopping</Link>
    </div>
  )

  // const totalAmount = (items=[]) => {
  //   const newItems = [...items]
  //   const sum = newItems.reduce((sum, item) => sum + item)
  // }

  return (
    <Layout title="Shopping Cart" description="Manage your cart items. Add remove checkout or continue shopping" className="container-fluid">
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()} 
        </div>
        <div className="col-6">
          <h2 className="mb-4">Your cart summary</h2>
          <hr />
          <Checkout products={items} run={run} setRun={setRun}/>
          {/* <h2>Total amount: {totalAmount(items)}</h2> */}
        </div>
      </div>
    </Layout>
  )
}

export default Cart