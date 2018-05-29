import React, { Component } from 'react';
import Presenter from './utils/Presenters';

class AdminInterface extends Component {

    constructor(props) {
	super(props);
	this.state = { };

	this.handleWithdraw = this.handleWithdraw.bind(this);
    }

    handleWithdraw(event) {
	event.preventDefault();
	this.props.doFeeWithdraw();
    }
    
    render() {
	return (
	    <div>
	      Fee balance: {Presenter.presentBalance(this.props.feeBalance)} <p />
	      <button onClick={this.handleWithdraw}>Withdraw Fees</button>
	    </div>
	);
    }
}

export default AdminInterface;
