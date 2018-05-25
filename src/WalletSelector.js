import React, { Component } from 'react';
import WalletSelection from './WalletSelection';

class WalletSelector extends Component {

    constructor(props) {
	super(props);
	this.state = { };

	this.handleNewClick = this.handleNewClick.bind(this);
    }

    handleWalletClick(address) {
	let walletIndex = this.props.hodlWallets.findIndex( hodl => { return hodl.address === address; });
	this.props.udpateSelection(walletIndex);
    }

    handleNewClick() {
	this.props.udpateSelection(-1);
    }

    render() {
	return (
	    <div style={ {margin: '1em'} }>
	      {this.props.hodlWallets
		  .map( (hodl) =>
			<WalletSelection
			      key={hodl.address}
			      hodl={hodl}
			      handleClick={ address => this.handleWalletClick(address) } />
	      )}
		<div style={ {backgroundColor: 'lightGrey'} } onClick={this.handleNewClick}>+ New...</div>
	    </div>
	);
    }
}

export default WalletSelector;
