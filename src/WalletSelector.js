import React, { Component } from 'react';
import Presenters from './utils/Presenters';

class WalletSelector extends Component {

    constructor(props) {
	super(props);

	this.state = {
	};

	this.handleWalletClick = this.handleWalletClick.bind(this);
	this.handleNewClick = this.handleNewClick.bind(this);
    }

    handleWalletClick() {
	// TODO: Once wallet instance is extracted it's own component, pass a function that calls with the proper index, or something?
	this.props.udpateSelection(0);
    }

    handleNewClick() {
	this.props.udpateSelection(-1);
    }

    render() {
	return (
	    <div style={ {margin: '1em'} }>
	      {this.props.hodlWallets
		  .map( (hodl) => <div key={hodl.address} onClick={this.handleWalletClick} style={ {backgroundColor: 'grey'} }>
			{Presenters.presentAddress(hodl.address)}, {Presenters.presentDate(hodl.deployDate)},
			    {' '}{Presenters.presentDate(hodl.withdrawDate)}, {Presenters.presentBalance(hodl.balance)}
			</div>
	      )}
		<div style={ {backgroundColor: 'lightGrey'} } onClick={this.handleNewClick}>+ New...</div>
	    </div>
	);
    }
}

export default WalletSelector;
