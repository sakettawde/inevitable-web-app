import React, { Component } from "react"
import styled from "styled-components"
import { FlexColumn, FlexRow, Button1, Gap } from "./Styles"

export default class EpicForm extends Component {
  constructor(props) {
    super(props)
    // console.log(this.props.formData)
    let obj2 = { valuesUpdated: false }
    let formData = this.props.formData.map(item => {
      let obj = item
      obj2[`${item.stateName}`] = item.value
      obj.warningText = ""
      return obj
    })
    obj2.formData = formData
    // console.log(obj2)
    this.state = obj2
  }

  componentWillReceiveProps(nextProps){
      this.setState(nextProps.inputState)
  }

  handleChange = (stateName, newValue) => {
    // console.log("State Name", stateName, "newValue", newValue)
    this.setState({ [`${stateName}`]: newValue })
  }

  clearValidation = () => {
    let formData = this.props.formData.map(item => {
      let obj = item
      obj.warningText = ""
      return obj
    })
    this.setState({ formData })
  }

  setWarning = input => {
    // console.log("setWarn ran", input)
    let formData = this.props.formData.map(item => {
      let obj = item
      if (item.stateName === input.stateName) {
        obj.warningText = input.warning
      }
      return obj
    })
    this.setState({ formData })
  }

  checkValidation = () => {
    this.clearValidation()

    let result = true
    //eslint-disable-next-line
    let validationResult = this.props.formData.map(item => { 
      let returnValue = this.isValid(
        this.state[`${item.stateName}`],
        item.validityType,
        item.required
      )
      if (!returnValue) {
        this.setWarning(item)
        result = returnValue
      }
      //
      return returnValue
    })
    // console.log("Check Validation result", result)
    return result
  }

  isValid = (value = "", type, isRequired) => {
    if (isRequired) {
      if (type === "text") {
        return value.length > 0
      }
      if (type === "email") {
        return value.length > 0
      }
    } else {
      return true
    }
  }

  onCancel = () => {
    this.props.onCancel()
  }

  onSubmit = () => {
    // console.log("first check clicked")
    let obj = this.state
    this.checkValidation() && this.props.onSubmit(obj)
  }

  render() {
    return (
      <div>
        <FormGrid>
          {this.state.formData.map(item => {
            return (
              <FormInput
                key={item.stateName}
                onChange={this.handleChange}
                name={item.stateName}
                value={this.state[`${item.stateName}`]}
                label={item.label}
                placeholder={item.placeholder}
                warningText={item.warningText}
                required={item.required}
              />
            )
          })}
        </FormGrid>
        <FlexRow style={{ justifyContent: "center" }}>
          <Button1 bg="subtle" onClick={this.onCancel}>
            {this.props.cancelButtonLabel || "CANCEL"}
          </Button1>
          <Gap />
          <Button1 onClick={this.onSubmit}>
            {this.props.submitButtonLabel || "SAVE"}
          </Button1>
        </FlexRow>
      </div>
    )
  }
}

const FormGrid = styled.div`
  display: grid;
  grid: auto-flow / 1fr 1fr;
  @media (max-width: 830px) {
    grid: auto-flow / 1fr;
  }
`

export const FormInput = props => {
  //   render() {
  const { label, name, placeholder, required, value, warningText } = props
  // console.log("Name", name)
  return (
    <FlexColumn style={{ margin: "12px" }}>
      <label>
        {label}
        {required && <span style={{ color: "#EF5350" }}>*</span>}
      </label>
      <FlexColumn style={{ marginTop: "12px" }}>
        <Input
          name={name}
          value={value}
          onChange={e => {
            props.onChange(e.target.name, e.target.value)
          }}
          valid={warningText ? false : true}
          placeholder={placeholder}
        />
        <Warning>{warningText}</Warning>
      </FlexColumn>
    </FlexColumn>
  )
  //   }
}

const Input = styled.input`
  font-family: "Open Sans", sans-serif;
  padding: 6px;
  border: ${props => (props.valid ? "none" : "1px solid #EF5350")};
  border-radius: 4px;
  font-size: 16px;
`

const Warning = styled.span`
  color: #ef5350;
  font-size: 12px;
`
