import React, { Component } from 'react'
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
	    hodlBalance: 0,
	    depositAmount: 0,
	    accounts: [],
	    hodlWalletInstance: null,
	    web3: null
	}

	this.handleDepositClick = this.handleDepositClick.bind(this);
	this.withdraw = this.withdraw.bind(this);
	this.handleAmountChange = this.handleAmountChange.bind(this);
    }

    componentWillMount() {
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

    loadHodlBalance() {
	this.state.hodlWalletInstance.getBalance.call(this.state.accounts[0]).then( result => {
	    return this.setState({hodlBalance: result.c[0]});
	});
    }

    deposit(amount) {
	this.state.hodlWalletInstance.hodlMe.sendTransaction({from: this.state.accounts[0], value: amount}).then( result => {
	    this.loadHodlBalance();
	});
    }

    withdraw() {
	this.state.hodlWalletInstance.withdraw.sendTransaction({from: this.state.accounts[0]}).then( result => {
	    this.loadHodlBalance();
	});
    }

    handleDepositClick(event) {
	this.deposit(this.state.depositAmount);
	this.setState({depositAmount: 0});
    }

    handleAmountChange(event) {
	this.setState({depositAmount: event.target.value});
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
		<p>Hodled balance: {this.state.hodlBalance}</p>
		<form onSubmit={this.handleDepositClick}>
		  <label>
		    Amount: <input type="text" value={this.state.depositAmount} onChange={this.handleAmountChange} />
		  </label>
		  <input type="submit" value="HODL" />
		</form>
		<button onClick={this.withdraw}>Withdraw</button>
		</div>
		</div>
		</main>
		</div>
	);
    }
}

export default App
