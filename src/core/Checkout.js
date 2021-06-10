import Layout from './Layout'
import { getProducts } from './apiCore'
import { useState, useEffect } from 'react'
import Card from './Card'
import Search from './Search'
import { IsAuthenticated } from '../auth'
import {Link} from 'react-router-dom'

const Checkout = ({ products, run=undefined, setRun=f=>f }) => {

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price
    }, 0)
  }

  const showCheckout = () => (
    IsAuthenticated() ? (
      <button className="btn btn-success">Checkout</button>
    ): (
      <Link to="/signin">
        <button className="btn btn-primary">
          Sign in to checkout
        </button>
      </Link>
    )
  )

  return (
    <div>
      <h2>Total Amount: {getTotal()}</h2>
      {showCheckout()}
    </div>
  )
}

export default Checkout