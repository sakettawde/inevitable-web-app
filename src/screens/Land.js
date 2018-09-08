import React, { Component } from "react"
import { loginWithGoogle } from "../util/helper";
import { PageContainer, Button } from "../comps/Styles";
import Loader from "../comps/Loading"

class Land extends Component {
  state = { loading: false}

  enterClicked = () => {
    this.setState({loading:true})
    loginWithGoogle()
  }

  render() {

    if(this.state.loading){
      return(<Loader/>)
    }

    return (
      <PageContainer style={{height:"100vh", alignItems:"center", justifyContent:"center"}}>
        <h1>A new Inevitable Web App</h1>
        <p style={{paddingLeft: 12, paddingRight:12, textAlign:"center"}}>Click to sign in with your Google ID</p>
        <br/>
        <Button onClick={this.enterClicked}><span>GET IN</span></Button>
      </PageContainer>
    )
  }
}

export default Land
