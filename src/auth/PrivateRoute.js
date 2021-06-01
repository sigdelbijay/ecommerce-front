import { Route, Redirect } from 'react-router-dom'
import { IsAuthenticated } from './index'
import {Component} from 'react'

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log("i am in private route")
 return (
  <Route
    {...rest}
    render={props => IsAuthenticated() ? (
      <Component {...props}/>
    ) : (
        <Redirect to={{pathname:"/signin", state: {from: props.location}}} />
    )} />
  )
} 

export default PrivateRoute