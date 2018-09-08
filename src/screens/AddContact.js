import React, { Component } from "react"
import {
  FlexColumn,
  Spacer,
  FlexRow,
} from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect } from "react-router-dom"
import apiCall,{ADD_CONTACT} from "../Api";
import EpicForm from "../comps/EpicForm";

const formData2 = [
  {
    stateName: "name",
    label: "Name",
    placeholder: "",
    warning: "Please enter a valid name",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "company",
    label: "Company",
    placeholder: "",
    warning: "Please enter a valid company name",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "contactNo",
    label: "Contact No",
    placeholder: "",
    warning: "Please enter a valid contact no",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "email",
    label: "Email ID",
    placeholder: "",
    warning: "Please enter a valid email id",
    value: "",
    required: true,
    validityType: "email"
  },
  {
    stateName: "altContactNo",
    label: "Alternate Contact",
    placeholder: "",
    warning: "",
    value: "",
    required: false,
    validityType: "text"
  },
  {
    stateName: "designation",
    label: "Designation",
    placeholder: "",
    warning: "",
    value: "",
    required: false,
    validityType: "text"
  },
  {
    stateName: "building",
    label: "Flat/Building/Office Name &amp; No.",
    placeholder: "",
    warning: "",
    value: "",
    required: false,
    validityType: "text"
  },
  {
    stateName: "lane",
    label: "Lane/Street",
    placeholder: "",
    warning: "",
    value: "",
    required: false,
    validityType: "text"
  },
  {
    stateName: "area",
    label: "Area",
    placeholder: "",
    warning: "",
    value: "",
    required: false,
    validityType: "text"
  },
  {
    stateName: "city",
    label: "City",
    placeholder: "",
    warning: "Please enter a city name",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "state",
    label: "Region/State",
    placeholder: "",
    warning: "Please enter a state/region name",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "country",
    label: "Country",
    placeholder: "",
    warning: "Please enter a country name",
    value: "",
    required: true,
    validityType: "text"
  }
]

class AddContact extends Component {
  state = { loading: false, country: "", state: "" }

  handleFormInputChange = (stateName, newValue) => {
    this.setState({ [stateName]: newValue })
  }

  done = formOutput => {
      let data = formOutput
      delete data.formData
      console.log("Woohoo its done!", data)
      apiCall(ADD_CONTACT,data).then(res=>{
        if(res.errors){
            console.log("Something went wrong", res.errors)
        } else {
            console.log("Upload success",res.data)
            this.cancel() 
        }
      })
  }

  cancel = () => {
      this.setState({redirectTo:"/Dash/Contacts"})
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
      <FlexColumn style={{ padding: 18 }}>
        <FlexRow style={{ alignItems: "center" }}>
          <h3>Add Contact</h3>
          <Spacer />
        </FlexRow>
        <EpicForm formData={formData2} onSubmit={this.done} onCancel={this.cancel} submitButtonLabel="ADD CONTACT" cancelButtonLabel="CANCEL"/>
      </FlexColumn>
    )
  }
}



export default AddContact
