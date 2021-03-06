import React, { Component } from 'react';
import InstanceInterface from './InstanceInterface';
import WalletDeployer from './WalletDeployer';
import WalletSelector from './WalletSelector';
import AdminInterface from './AdminInterface';

import HodlWalletContract from '../build/contracts/HodlWallet.json';
import HodlWalletFactory from '../build/contracts/HodlWalletFactory.json';
import getWeb3 from './utils/getWeb3';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

class HodlInstance {

    constructor(address) {
	this.address = address;
	this.balance = null;
	this.deployDate = null;
	this.withdrawDate = null;
	this.contract = null;
    }
}

class App extends Component {
    constructor(props) {
	super(props);

	this.state = {
	    storageValue: 0,
	    depositAmount: 0,
	    hodlWallets: [],
	    selectedHodlIndex: -1,
	    factoryOwner: '0x0',
	    deployFee: null,
	    factoryBalance: 0,
	    accounts: [],
	    hodlFactoryInstance: null,
	    web3: null
	};
    }

    // GETTERS

    get selectedHodl() {
	console.assert(this.state.selectedHodlIndex < this.state.hodlWallets.length, "Illegal Hodl Index: " + this.state.selectedHodlIndex);

	if (this.state.selectedHodlIndex < 0 || this.state.selectedHodlIndex >= this.state.hodlWallets.length) {
	    return null;
	}

	return this.state.hodlWallets[this.state.selectedHodlIndex];
    }

    get isAdmin() {
	return this.state.accounts[0] === this.state.factoryOwner;
    }

    get shouldShowAdminInterface() {
	return this.state.selectedHodlIndex === -2  && this.isAdmin; // TODO: gross magic numbers; whole idea of storing index as state needs a rethink.
    }

    // LIFECYCLE

    componentWillMount() {
	getWeb3
	    .then( results => {
		this.setState({
		    web3: results.web3
		});
		
		this.instantiateHodlFactory();
	    })
	    .catch( error => {
		console.log('Error finding web3.');
		console.log(error);
	    });
    }

