import React, { Component } from 'react'
import HodlWalletContract from '../build/contracts/HodlWallet.json'
import HodlWalletFactory from '../build/contracts/HodlWalletFactory.json'
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
	    hodlBalance: null,
	    depositAmount: 0,
	    accounts: [],
	    hodlWalletInstance: null,
	    hodlWalletContract: null,
	    hodlFactoryInstance: null,
	    web3: null
	}

	this.handleDepositClick = this.handleDepositClick.bind(this);
	this.withdraw = this.withdraw.bind(this);
	this.deploy = this.deploy.bind(this);
	this.handleAmountChange = this.handleAmountChange.bind(this);
    }

    componentWillMount() {
	getWeb3
	    .then( results => {
		this.setState({
		    web3: results.web3
		});
		
		this.instantiateHodlFactory();
		this.instantiateHodlWallet();
	    })
	    .catch( error => {
		console.log('Error finding web3.');
		console.log(error);
	    })
    }

    instantiateHodlFactory() {
	const contract = require('truffle-contract');
	const factory = contract(HodlWalletFactory);
	factory.setProvider(this.state.web3.currentProvider);
	
	this.state.web3.eth.getAccounts( (error, accounts) => {
	    if (null != error) {
		console.log("Error getting accounts: " + error);
		return;
	    }
	    
	    this.setState({accounts: accounts});

	    factory
		.deployed()
		.then( instance => {
		    console.log(instance);
		    this.setState({hodlFactoryInstance: instance});		    
		    this.listenForDeploys();
		})
		.catch( error => {
		    console.log("Error finding factory: " + error);
		});	    
	});
    }

    listenForDeploys() {
	this.state.hodlFactoryInstance.LogDeployment( (error, result) => {
	    if (null != error) {
		console.log("Deploy Listen Error: " + error);
		return;
	    }

	    console.log(result);
	});
    }

    instantiateHodlWallet() {
	const contract = require('truffle-contract');
	this.setState({
	    hodlWalletContract: contract(HodlWalletContract)
	});

	this.state.hodlWalletContract.setProvider(this.state.web3.currentProvider);

	this.state.web3.eth.getAccounts( (error, accounts) => {
	    if (null != error) {
		console.log("Error getting accounts" + error);
		return;
	    }

	    this.setState({accounts: accounts})
	    
	    // hodlWallet
	    // 	.deployed()
	    // 	.then( instance => {
	    // 	    console.log("Deployed");
	    // 	    this.setState({hodlWalletInstance: instance});
	    // 	    this.watchForEvents();
	    // 	    this.loadDeployedDate();
	    // 	    this.loadWithdrawDate();
	    // 	    this.loadHodlBalance();
	    // 	})
	    // 	.catch( error => {
	    // 	    console.log(error);
	    // 	});
	});
    }

    watchForEvents() {
	this.state.hodlWalletInstance.Deposit( (error, result) => {
	    if (null != error) {
		console.log(error);
		return;
	    }

	    this.loadHodlBalance();
	});

	this.state.hodlWalletInstance.Withdrawl( (error, result) => {
	    if (null != error) {
		console.log(error);
		return;
	    }

	    this.loadHodlBalance();
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
	    return this.setState({hodlBalance: result});
	});
    }

    deposit(amount) {
	this.state.hodlWalletInstance
	    .hodlMe
	    .sendTransaction({from: this.state.accounts[0], value: amount})
	    .then( txHash => {
		console.log(txHash);
		this.loadHodlBalance();
	    })
	    .catch( error => {
		console.log(error);
	    });
    }

    withdraw() {
	this.state.hodlWalletInstance
	    .withdraw
	    .sendTransaction({from: this.state.accounts[0]})
	    .then( txHash => {
		console.log(txHash);
	    })
	    .catch( error => {
		console.log(error);
	    });
    }

    deploy() {
	this.state.hodlFactoryInstance
	    .deployWallet
	    .sendTransaction(0, {from: this.state.accounts[0]})
	    .then( txHash => {
		console.log(txHash);
	    })
	    .catch( error => {
		console.log("Deployment Error: " + error);
	    });
    }

    handleDepositClick(event) {
	event.preventDefault();
	let weiDeposit = this.state.web3.toWei(this.state.depositAmount, 'ether');
	this.deposit(weiDeposit);
	this.setState({depositAmount: 0});
    }

    handleAmountChange(event) {
	this.setState({depositAmount: event.target.value});
    }

    presentDate(unixDate) {
	let date = new Date(1000*unixDate);
	return date.toString();
    }

    presentBalance(weiBalance) {
	if (null == this.state.web3) {
	    return 'Loading...';
	}

	if (null == this.state.hodlBalance) {
	    return "0 ETH";
	}

	let ethString = this.state.web3.fromWei(weiBalance, 'ether').toString();
	return ethString + " ETH";
    }

    render() {
	return (
		<div className="App">
		<nav className="navbar pure-menu pure-menu-horizontal">
		<a href="#" className="pure-menu-heading pure-menu-link">HODL Wallet</a>
		</nav>

		<main className="container">
		<div className="pure-g">
		<div className="pure-u-1-1">
		<h2>Your HODL Wallet</h2>
		<p>Deployment Date: {this.presentDate(this.state.deployDate)}</p>
		<p>Withdrawl Date: {this.presentDate(this.state.withdrawDate)}</p>
		<p>Hodled balance: {this.presentBalance(this.state.hodlBalance)}</p>
		<form onSubmit={this.handleDepositClick}>
		  <label>
		   Amount (ETH): <input type="text" value={this.state.depositAmount} onChange={this.handleAmountChange} />
		  </label>
		  <input type="submit" value="HODL" />
		</form>
		<button onClick={this.withdraw}>Withdraw</button>
		<button onClick={this.deploy}>Deploy</button>
		</div>
		</div>
		</main>
		</div>
	);
    }
}

export default App
