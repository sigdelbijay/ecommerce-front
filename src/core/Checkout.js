import { getBraintreeClientToken, processPayment, createOrder } from './apiCore'
import {emptyCart} from './cartHelpers'
import { useState, useEffect } from 'react'
import { IsAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import 'braintree-web'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({ products, run=undefined, setRun=f=>f }) => {

  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: ''
  })

  useEffect(() => {
    getBraintreeToken()
  }, [run])

  const userId = IsAuthenticated() && IsAuthenticated().user._id
  const token = IsAuthenticated() && IsAuthenticated().token

  const getBraintreeToken = () => (
    getBraintreeClientToken(userId, token).then((result) => {
      if (result.err) {
        setData({...data, error: result.err})
      } else {
        setData({...data, clientToken: result.clientToken})
      }
    })
  )

  const getTotal = (products) => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price
    }, 0)
  }

  const showCheckout = () => (
    IsAuthenticated() ? (
      <div>{showDropIn()}</div>
    ): (
      <Link to="/signin">
        <button className="btn btn-primary">
          Sign in to checkout
        </button>
      </Link>
    )
  )

  const buy = () => {
    setData({...data, loading: true})
    //nonce = data.instance.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
      .then(result => {
        nonce = result.nonce

        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        }
        processPayment(userId, token, paymentData)
          .then(response => {
            // console.log("response", response)

            //create order
            const createOrderData = {
              products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: data.address
            }
            createOrder(userId, token, createOrderData)
              .then(response => {
                emptyCart(() => {
                  setData({ ...data, success: response.success, loading: false })
                  setRun(!run)
                  console.log("payment successful and cart is empty")
                })
              })
              .catch(error => {
                setData({loading: false})
                console.log(error)
              })
          })
          .catch(error => {
            setData({ loading: false })
            console.log(error)
          })
      })
      .catch(err => {
        setData({...data, error: err.message})
        console.log("dropin error: ", err)
      })
  }

  const showError = error => <div className="alert alert-danger" style={{display: error ? '': 'none'}}>{error}</div>
  const showSuccess = success => success && (
    <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
      Thanks! Your payment has been successful!
    </div>
  )
  const showLoading = loading => loading && <h2>Loading...</h2>
  const handleAddress = event => setData({ ...data, address: event.target.value})


  const showDropIn = () => (
    <div onBlur={() => setData({...data, error: ''})}>
      <div>
        {data.clientToken && products.length > 0 ? (
          <div>
            <div className="form-group mb-3">
              <label className="text-muted">Delivery address:</label>
              <textarea
                onChange={handleAddress}
                className="form-control"
                value={data.address}
                placeholder="Type your delivery address here"
              >
              </textarea>
            </div>
            <div>
              <DropIn
                options={{
                  authorization: data.clientToken,
                  paypal: {flow: 'vault'}
                }}
                onInstance={(instance) => (data.instance = instance)}
              />
              <button onClick={buy} className="btn btn-success btn-block">Pay</button>
            </div>
          </div>

        ) : null}
      </div>
    </div>
  )

  return (
    <div>
      <h2>Total Amount: {getTotal(products)}</h2>
      {showError(data.error)}
      {showSuccess(data.success)}
      {showLoading(data.loading)}
      {showCheckout()}
    </div>
  )
}

export default Checkout