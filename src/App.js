import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import HodlWalletContract from '../build/contracts/HodlWallet.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
    constructor(props) {
	super(props)

	this.state = {
	    storageValue: 0,
	    deployDate: 0,
	    withdrawDate: 0,
	    accounts: [],
	    hodlWalletInstance: null,
	    web3: null
	}
    }

    componentWillMount() {
	// Get network provider and web3 instance.
	// See utils/getWeb3 for more info.

	getWeb3
	    .then(results => {
		this.setState({
		    web3: results.web3
		})

		this.instantiateHodlWallet();
	    })
	    .catch(() => {
		console.log('Error finding web3.')
	    })
    }

    instantiateHodlWallet() {
	const contract = require('truffle-contract');
	const hodlWallet = contract(HodlWalletContract);
	hodlWallet.setProvider(this.state.web3.currentProvider);

	this.state.web3.eth.getAccounts( (error, accounts) => {
	    this.setState({accounts: accounts})
	    
	    hodlWallet.deployed().then( (instance) => {
		this.setState({hodlWalletInstance: instance});
		this.loadDeployedDate();
		this.loadWithdrawDate();
		this.deposit(5000000000000000000);
	    });
	});
    }

    loadDeployedDate() {
	this.state.hodlWalletInstance.getDeployDate.call(this.state.accounts[0]).then( result => {
	    return this.setState({deployDate: result.c[0]});
	});
    }

    loadWithdrawDate() {
	this.state.hodlWalletInstance.getWithdrawDate.call(this.state.accounts[0]).then( result => {
	    return this.setState({withdrawDate: result.c[0]});
	});
    }

    deposit(amount) {
	this.state.hodlWalletInstance.hodlMe.sendTransaction({from: this.state.accounts[0], value: amount});
    }

    instantiateContract() {

	const contract = require('truffle-contract')
	const simpleStorage = contract(SimpleStorageContract)
	simpleStorage.setProvider(this.state.web3.currentProvider)

	// Declaring this for later so we can chain functions on SimpleStorage.
	var simpleStorageInstance

	// Get accounts.
	this.state.web3.eth.getAccounts((error, accounts) => {
	    simpleStorage.deployed().then((instance) => {
		simpleStorageInstance = instance

		// Stores a given value, 5 by default.
		return simpleStorageInstance.set(116, {from: accounts[0]})
	    }).then((result) => {
		// Get the value from the contract to prove it worked.
		return simpleStorageInstance.get.call(accounts[0])
	    }).then((result) => {
		// Update state with the result.
		return this.setState({ storageValue: result.c[0] })
	    })
	})
    }

    render() {
	return (
		<div className="App">
		<nav className="navbar pure-menu pure-menu-horizontal">
		<a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
		</nav>

		<main className="container">
		<div className="pure-g">
		<div className="pure-u-1-1">
		<h1>HODL Wallet</h1>
		<p>Deployment Date: {this.state.deployDate}</p>
		<p>Withdrawl Date: {this.state.withdrawDate}</p>
		</div>
		</div>
		</main>
		</div>
	);
    }
}

export default App