    // SETUP & DATA LOADING

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
		    this.getFactoryState();
		    this.getPastDeploys();
		    this.listenForDeploys();
		})
		.catch( error => {
		    console.log("Error finding factory: " + error);
		});	    
	});
    }

    getFactoryState() {
	this.state.hodlFactoryInstance
	    .getFactoryState
	    .call(this.state.accounts[0])
	    .then( result => {
		this.setState({
		    factoryOwner: result[0],
		    deployFee: result[1],
		    factoryBalance: result[2]
		});
	    })
	    .catch(error => {
		console.log("Error fetching deployment fee: " + error);
	    });
    }

    getPastDeploys() {
	this.state.hodlFactoryInstance
	    .LogDeployment({hodler: this.state.accounts[0]}, {fromBlock: 0, toBlock: 'latest'})
	    .get( (error, deploys) => {
		if (null != error) {
		    console.log("Deploy Listen Error: " + error);
		    return;
		}

		if (deploys.length <= 0) {
		    console.log("No wallets");
		    return;
		}

		let hodls = deploys.map( deploy => {
		    let address = deploy.args.wallet;
		    return new HodlInstance(address);
		});
		this.setState({hodlWallets: hodls, selectedHodlIndex: 0});

		this.instantiateHodlContracts();
		this.loadHodlWalletsData();
		this.listenForHodlEvents();
	    });
    }

    instantiateHodlContracts() {
	const contract = require('truffle-contract');
	const wallet = contract(HodlWalletContract);
	wallet.setProvider(this.state.web3.currentProvider);

	let contractHodls =
	    this.state.hodlWallets.map( hodl => {
		let newHodl = Object.assign({}, hodl);
		newHodl.contract = wallet.at(hodl.address);
		return newHodl;
	    });

	this.setState({hodlWallets: contractHodls});
    }

    loadHodlWalletsData() {
	for (var i = 0; i < this.state.hodlWallets.length; i++) {
	    this.loadWalletAtIndex(i);
	}
    }

    loadWalletAtIndex(index) {
	let contract = this.state.hodlWallets[index].contract;

	contract
	    .getWalletState
	    .call(this.state.accounts[0])
	    .then( result => {
		let wallets = this.state.hodlWallets.slice();
		wallets[index].deployDate = result[1].c[0];
		wallets[index].withdrawDate = result[2].c[0];
		wallets[index].balance = result[3];
		return this.setState({hodlWallets: wallets});
	    })
	    .catch( error => {
		console.log(error);
	    });
    }

    // EVENT LISTENING

    listenForDeploys() {
	this.state.hodlFactoryInstance
	    .LogDeployment({hodler: this.state.accounts[0]}, (error, result) => {
		if (error != null) {
		    console.log(error);
		    return;
		}

		this.getPastDeploys();
	    });
    }

    listenForHodlEvents() {
	this.selectedHodl.contract.Deposit( (error, result) => {
	    if (null != error) {
		console.log(error);
		return;
	    }

	    this.loadHodlWalletsData();
	});

	this.selectedHodl.contract.Withdrawl( (error, result) => {
	    if (null != error) {
		console.log(error);
		return;
	    }

	    this.loadHodlWalletsData();
	});
    }

    // CONTRACT ACTIONS

    deploy(withdrawDateUnix) {
	this.state.hodlFactoryInstance	
	    .deployWallet
	    .sendTransaction(withdrawDateUnix, {from: this.state.accounts[0], value: this.state.deployFee})
	    .then( txHash => {
		console.log(txHash);
	    })
	    .catch( error => {
		console.log("Deployment Error: " + error);
	    });
    }

    deposit(amount) {
	this.selectedHodl
	    .contract
	    .hodlMe
	    .sendTransaction({from: this.state.accounts[0], value: amount})
	    .then( txHash => {
		console.log(txHash);
		this.loadHodlWalletsData();
	    })
	    .catch( error => {
		console.log(error);
	    });
    }

    withdraw() {
	this.selectedHodl
	    .contract
	    .withdraw
	    .sendTransaction({from: this.state.accounts[0]})
	    .then( txHash => {
		console.log(txHash);
	    })
	    .catch( error => {
		console.log(error);
	    });
    }

    setFee(newFeeAmount) {
	this.state.hodlFactoryInstance
	    .setFee
	    .sendTransaction(newFeeAmount, {from: this.state.accounts[0]})
	    .then( txHash => {
		console.log(txHash);
	    })
	    .catch( error => {
		console.log("Set Fee Error: " + error);
	    });
	
    }

    withdrawFees() {
	this.state.hodlFactoryInstance
	    .withdraw
	    .sendTransaction({from: this.state.accounts[0]})
	    .then( txHash => {
		console.log(txHash);
	    })
	    .catch( error => {
		console.log(error);
	    });
    }

    // RENDERING

    render() {
	let interfaceBody;

	if (this.shouldShowAdminInterface) {
	    interfaceBody = (
		<AdminInterface
		  currentFee={this.state.deployFee}
		  feeBalance={this.state.factoryBalance}
		  doSetFee={ newFeeAmount => { this.setFee(newFeeAmount); } }
		  doFeeWithdraw={ () => { this.withdrawFees(); } }
		  />
	    );
	} else if (null === this.selectedHodl) {
	    interfaceBody = (
		  <WalletDeployer 
		    fee={this.state.deployFee}
		    doDeploy={ withdrawDate => { this.deploy(withdrawDate); } }
		    />
	    );
	} else {
	    interfaceBody = (
		<div>
		  <h2>Your HODL Wallet</h2>
		  <InstanceInterface 
		    hodlInstance={this.selectedHodl}
		    doDeposit={ amount => { 
			this.deposit(amount);
		    }}
		    doWithdraw={ () => {
			this.withdraw();
		    }}
		    />
		</div>
	    );
	}

	return (
	    <div className="App">
	      <nav className="navbar pure-menu pure-menu-horizontal">
		<a href="#" className="pure-menu-heading pure-menu-link">HODL Wallet</a>
	      </nav>
	      
	      <main className="container">
		<div className="pure-g">
		  <div className="pure-u-1-1">
		    <WalletSelector 
		      isAdmin={this.isAdmin}
		      hodlWallets={this.state.hodlWallets} 
		      udpateSelection={ index => {
			  this.setState({selectedHodlIndex: index});
		      }}
		      />
		    {interfaceBody}
		  </div>
		</div>
	      </main>
	    </div>
	);
    }
}

export default App;
