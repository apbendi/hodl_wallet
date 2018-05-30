import React, { Component } from 'react';
import Presenter from './utils/Presenters';
import Validators from './utils/Validators';
import Web3Utils from './utils/Web3Utils';

class AdminInterface extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    newFeeAmount: 0
	};

	this.handleNewFeeAmountChange = this.handleNewFeeAmountChange.bind(this);
	this.handleNewFeeAmountLoseFocus = this.handleNewFeeAmountLoseFocus.bind(this);
	this.handleSetFee = this.handleSetFee.bind(this);
	this.handleWithdraw = this.handleWithdraw.bind(this);
    }

    handleNewFeeAmountChange(event) {
	event.preventDefault();

	let value = event.target.value;
	
	if('' === value || Validators.isNumeric(value)) {
	    this.setState({newFeeAmount: value});
	}
    }

    handleNewFeeAmountLoseFocus(event) {
	event.preventDefault();
	
	if (!Validators.isNumeric(event.currentTarget.value)) {
	    this.setState({newFeeAmount: 0});
	}
    }

    handleSetFee(event) {
	event.preventDefault();
	if (this.state.newFeeAmount <= 0) {
	    return;
	}

	let weiFee = Web3Utils.etherToWei(this.state.newFeeAmount);
	this.props.doSetFee(weiFee);
	this.setState({newFeeAmount: 0});
    }

    handleWithdraw(event) {
	event.preventDefault();
	this.props.doFeeWithdraw();
    }
    
    render() {
	return (
	    <div>
	      <p>
		Current Fee: {Presenter.presentBalance(this.props.currentFee)}
	      </p>
	      <form onSubmit={this.handleSetFee}>
		<label>
		  Set Fee (ETH):{' '}
		</label>
		<input type="text" value={this.state.newFeeAmount} onChange={this.handleNewFeeAmountChange} onBlur={this.handleNewFeeAmountLoseFocus} />
		{' '}<input type="submit" value="Submit" />
	      </form>
	      <p>
		Fee balance: {Presenter.presentBalance(this.props.feeBalance)}
	      </p>
	      <p>
		<button onClick={this.handleWithdraw}>Withdraw Fees</button>
	      </p>
	    </div>
	);
    }
}

export default AdminInterface;
