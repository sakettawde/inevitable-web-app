import React, { Component } from "react"
// import styled from "styled-components"
import {
  //   PageContainer,
  //   Button,
  //   DashContainer,
  FlexColumn,
  //   PageTitle,
  Spacer,
  DashCard,
  FlexRow,
  //   HR,
  Button1
  //   Gap
} from "../comps/Styles"
// import Loader from "../comps/Loading"
import { Redirect, Link } from "react-router-dom"
// import { Scrollbars } from "react-custom-scrollbars"
import apiCall, { GET_CALC_SETTINGS } from "../Api"
import { initialize } from "./ref2"
import { FormInput } from "../comps/EpicFrom"
import styled from "styled-components"

const commaAdder = (x) => {
  let decimals
  if (x.toString().length <= 5) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (x.toString().length <=7 ) {
    x = x / 100000;
    decimals = 2
    return Number(Math.round(x+'e'+decimals)+'e-'+decimals)+" Lac"
  } else {
    x = x / 10000000;
    decimals = 2
    return Number(Math.round(x+'e'+decimals)+'e-'+decimals)+" Cr"
  }
}

const totalArray = (anArray) => {
  let total = 0
  for (let i=0;i<anArray.length;i++){
    total += anArray[i]
  }
  let decimals = 0
  return this.commaAdder(Number(Math.round(total+'e'+decimals)+'e-'+decimals))
}

const rounded = (number, decimals) => {
  return Number(Math.round(number+'e'+decimals)+'e-'+decimals)
}

const paybackYears = (cashflow, ppp, pc) => {
  pc = pc || 1
  let project_cost = pc * ppp
  let temp = 0
  let round
  let years
  for (let i=0;i<cashflow.length;i++){

  if(cashflow[i]){
    temp += cashflow[i]
  }

  if(project_cost <= temp){
    years = i
    round = (temp - project_cost)/project_cost
    let decimals = 1
    round = Number(Math.round(round+'e'+decimals)+'e-'+decimals)
    years = years + round
    return years
  }

  }
}

const IRRCalc = (values, guess) => {
// Credits: algorithm inspired by Apache OpenOffice

// Calculates the resulting amount
var irrResult = function(values, dates, rate) {
  var r = rate + 1;
  var result = values[0];
  for (var i = 1; i < values.length; i++) {
    result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
  }
  return result;
}

// Calculates the first derivation
var irrResultDeriv = function(values, dates, rate) {
  var r = rate + 1;
  var result = 0;
  for (var i = 1; i < values.length; i++) {
    var frac = (dates[i] - dates[0]) / 365;
    result -= frac * values[i] / Math.pow(r, frac + 1);
  }
  return result;
}

// Initialize dates and check that values contains at least one positive value and one negative value
var dates = [];
var positive = false;
var negative = false;
for (var i = 0; i < values.length; i++) {
  dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
  if (values[i] > 0) positive = true;
  if (values[i] < 0) negative = true;
}

// Return error if values does not contain at least one positive value and one negative value
if (!positive || !negative) return '#NUM!';

// Initialize guess and resultRate
var guess = (typeof guess === 'undefined') ? 0.1 : guess;
var resultRate = guess;

// Set maximum epsilon for end of iteration
var epsMax = 1e-10;

// Set maximum number of iterations
var iterMax = 50;

// Implement Newton's method
var newRate, epsRate, resultValue;
var iteration = 0;
var contLoop = true;
do {
  resultValue = irrResult(values, dates, resultRate);
  newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
  epsRate = Math.abs(newRate - resultRate);
  resultRate = newRate;
  contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
} while(contLoop && (++iteration < iterMax));

if(contLoop) return '#NUM!';

// Return internal rate of return
return resultRate;
  }

class Calculator extends Component {
  state = {
    calulcated: false,
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
    CO2factor: "",
    elecBill: "",
    roofArea: "",
    elecRate: "",
    outputs: { test: "Calculator output comes here" },
    outputsToPrint: [],
    settingsLoaded: false
  }

  componentDidMount() {
    this.getCalcSettings()
  }

  getCalcSettings = () => {
    apiCall(GET_CALC_SETTINGS).then(res => {
      if (res.errors) {
        console.log("Something went wrong", res.errors)
      } else {
        this.setState(res.data.calcSettings[0])
        this.setState({ settingsLoaded: true })
      }
    })
  }

