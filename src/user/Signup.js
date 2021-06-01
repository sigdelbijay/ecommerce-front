import Layout from '../core/Layout'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {SignupFn} from '../auth'
const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  })

  //higher order function
  const handleChange = name => event => {
    setValues({...values, error: false, [name]: event.target.value})
  }


  const { name, email, password, error, success } = values

  const clickSubmit = (event) => {
    event.preventDefault()
    SignupFn({ name, email, password })
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false })
        } else {
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            error: '',
            success: true
          })
        }
    })
  }

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
      New account is created. Please <Link to="/signin">signin</Link>
    </div>
  )

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input type="text" value={name} className="form-control" onChange={handleChange('name')}/>
      </div>

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
    <Layout title="Signup" description="Signup to React E-commerce App" className="container col-md-8 offset-md-2">
      {showSuccess()}
      {showError()}
      {signupForm()}
    </Layout>
  )
}

export default Signup