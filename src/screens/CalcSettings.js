import React, { Component } from "react"
// import styled from "styled-components"
import {
//   PageContainer,
//   Button,
//   DashContainer,
  FlexColumn,
//   PageTitle,
  Spacer,
//   DashCard,
  FlexRow,
//   HR,
  Button1,
//   Gap
} from "../comps/Styles"
import Loader from "../comps/Loading"
import { Redirect, Link } from "react-router-dom"
// import { Scrollbars } from "react-custom-scrollbars"
import apiCall, { GET_CALC_SETTINGS, UPDATE_CALC_SETTINGS } from "../Api"
import EpicForm from "../comps/EpicFrom"

const formData = [
  {
    stateName: "sunHours",
    label: "Sun Hours",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "freeMaintYrs",
    label: "Default Free Maintanence Years",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "debtTenure",
    label: "Default Debt Tenure (in years)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "debtRate",
    label: "Default Debt Interest Rate (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "fbElecRate",
    label: "Fallback Electricity Rate (₹/unit)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "elecInflation",
    label: "Electricity Inflation Year On Year (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "effRed1",
    label: "Efficiency Reduction in Year 1 (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "effRed",
    label: "Efficiency Reduction Year On Year (2nd year onwards) (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "depPercent",
    label: "Normal Depreciation Percent (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "depAcclPercent1",
    label: "Accelerated Depreciation Percent Year 1 (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "depAcclPercent2",
    label: "Accelerated Depreciation Percent Year 2 (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "depAcclPercent3",
    label: "Accelerated Depreciation Percent Year 3 (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "depAcclPercent4",
    label: "Accelerated Depreciation Percent Year 4 and onwards (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "taxPercent",
    label: "Tax Percent (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "subsidyPercent",
    label: "Subsidy Percent (%)",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  },
  {
    stateName: "CO2factor",
    label: "Multiplication Factor for CO2 savings",
    placeholder: "",
    warning: "Required",
    value: "",
    required: true,
    validityType: "text"
  }
]

class CalcSettings extends Component {
  state = {
    redirectTo: "",
    loading: false,
    sunHours: "",
    freeMaintYrs: "",
    debtTenure: "",
    debtRate: "",
    elecInflation: "",
    effRed1: "",
    effRed: "",
    depPercent: "",
    depAcclPercent1: "",
    depAcclPercent2: "",
    depAcclPercent3: "",
    depAcclPercent4: "",
    taxPercent: "",
    subsidyPercent: "",
    fbElecRate: "",
    CO2factor: ""
  }

  getSettings = () => {
    apiCall(GET_CALC_SETTINGS).then(res=>{
        if(res.errors){
            console.log("Something went wrong", res.errors)
        } else {
            this.setState(res.data.calcSettings[0])
        }
    })
  }

  updateSettings = formOutput => {
    let data = formOutput
    delete data.formData
    console.log("Uploading...",data)
    apiCall(UPDATE_CALC_SETTINGS,data).then(res=>{
        if(res.errors){
            console.log("Something went wrong", res.errors)
        } else {
            console.log("Upload success",res.data)
            this.cancel() 
        }
      })
  }

  componentDidMount() {
    this.getSettings()
  }

  cancel = () => {
    this.setState({ redirectTo: "/Dash/Calculator" })
  }

  render() {
    console.log(this.state)
    const { redirectTo, loading } = this.state

    if (redirectTo) {
      return <Redirect to={redirectTo} push />
    }

    if (loading) {
      return <Loader />
    }

    return (
      <FlexColumn style={{ padding: 18 }}>
        <h3>Calculator Settings</h3>
        <FlexRow>
          <Spacer />
          <Link to="/Dash/Calculator">
            <Button1 bg="subtle">BACK</Button1>
          </Link>
        </FlexRow>
        <EpicForm
          formData={formData}
          onSubmit={this.updateSettings}
          onCancel={this.cancel}
          inputState={this.state}
          submitButtonLabel="SAVE SETTINGS"
          cancelButtonLabel="CANCEL"
        />
      </FlexColumn>
    )
  }
}

export default CalcSettings
