import React, { Component } from "react"
import { PageContainer, Button } from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect } from "react-router-dom"

class NA extends Component {
  state = {
    loading: false,
    redirectTo: ""
  }

  backToLand = () => {
    this.setState({ loading: true, redirectTo: "/" })
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
        <h1>Woops!</h1>
        <span>
          Sorry but you are not allowed here.
          <br />
          Either you do not have a valid email or you do not have the right
          privileges.
          <br />
          If this isn't supposed to happen, please contact us at:
          sales@stellargrid.in
        </span>
        <br />
        <Button onClick={this.backToLand}>
          <span>BACK</span>
        </Button>
      </PageContainer>
    )
  }
}

export default NA
