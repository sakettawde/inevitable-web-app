import React, { Component } from "react"
// import styled from "styled-components"
import {
  // PageContainer,
  // Button,
  // DashContainer,
  FlexColumn,
  // PageTitle,
  // Spacer,
  DashCard,
  // FlexRow,
  // HR
} from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect } from "react-router-dom"
// import { Scrollbars } from "react-custom-scrollbars";

class DashMain extends Component {
  state = { loading: false }

  enterClicked = () => {
    this.setState({ loading: true })
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
        <FlexColumn>
          <DashCard>
              <span>Welcome to the Dashboard! This wil populate as you begin using the app!</span>
          </DashCard>
        </FlexColumn>
    )
  }
}

export default DashMain