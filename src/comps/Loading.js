import React, { Component } from 'react';
import Sentry from 'react-activity/lib/Sentry';
import 'react-activity/lib/Sentry/Sentry.css';

class Loader extends Component {
    state = { loading: false }
    render() {
        return (
            <div style={{display:"flex", height:"100vh", alignItems:"center", justifyContent:"center"}}>
            <Sentry color="#3F51B5" size={46} speed={0.75} animating={true} />
            </div>
        );
    }
}

export default Loader;