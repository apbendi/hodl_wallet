import React, { Component } from 'react';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import Presenters from './utils/Presenters';

class WalletDeployer extends Component {

    constructor(props) {
	super(props);

	this.state = {
	    selectedDate: moment()
	};

	this.handleDateChange = this.handleDateChange.bind(this);
	this.handleDeploy = this.handleDeploy.bind(this);
    }

    handleDateChange(date) {
	this.setState({ selectedDate: date });
    }

    handleDeploy(event) {
	event.preventDefault();
	let unixDate = this.state.selectedDate.unix();
	this.props.doDeploy(unixDate);
    }

    render() {
	return (
	    <div>
	      <h2>Deploy Your Hodl Wallet</h2>
	      Withdraw Date: <p />
	      <DatePicker
		selected={this.state.selectedDate} 
	        onChange={this.handleDateChange} 
	        showTimeSelect
	        timeFormat="HH:mm"
	        timeInterval={15}
	        timeCaption="Time"
		dateFormat="LLL"
		minDate={moment()} 
		/>
	      <p />
	      Fee: {Presenters.presentBalance(this.props.fee)}
	      <p />
	      <button onClick={this.handleDeploy}>Deploy</button>
	    </div>
	);
    }
}

export default WalletDeployer;
