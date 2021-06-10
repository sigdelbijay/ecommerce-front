import {Fragment} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Signout, IsAuthenticated } from '../auth'
import {itemTotal} from './cartHelpers'

const isActive = (history, path) => {
  if(history.location.pathname === path) {
    return { color: '#ff9900'}
  } else {
    return {color: '#ffffff'}
  }
}

const Menu = ({history}) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" to="/" style={isActive(history, "/" )}>Home</Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/shop" style={isActive(history, '/shop')}>Shop</Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/cart" style={isActive(history, '/shop')}>
          Cart{" "}
          <sup>
            <small className="cart-badge">{itemTotal()}</small>
          </sup>
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          to={IsAuthenticated() && IsAuthenticated().user.role === 1 ? "/admin/dashboard" : "/user/dashboard"}
          style={isActive(history, IsAuthenticated() && IsAuthenticated().user.role === 1 ? "/admin/dashboard" : "/user/dashboard")}
        >Dashboard</Link>
      </li>

      {!IsAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link className="nav-link" to="/signin" style={isActive(history, "/signin")}>Signin</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/signup" style={isActive(history, "/signup")}>Signup</Link>
          </li>
        </Fragment>
      )}
      
      {IsAuthenticated() && (
        <li className="nav-item">
          <span
            className="nav-link"
            onClick={() => Signout(() => {
              history.push('/')
            })}
            style={{ cursor: 'pointer', color: "#ffffff" }}
          >
            Signout
        </span>
        </li>
      )}
    </ul>
  </div>
)

export default withRouter(Menu)