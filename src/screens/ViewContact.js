import React, { Component } from "react"
import {
  FlexColumn,
  Spacer,
  DashCard,
  FlexRow,
  Button1,
} from "../comps/Styles"
import { Link } from "react-router-dom"

class ViewContact extends Component {
  state = {
    contact: this.props.location.state.contact
  }

  render() {

    const {contact} = this.props.location.state && this.props.location.state.contact

    if(!contact){
      return (
        <FlexColumn style={{padding:18}}>
        <h3>View Contact</h3>
        <span>No contact selected to be viewed</span>
        <br/>
        <Link to="/Dash/Contacts">
            <Button1 bg="subtle">BACK</Button1>
          </Link>
      </FlexColumn> 
      )
    }
    
    return (
      <FlexColumn style={{ padding: 18 }}>
      <DashCard>
        <FlexRow style={{ alignItems: "center" }}>
          <FlexColumn>
          <h2 style={{margin:0}}>{contact.name}</h2>
          <span>{contact.company}</span>
          </FlexColumn>
          <Spacer />
          <Link to="/Dash/Contacts">
            <Button1 bg="subtle">BACK</Button1>
          </Link>
        </FlexRow>
        <br/>
        <FlexColumn>
          <h3>Contact Details</h3>
          <span>{contact.contactNo}</span>
          <span>{contact.email}</span>
          <span>{contact.altContactNo}</span>
          <br/>
          <h3>Address</h3>
          <span>{contact.building}</span>
          <span>{contact.lane}</span>
          <span>{contact.area}</span>
          <span>{contact.city}</span>
          <span>{contact.state}</span>
          <span>{contact.country}</span>
        </FlexColumn>
      </DashCard>
      </FlexColumn>
    )
  }
}

export default ViewContact
