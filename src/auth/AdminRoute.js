import { Route, Redirect } from 'react-router-dom'
import { IsAuthenticated } from './index'
import {Component} from 'react'

const AdminRoute = ({ component: Component, ...rest }) => {
  console.log(" i am in admin route")
  return (
    <Route
    {...rest}
    render={props => IsAuthenticated() && IsAuthenticated().user.role === 1 ? (
      <Component {...props}/>
    ) : (
        <Redirect to={{pathname:"/signin", state: {from: props.location}}} />
    )} />
  )
}

export default AdminRoute