  calculate = () => {
    //const {elecBill, elecRate, elecType, roofArea} = this.state
    if (!this.state.settingsLoaded) {
      alert("Settings not loaded")
      return
    }

    let { elecRate } = this.state

    if (!this.state.elecBill) {
      alert("Please enter electricity bill amount")
      return
    }

    const {
      sunHours,
      freeMaintYrs,
      debtTenure,
      debtRate,
      elecInflation,
      effRed1,
      effRed,
      depPercent,
      depAcclPercent1,
      depAcclPercent2,
      depAcclPercent3,
      depAcclPercent4,
      taxPercent,
      subsidyPercent,
      fbElecRate,
      CO2factor
    } = this.state

    if (!elecRate) {
      //this.setState({elecRate: fbElecRate})
      elecRate = fbElecRate
    }

    const inputs = {
      elecBill: this.state.elecBill,
      elecRate: elecRate,
      elecType: this.state.elecType,
      roofArea: this.state.roofArea,
      freeMaintYrs: freeMaintYrs,
      debtTenure: debtTenure,
      sunhrs: sunHours,
      effRed: effRed,
      effRed1: effRed1,
      elecInflation: elecInflation,
      debtRate: debtRate,
      depPercent: depPercent,
      depAcclPercent1: depAcclPercent1,
      depAcclPercent2: depAcclPercent2,
      depAcclPercent3: depAcclPercent3,
      depAcclPercent4: depAcclPercent4,
      taxPercent: taxPercent,
      subsidyPercent: subsidyPercent,
      subsidyCheck: false,
      acclDepCheck: true,
      extraTaxCheck: false,
      normalDepTaxBenefitCheck: false,
      taxBenefitInterestCheck: false
    }

    const outputs = initialize(inputs)
    console.log("outputs", outputs)

    let {
      plantCapacity,
      roofArearequired,
      roofAreaMessage,
      power_production_price,
      Debt,
      installment_full,
      tax_benefit_accl,
      cashflow_project,
      equity,
      cashflow_equity,
      twentyyrsavings
    } = outputs

    const outputsToPrint = [
      {
        title: "Plant Capacity",
        value: plantCapacity + "kw"
      },
      {
        title: "Power Prod Price",
        value: power_production_price / 1000 + " ₹/W"
      },
      {
        title: "Total Cost",
        value: '₹ '+commaAdder(power_production_price*plantCapacity)
      },
      {
        title: "Generation",
        value: rounded(sunHours * 365, 0) + " units/kw/yr"
      },
      {
        title: "Annual Savings",
        value: '₹ '+commaAdder(plantCapacity*1500*elecRate)
      },
      {
        title: "25 Year Savings",
        value: '₹ '+commaAdder(twentyyrsavings)
      },
      {
        title: 'CO2 savings',
        value: plantCapacity*CO2factor+' tonnes'
      },
      {
        title: 'Equity Payback',
        value: paybackYears(cashflow_equity,equity)+' years'
      },
      {
        title: "Total Project Payback",
        value: paybackYears(cashflow_project,power_production_price,plantCapacity)+' years'
      },
      {
        title: "Roof Area Required",
        value: roofArearequired+' sq.ft.'
      }
    ]

    this.setState({ outputsToPrint, outputs })
  }

  handleChange = (stateName, newValue) => {
    this.setState({ [`${stateName}`]: newValue })
  }

  render() {
    return (
      <FlexColumn style={{ padding: 18 }}>
        <h3>Calculator</h3>
        <FlexRow>
          <Spacer />
          <Link to="/Dash/Calculator/Settings">
            <Button1 bg="brown">CALCULATOR SETTINGS</Button1>
          </Link>
        </FlexRow>
        <FlexRow>
          <FormInput
            label="Electricity Bill"
            name="elecBill"
            onChange={this.handleChange}
            required
            value={this.state.elecBill}
          />
          <label>Connection Type</label>
          <select
            value={this.state.elecType}
            id="dropDownId"
            onChange={event => this.setState({ elecType: event.target.value })}
          >
            <option value="domestic">Domestic</option>
            <option value="nondomestic">Non-Domestic</option>
            <option value="industrial">Industrial</option>
          </select>
          <FormInput
            label="Roof Area (sqft)"
            name="roofArea"
            onChange={this.handleChange}
            value={this.state.roofArea}
          />
          <FormInput
            label="Elec Rate (per unit)"
            name="elecRate"
            onChange={this.handleChange}
            value={this.state.elecRate}
          />
          <Button1 onClick={this.calculate}>Calculate</Button1>
        </FlexRow>
        <FlexRow style={{ flexWrap: "wrap" }}>
          {this.state.outputsToPrint.map((item, index) => {
            return (
              <DashCard key={index}>
                <FlexColumn>
                  <CardTitle>{item.title}</CardTitle>
                  <CardValue>{item.value}</CardValue>
                </FlexColumn>
              </DashCard>
            )
          })}
        </FlexRow>
      </FlexColumn>
    )
  }
}

const CardTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
`

const CardValue = styled.span`
  text-align: center;
`

export default Calculator
