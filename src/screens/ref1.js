import React, { Component } from 'react'
import base from './base'
import PropTypes from 'prop-types'
import { initialize } from './calculation'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'
import { Notification } from 'react-notification'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, AreaChart, Area } from 'recharts'

class MiniCalculator extends Component {

  state = {
    elecBill: '',
    elecType: 'nondomestic',
    roofArea: '',
    elecRate: '',
    warning: '',
    output: '',
    output2: '',
    output3: '',
    output4: '',
    output5: '',
    output6: '',
    output7: '',
    output8: '',
    output9: '',
    output10: '',
    output11: '',
    output12: '',
    output13: '',
    output14: '',
    output15: '',
    outputRest: '',
    visibility: { visibility: 'hidden' },
    visibility2: { visibility: 'hidden' },
    showModal: false,
    settings: {},
    custName: '',
    custContact: '',
    custEmailId: '',
    isNotificationActive: false,
    notificationMessage: '',
    userlocation: {},
    calculated: false,
    canCalculate: false
  }

  commaAdder = (x) => {
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

  totalArray(anArray) {
    let total = 0
    for (let i=0;i<anArray.length;i++){
      total += anArray[i]
    }
    let decimals = 0
    return this.commaAdder(Number(Math.round(total+'e'+decimals)+'e-'+decimals))
  }

  // twentyyrsavings = (plantCapacity, elecRate, sunHours) => {
  //   let total = 0
  //   let temp = 0
  //   for (let i=1;i<21;i++){
  //     temp = plantCapacity*sunHours*365*elecRate
  //     elecRate = elecRate*1.02
  //     total = total + temp
  //   }
  //   let decimals = 0
  //   return this.commaAdder(Number(Math.round(total+'e'+decimals)+'e-'+decimals))
  // }

  rounded(number, decimals) {
    return Number(Math.round(number+'e'+decimals)+'e-'+decimals)
  }

  paybackYears(cashflow, ppp, pc) {
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

  IRRCalc(values, guess) {
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

  calculate = () => {

    this.setState({warning: ''})

    this.setState({calculated: true})

    let { elecBill, roofArea, elecRate, elecType, output, settings } = this.state

    const { sunHours, freeMaintYrs, debtTenure, debtRate, elecInflation, effRed1, effRed, depPercent, depAcclPercent1, depAcclPercent2, depAcclPercent3, depAcclPercent4, taxPercent, subsidyPercent, fbElecRate, CO2factor } = this.state.settings

    this.setState({ output3: roofAreaMessage})

    if(!elecBill) {
      this.setState({warning: 'Enter a valid bill amount'})
      return
    }

    if(!this.state.canCalculate) {
      this.setState({warning: 'Settings haven\'t loaded yet, please check your internet connection and try again' })
      return
    }

    if(!elecRate) {
      this.setState({elecRate: fbElecRate})
      elecRate = '9'
    }

    const inputs = {
      elecBill: elecBill,
      elecRate: elecRate,
      elecType: elecType,
      roofArea: roofArea,
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

    this.setState({thisUserinputs:inputs})

    const outputs = initialize(inputs)
    var { plantCapacity, roofArearequired, roofAreaMessage, power_production_price, Debt, installment_full, tax_benefit_accl, cashflow_project, equity, cashflow_equity, twentyyrsavings} = outputs

    this.setState({ output: <OutputCard main={plantCapacity+' kW'} title='Plant Capacity' description={'This system will occupy approximately '+roofArearequired+' sq.ft of roof space'}/> })
    this.setState({ output2: <OutputCard main={power_production_price/1000+' ₹/W'} title='Power Rate' description={'Preliminary rate subject to change based on site conditions'}/> })
    this.setState({ output4: <OutputCard main={'₹ '+this.commaAdder(power_production_price*plantCapacity)} title='Total Cost' description={'This cost includes material, installation, commisioning and net metering.'}/> })
    this.setState({ output5: <OutputCard main={this.rounded(sunHours*365,0)+' units/kw/yr'} title='Generation' description={'System will generate around '+plantCapacity*1500+' units p.a. '} cardtype='Economics'/> })
    this.setState({ output6: <OutputCard main={'₹ '+this.commaAdder(plantCapacity*1500*elecRate)} title='Annual Savings' description={'Based on a rate of ₹ '+elecRate+' /unit'} cardtype='Economics'/> })
    this.setState({ output7: <OutputCard main={'₹ '+this.commaAdder(twentyyrsavings)} title='25 Year Savings' description={'Based on a rate escalation of '+elecInflation*100+'%'} cardtype='Economics'/> })
    this.setState({ output11: <Chart1 chartDataPC={plantCapacity} chartDataER={elecRate}/> })
    this.setState({ output12: <OutputCard main={plantCapacity*CO2factor+' tonnes'} title={'CO2 savings'} description={`Amount of CO2 emissions saved`} extra='Reducing 1 metric tonne of C02 emissions is equivalent to 26,000,000 tree seedlings grown for 10 years!' cardtype='Economics'/> })
    this.setState({ output13: <OutputCard main={this.paybackYears(cashflow_equity,equity)+' years'} title={'Equity Payback'} description={' IRR with depreciation benefit'} cardtype='Economics'/> })
    this.setState({ output14: <OutputCard main={this.paybackYears(cashflow_project,power_production_price,plantCapacity)+' years'} title={'Total Project Payback'} description={' IRR with depreciation benefit'} cardtype='Economics'/> })
//    this.setState({ output15: <OutputCard main={'₹ '+this.totalArray(tax_benefit_accl)} title={'Total Tax Benefits'} description={`Accelerated depreciation is 40%`} cardtype='Economics'/> })

    if(roofArea){
      this.setState({ output3: roofAreaMessage})
    }

    if(Debt == 0) {
      this.setState({ visibility2: { visibility: 'hidden' } })
      this.setState({ output8: '' })
      this.setState({ output9: '' })
      this.setState({ output10: '' })
    } else {
      this.setState({ visibility2: { visibility: 'visible' } })
      this.setState({ output8: <OutputCard main={Debt+' %'} title='Bank Financing' description={''} cardtype='Financing'/> })
      this.setState({ output9: <OutputCard main={debtTenure+' years / '+debtRate*100+' %'} title='Term / Interest Rate' description={''} cardtype='Financing'/> })
      this.setState({ output10: <OutputCard main={'₹ '+this.commaAdder(installment_full)} title='Equal Annual Installment' description={''} cardtype='Financing'/> })
    }

    this.setState({ visibility: { visibility: 'visible' } })

  }

  getReport = () => {
    this.setState({ showModal: true })
  }

  handleClick = () => this.setState({showModal: true})
  handleClose = () => this.setState({showModal: false})

  componentWillMount() {

    var that = this;

    base.fetch('settings', {
    context: this
  }).then(data => {
    //console.log(data)
    this.setState({ settings: data })
    this.setState({ canCalculate: true })
  }).catch(error => {
    //handle error
    console.log('Following error occured : '+ error)
  })

    fetch('http://freegeoip.net/json/').then(resp => {
      resp.json().then(function(data) {
        // do something with your data
        console.log(data)
        that.setState({ userlocation: {
          ip: data.ip,
          country: data.country_name,
          state: data.region_name,
          city: data.city
        }
      })
      });
    })

  }

  updateElecBill = (elecBill) => {
    this.setState({ elecBill: elecBill.trim() })

    // if(elecBill && this.state.calculated) {
    //   this.calculate()
    // }
  }

  updateElecType = (elecType) => {
    this.setState({ elecType: elecType.trim() })
  }

  updateRoofArea = (roofArea) => {
    this.setState({ roofArea: roofArea.trim() })
  }

  updateElecRate = (elecRate) => {
    this.setState({ elecRate: elecRate.trim() })
  }

  updateCustName = (custName) => {
    this.setState({ custName: custName.trim() })
  }

  updateCustEmailId = (custEmailId) => {
    this.setState({ custEmailId: custEmailId.trim() })
  }

  updateCustContact = (custContact) => {
    this.setState({ custContact: custContact.trim() })
  }

  updateCustCity = (city) => {
    let userlocation = this.state.userlocation
    userlocation.city = city.trim()
    this.setState({ userlocation })
  }

  updateCustState = (state) => {
    let userlocation = this.state.userlocation
    userlocation.state = state.trim()
    this.setState({ userlocation })
  }

  updateCustCountry = (country) => {
    let userlocation = this.state.userlocation
    userlocation.country = country.trim()
    this.setState({ userlocation })
  }

  toggleNotification = (message) => {
    this.setState({
      isNotificationActive: true,
      notificationMessage: message
    })
    setTimeout(()=>{ this.setState({
      isNotificationActive: false
    }) }, 5000)
  }

  submitReport = () => {
    const {custName, custContact, custEmailId, userlocation, thisUserinputs} = this.state

    console.log(`Report submitted for this guy: ${custName} ${custContact} ${custEmailId}`)
    this.setState({ showModal: false })

    var immediatelyAvailableReference = base.push('reports/', {
    data: {name: custName, emailId: custEmailId, contact: custContact, location: userlocation, calcInputs: thisUserinputs}}).
    then(newLocation => {
    this.toggleNotification("Your report is on its way")
  }).catch(err => {
    //handle error
    this.toggleNotification("Something went wrong, please submit your details again")
  });
  //available immediately, you don't have to wait for the callback to be called
  var generatedKey = immediatelyAvailableReference.key

  }

  render() {

    const { elecBill, elecType, roofArea, elecRate, warning, output, output2, output3, output4, output5, output6, output7, output8, output9, output10, output11, output12, output13, output14, output15, outputRest, visibility, visibility2, showModal, custName, custContact, custEmailId, isNotificationActive, notificationMessage, userlocation } = this.state

    const redText = {
      color: '#f44336'
    }

    return (
      <div>
      <div className='inputs'>
        <div className='elec-bill-input'>
        <label>Your monthly electricity bill</label><br/>
          <input
              type='number'
              min='0'
              max='9000000'
              placeholder='Your electicity bill'
              value={elecBill}
              onChange={(event)=> this.updateElecBill(event.target.value)}
              />
        </div>
        <div className='elec-type-input'>
        <label>Select your connection type</label><br/>
        <select
          value={elecType}
          id='dropDownId'
          onChange={(event)=> this.updateElecType(event.target.value)}>
            <option value="domestic">Domestic</option>
            <option value="nondomestic">Non-Domestic</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
        <div className='roof-area'>
          <label>Roof Area (Sq.Ft.)</label><br/>
          <input
            type='number'
            min='0'
            max='9000000'
            placeholder='Roof Area (Sq.ft.)'
            value={roofArea}
            onChange={(event)=> this.updateRoofArea(event.target.value)}
            />
        </div>

        <div className='elec-rate'>
          <label>Electricity Rate (per unit)</label><br/>
          <input
            type='number'
            min='0'
            max='100'
            placeholder='Electricity Rate (per unit)'
            value={elecRate}
            onChange={(event)=> this.updateElecRate(event.target.value)}
            />
        </div>
      </div>
      <div>
      <p style={redText}>{warning}</p>
      <button className="bttn-unite bttn-md bttn-primary" onClick={this.calculate}>&nbsp;&nbsp;&nbsp;Calculate&nbsp;&nbsp;&nbsp;</button>
      </div>
      <div style={visibility}>
        <h2>CONFIGURATION</h2>
        <hr className='hr'/>
        <div className='output-container'>
          {output}
          {output2}
          {output4}
        </div>
        <p>{output3}</p>
        <h2>ECONOMICS</h2>
        <hr className='hr'/>
        <div className='output-container'>
          {output5}
          {output6}
          {output7}
          {output11}
          {output12}
          {output13}
          {output14}
          {output15}
        </div>
        <h2 style={visibility2}>FINANCING</h2>
        <hr className='hr' style={visibility2}/>
        <div className='output-container'>
          {output8}
          {output9}
          {output10}
        </div>
        <br/>
        <button className="bttn-unite bttn-md bttn-primary" style={visibility} onClick={this.getReport}>Get detailed report</button>
      </div>

      {
        this.state.showModal &&
        <ModalContainer onClose={this.handleClose}>
          <ModalDialog onClose={this.handleClose}>
            <h1>Know More</h1>
            <p>Let us know where to send the detailed report</p>
            <div>
          <div className='modal'>
          <label>Name*</label>
          <input
          type='text'
          value={custName}
          onChange={(event)=> this.updateCustName(event.target.value)}
          />
        </div>
        <div className='modal'>
          <label>Email ID*</label>
          <input
          type='email'
          value={custEmailId}
          onChange={(event)=> this.updateCustEmailId(event.target.value)}
          />
        </div>
        <div className='modal'>
          <label>Contact No</label>
          <input
          type='tel'
          value={custContact}
          onChange={(event)=> this.updateCustContact(event.target.value)}
          />
        </div>
        <div className='modal'>
          <label>City</label>
          <input
          type='text'
          value={userlocation.city}
          onChange={(event)=> this.updateCustCity(event.target.value)}
          />
        </div>
        <div className='modal'>
          <label>State/Region</label>
          <input
          type='text'
          value={userlocation.state}
          onChange={(event)=> this.updateCustState(event.target.value)}
          />
        </div>
        <div className='modal'>
          <label>Country</label>
          <input
          type='text'
          value={userlocation.country}
          onChange={(event)=> this.updateCustCountry(event.target.value)}
          />
        </div>
        </div>
        <button className="bttn-unite bttn-md bttn-primary submit-btn" onClick={this.submitReport}>Submit</button>
          </ModalDialog>
        </ModalContainer>
        }
        <Notification
          isActive={isNotificationActive}
          message={notificationMessage}
        />
      </div>
      )
  }
}

const cardTitleStyle = {
    background : '#eee'
  }

class Chart1 extends Component {

  render(){

    let cdpc = this.props.chartDataPC
    let cder = this.props.chartDataER

    let chartData = []
    let temp1
    let decimals = 0
    for(let i=1;i<26;i++){
      temp1 = cdpc * cder * 1500
      temp1 = Number(Math.round(temp1+'e'+decimals)+'e-'+decimals)
      chartData.push({name: `Year ${i}`, 'Annual Saving':temp1, tag:'Hello'})
      cder = cder * 1.02
    }

    const data = [
    {name: "Year 1", as:120},
    {name: "2", as:240},
    {name: "3", as:320},
    {name: "4", as:560} ]

    return(
      <div className='output-card-chart'>
      <AreaChart width={1200} height={300} data={chartData}
  margin={{ top: 10, right: 40, left: 40, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="name" />
  <CartesianGrid strokeDasharray="3 3" />
  <Legend />
  <Tooltip />
  <Area type="monotone" dataKey='Annual Saving' stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
  </AreaChart>
      </div>
    )
  }
}

class OutputCard extends Component {

  static propTypes = {
    main: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }

  render(){

    const { main, title, description, cardtype, extra } = this.props

    let styler = {}

    if(cardtype == 'Economics') {
      styler = {
        background: '#43A047'
      }
    }

    if(cardtype == 'Financing') {
      styler = {
        background: '#673AB7'
      }
    }

    return(
      <div className='output-card bigEntrance'>
      <h1>{main}</h1>
      <p className='cardTitle' style={styler}>{title}</p>
      <p>{description}</p>
      { extra && <p>{extra}</p>}
      </div>
      )
  }
}


export default MiniCalculator