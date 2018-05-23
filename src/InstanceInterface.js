import React, { Component } from 'react';

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

    presentDate(unixDate) {
	let date = new Date(1000*unixDate);
	return date.toString();
    }

    presentBalance(weiBalance) {
	if (null == weiBalance) {
	    return "0 ETH";
	}

	let ethString = this.props.web3.fromWei(weiBalance, 'ether').toString();
	return ethString + " ETH";
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
	let weiDeposit = this.props.web3.toWei(this.state.depositAmount, 'ether');
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
	      <p>Deployment Date: {this.presentDate(this.props.hodlInstance.deployDate)}</p>
	      <p>Withdrawl Date: {this.presentDate(this.props.hodlInstance.withdrawDate)}</p>
	      <p>Hodled balance: {this.presentBalance(this.props.hodlInstance.balance)}</p>
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
