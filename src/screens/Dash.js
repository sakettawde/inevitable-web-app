import React, { Component } from "react"
import styled from "styled-components"
import {
  DashContainer,
  FlexColumn,
  PageTitle,
  Spacer,
  HR
} from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect, Route, Link } from "react-router-dom"
import { Scrollbars } from "react-custom-scrollbars"
import DashMain from "./DashMain"
import Contacts from "./Contacts"
import AddContact from "./AddContact"
import ViewContact from "./ViewContact"

class Dash extends Component {
  state = { loading: false,
  showFullMenu: false }

  enterClicked = () => {
    this.setState({ loading: true })
  }

  componentDidMount() {
  
  }

  toggleFullMenu = () => {
    console.log("Full menu toggled")
    this.setState({showFullMenu: !this.state.showFullMenu})
  }

  render() {
    const { redirectTo, loading } = this.state

    if (redirectTo) {
      return <Redirect to={redirectTo} push />
    }

    if (loading) {
      return <Loader />
    }

    const moduleTitle =
      this.props.location.pathname.split("/")[2] || "Dashboard"

    return (
      <DashContainer>
        <MenuBar moduleTitle={moduleTitle} />
        <FlexColumn style={{ flex: 1 }}>
          <TitleBar>
            <MenuBarToggle
              src={require("../assets/menu.png")}
              style={{ marginLeft:"8px", padding: "8px", width: 24, height: 24 }}
              onClick={this.toggleFullMenu}
              alt="menu-bar-toggle"
            />

            <PageTitle>{moduleTitle}</PageTitle>
            <Spacer />
            <img
              src={require("../assets/alarm.png")}
              style={{ width: 38, height: 38 }}
              alt="notifications"
            />
            <DisplayName>
              {this.props.user.displayName}
            </DisplayName>
            <Avatar src={this.props.user.photoURL} alt="avatar"/>
          </TitleBar>
          {this.state.showFullMenu &&
          <MenuBar full/>}
          <Scrollbars style={{ flex: 1 }}>
            <Route path="/Dash" exact component={DashMain} />
            <Route path="/Dash/Contacts" exact component={Contacts} />
            <Route path="/Dash/Contacts/Add" component={AddContact} />
            <Route path="/Dash/Contacts/View" component={ViewContact} />
          </Scrollbars>
        </FlexColumn>
      </DashContainer>
    )
  }
}

const DisplayName = styled.span`
margin-left:12px;
@media (max-width: 670px) {
    display: none;
  }`

const MenuBarToggle = styled.img`
cursor:pointer;
display:none;
@media (max-width: 670px) {
    display: inline;
  }
`

const MenuBar = props => {
  return (
    <Sidebar full={props.full}>
      <PageTitle>Stellar Grid</PageTitle>
      <MenuItem
        title="Dashboard"
        icon={require("../assets/dashboard.png")}
        linkTo="/Dash"
        {...props}
      />
      <MenuItem
        title="Contacts"
        icon={require("../assets/contacts.png")}
        linkTo="/Dash/Contacts"
        {...props}
      />
      <HR />
      <MenuItem
        title="Settings"
        icon={require("../assets/settings.png")}
        linkTo="/Dash/Settings"
        {...props}
      />
      <MenuItem
        title="Logout"
        icon={require("../assets/logout.png")}
        linkTo="/Logout"
        {...props}
      />
    </Sidebar>
  )
}

const MenuItem = ({ title, icon, linkTo, moduleTitle }) => {
  let isActive = moduleTitle === title ? true : false

  return (
    <Link style={{ textDecoration: "none" }} to={linkTo}>
      <MenuRow isActive={isActive}>
        <img src={icon} style={{ padding: "8px", width: 38, height: 38 }} alt="menu-item" />
        <span style={{ paddingLeft: 4 }}>{title}</span>
      </MenuRow>
    </Link>
  )
}

const MenuRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 18px;
  font-weight: ${props => (props.isActive ? "700" : "400")};
  background-color: ${props => (props.isActive ? "#eeeeee" : "#fff")};
  cursor: pointer;
  &:hover {
    background-color: #eee;
    font-weight: 700;
  }
`

const Sidebar = styled.div`
  display: ${props=>props.full?"none":"flex"};
  flex-direction: column;
  width: ${props=>props.full?"100%":"200px"};
  background-color: #fff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.08);
  @media (max-width: 670px) {
    display: ${props=>props.full?"flex":"none"};
  }
`

const TitleBar = styled.div`
  display: flex;
  align-items: center;
`

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 26px;
  margin-left: 18px;
  margin-right: 18px;
  border: 2px solid #8fa6b2;
`

export default Dash
