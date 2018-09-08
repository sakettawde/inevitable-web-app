import React, { Component } from "react"
import styled from "styled-components"
import {
  FlexColumn,
  Spacer,
  FlexRow,
  Button1
} from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect, Link } from "react-router-dom"
import apiCall, { GET_CONTACTS } from "../Api"
import { Icon } from 'react-icons-kit'
import {ic_delete} from 'react-icons-kit/md/ic_delete'

class Contacts extends Component {
  state = {
    loading: false,
    contacts: [],
    contactToBeViewed: {}
  }

  enterClicked = () => {
    this.setState({ loading: true })
  }

  componentDidMount() {
    apiCall(GET_CONTACTS).then(res => {
      if (res.errors) {
        console.log("Something went wrong", res.errors)
      } else {
        // console.log("Data received",res.data)
        this.setState({ contacts: res.data.contacts })
      }
    })
  }

  viewContact = async (contact) => {
    await this.setState({
        contactToBeViewed: contact,
        redirectTo: "/Dash/Contacts/View"
    })
  }

  render() {
    const { redirectTo, loading } = this.state

    if (redirectTo) {
      return <Redirect push 
      to={{
        pathname: redirectTo,
        state: { contact: this.state.contactToBeViewed }
      }}/>
    }

    if (loading) {
      return <Loader />
    }

    return (
      <FlexColumn style={{ padding: 18 }}>
        <FlexRow>
          <Spacer />
          <Link to="/Dash/Contacts/Add">
            <Button1>ADD CONTACT</Button1>
          </Link>
        </FlexRow>
        <FlexRow style={{ marginTop: "12px", marginLeft: "12px" }}>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Contact No</th>
                <th>Email</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <Tbody>
              {this.state.contacts.map(contact => (
                <TableRow key={contact.id}>
                  <Cell>{contact.name}</Cell>
                  <Cell>{contact.company}</Cell>
                  <Cell>{contact.contactNo}</Cell>
                  <Cell>{contact.email}</Cell>
                  <Cell>{contact.city}</Cell>
                  <Cell>{contact.state}</Cell>
                  <Cell>{contact.country}</Cell>
                  <Cell>
                    <Button1 bg="blue" onClick={()=>this.viewContact(contact)}>VIEW</Button1>
                    <Button1 bg="red" marginLeft>
                    <Icon icon={ic_delete} />
                    </Button1>
                  </Cell>
                </TableRow>
              ))}
            </Tbody>
          </Table>
        </FlexRow>
      </FlexColumn>
    )
  }
}

const Table = styled.table`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  padding: 6px;
`
const Tbody = styled.tbody`
  border-top: 2px solid #000;
`

const TableRow = styled.tr`
  border: 1px solid #eee;
`

const Cell = styled.td`
  border-top: 1px solid #eee;
  padding-left: 8px;
  padding-right: 8px;
`

export default Contacts
