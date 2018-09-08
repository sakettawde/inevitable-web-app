import React, { Component } from "react"
// import styled from "styled-components"
import { logoutUser } from "../util/helper"
import { PageContainer } from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect } from "react-router-dom"

class Logout extends Component {
  state = {
    loading: false,
    redirectTo: ""
  }

  componentDidMount(){
      logoutUser()
  }

  render() {
    const { redirectTo, loading } = this.state

    if (redirectTo) {
      return <Redirect to={redirectTo} push />
    }

    if (loading) {
      return <Loader />
    }

    return (
      <PageContainer
        style={{
          height: "100vh",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <h2>Logging user out...</h2>
      </PageContainer>
    )
  }
}

export default Logout
