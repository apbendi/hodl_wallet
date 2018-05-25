import React, { Component } from 'react';
import Presenters from './utils/Presenters';

class InstanceInterface extends Component {

    constructor(props) {
	super(props);

	this.state = {
	    depositAmount: 0
	};

	this.handleAmountChange = this.handleAmountChange.bind(this);
	this.handleAmountLoseFocus = this.handleAmountLoseFocus.bind(this);
	this.handleHodl = this.handleHodl.bind(this);
	this.handleWithdraw = this.handleWithdraw.bind(this);
    }

    isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
    }

    isPastWithdraw() {
	let currentUnixDate = Date.now() / 1000 + 30;
	return currentUnixDate > this.props.hodlInstance.withdrawDate;
    }

    handleAmountChange(event) {
	event.preventDefault();

	let value = event.target.value;

	if ('' === value || this.isNumeric(value)) {
	    this.setState({depositAmount: event.target.value});
	}
    }

    handleAmountLoseFocus(event) {
	event.preventDefault();

	if (!this.isNumeric(event.currentTarget.value)) {
	    this.setState({depositAmount: 0});
	}
    }

    handleHodl(event) {
	event.preventDefault();
	let weiDeposit = window.web3.toWei(this.state.depositAmount, 'ether');
	this.props.doDeposit(weiDeposit);
	this.setState({depositAmount: 0});
    }

    handleWithdraw(event) {
	event.preventDefault();
	this.props.doWithdraw();
    }

    render() {
	return (
	    <div>
	      <p>Address: {this.props.hodlInstance.address}</p>
	      <p>Deployment Date: {Presenters.presentDate(this.props.hodlInstance.deployDate)}</p>
	      <p>Withdrawl Date: {Presenters.presentDate(this.props.hodlInstance.withdrawDate)}</p>
	      <p>Hodled balance: {Presenters.presentBalance(this.props.hodlInstance.balance)}</p>
	      <form onSubmit={this.handleHodl}>
		<label>
		  Amount (ETH): <input type="text" value={this.state.depositAmount} onChange={this.handleAmountChange} onBlur={this.handleAmountLoseFocus}/>
		</label>
		<input type="submit" value="HODL" disabled={this.isPastWithdraw()} />
	      </form>
	      <button onClick={this.handleWithdraw} disabled={!this.isPastWithdraw()}>Withdraw</button>
	      <p />
	    </div>
	);
    }
}

export default InstanceInterface;
