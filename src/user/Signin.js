import Layout from '../core/Layout'
import { SigninFn, Authenticate } from '../auth'
import { Redirect } from 'react-router-dom'
import { useState } from 'react'
import {IsAuthenticated} from '../auth'

const Signin = () => {
  const [values, setValues] = useState({
    email: 'bijay@gmail.com',
    password: 'asdfas',
    error: '',
    loading: false,
    redirectToReferrer: false
  })

  //higher order function
  const handleChange = name => event => {
    setValues({...values, error: false, [name]: event.target.value})
  }

  const { email, password, error, loading, redirectToReferrer } = values
  const {user} = IsAuthenticated()

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({...values, error: false, loading: true})
    SigninFn({ email, password })
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false })
        } else {
          Authenticate(data, () => {
            setValues({
              ...values,
              redirectToReferrer: true
            })
          })
        }
    })
  }

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showLoading = () => (
    loading && (<div className="alert alert-info"><h2>Loading...</h2></div>)
  )

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />
      } else {
        return <Redirect to="/user/dashboard" />
      }
    }

    if (IsAuthenticated()) {
      return <Redirect to="/" />
    }
  }

  const signinForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input type="email" value={email} className="form-control" onChange={handleChange('email')}/>
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input type="password" value={password} className="form-control" onChange={handleChange('password')}/>
      </div>

      <button className="btn btn-primary" onClick={clickSubmit}>Submit</button>   
    </form>
  )
  
  return (
    <Layout title="Signin" description="Signin to React E-commerce App" className="container col-md-8 offset-md-2">
      {showLoading()}
      {showError()}
      {signinForm()}
      {redirectUser()}
    </Layout>
  ) 
}

export default Signin