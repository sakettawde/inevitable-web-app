import React, { Component } from "react"
import { Route, Redirect } from "react-router-dom"
import "./App.css"
import Land from "./screens/Land"
import { auth } from "./util/base"
import NA from "./screens/NA";
import Loader from "./comps/Loading";
import Dash from "./screens/Dash";
import axios from 'axios';
import Logout from "./screens/Logout";

const axiosStellarGraphQL = axios.create({
  baseURL: 'PLACE_YOUR_VALUE_HERE',
});

// Authorization HOC (Higher-Order components)
const Authorization = (WrappedComponent, allowedRoles, user, userRole) => {
  return class WithAuthorization extends React.Component {
    

    render() {
      // eslint-disable-next-line
      const role = userRole
      if(!user.uid){
        return <Redirect to="/"/>
      }

      if (allowedRoles.includes(userRole)) {
        return (
          <WrappedComponent api={axiosStellarGraphQL} {...this.props} user={user} userRole={userRole} />
        )
      } else {
        return <Redirect to="/Dash" />
      }
    }
  }
}

const LoggedInHOC = (WrappedComponent, user) => {
  return class WithAuthorization extends React.Component {
    render() {
      if (user.uid) {
        console.log("redirecting to dashboard")
        return <Redirect to="/Dash"/>
      } else {
        console.log("user not logged in, stay put")
        return <WrappedComponent api={axiosStellarGraphQL} {...this.props}/>
      }
    }
  }
}

class App extends Component {
  state = {
    user: {},
    userRole: "",
    loggedIn: false,
    loading: true
  }

  async componentDidMount(){
    await auth().onAuthStateChanged( async user => {
      if (user) {
        console.log("User in da house", user)
        await this.setState({
          loggedIn: true,
          user: user,
          loading: false
        })

                // base
        //   .fetch(`roles/${user.uid}`, {
        //     context: this
        //   })
        //   .then(data => {
        //     if (data.uid) {
        //       this.setState({
        //         userRole: data.role,
        //         loading: false
        //       });
        //     } else {
        //       this.setState({
        //         userRole: "",
        //         loading: false
        //       });
        //     }
        //   })
        //   .catch(err => console.log(err));

      } else {
        console.log("no user maan")
        this.setState({loading: false, user: {}})
      }
    })
  }

  render() {
    const { user, loading } = this.state
    const userRole = "admin"
    const allowedRoles = ["admin", "superadmin"]

    // if (redirectTo) {
    //   return <Redirect to={redirectTo} push />
    // }

    if (loading) {
      return <Loader />
    }

    return (
      <div className="App" style={{ flexDirection: "column" }}>
        <Route
          path="/"
          exact
          component={LoggedInHOC(Land,user)}
        />
        <Route
          path="/NA"
          exact
          render={routeProps => (
            <NA {...routeProps} user={user} userRole={userRole} />
          )}
        />
        <Route
          path="/Dash"
          component={Authorization(Dash,allowedRoles,user,userRole)}
        />
        <Route
          path="/Logout"
          component={Authorization(Logout,allowedRoles,user,userRole)}
        />
      </div>
    )
  }
}

export default App
