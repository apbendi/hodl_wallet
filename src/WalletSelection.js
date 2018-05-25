import React, { Component } from 'react';
import Presenters from './utils/Presenters';

class WalletSelection extends Component {

    constructor(props) {
	super(props);
	this.state = { };
	
	this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
	this.props.handleClick(this.props.hodl.address);
    }

    render() {
	return (
	    <div onClick={this.handleClick} style={ {backgroundColor: 'grey'} }>
	      {Presenters.presentAddress(this.props.hodl.address)}, {Presenters.presentDate(this.props.hodl.deployDate)},
	      {' '}{Presenters.presentDate(this.props.hodl.withdrawDate)}, {Presenters.presentBalance(this.props.hodl.balance)}
	    </div>
	);
    }
}

export default WalletSelection;
