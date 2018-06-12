var HodlWallet = artifacts.require("HodlWallet");
var assertRevert = require('./helpers/assertRevert');

contract ('HodlWallet', async (accounts) => {

    // GLOBAL TEST STATE

    var deployedInstance = null;

    // TESTS

    it("should deploy with default state", async () => {
	let sendWithdrawDate = Math.trunc(Date.now() / 1000) + 24*60*60 + 60; // One day and one minute in the future
	deployedInstance = await HodlWallet.new(sendWithdrawDate, accounts[0]);

	let hodler = await deployedInstance.getHodler.call();
	let [_deployDate, withdrawDate, balance] = await deployedInstance.getAllState.call();
	
	assert.equal(hodler, accounts[0], "Hodler should be the deployer");
	assert(balance.eq(0), "Hodl'd balance should be 0 at deploy");
	assert(withdrawDate.eq(sendWithdrawDate), "Withdraw date should have been what was sent");
    });

    it("should allow the hodler to hodl some ETH", async() => {
	let initialAccountBalance = web3.eth.getBalance(accounts[0]);

	let hodlAmount = web3.toWei(1.16, 'ether');
	await deployedInstance.hodlMe.sendTransaction({from: accounts[0], value: hodlAmount});

	let finalAccountBalance = web3.eth.getBalance(accounts[0]);
	let hodlBalance = web3.eth.getBalance(deployedInstance.address);

	assert(hodlBalance.eq(hodlAmount), "The contract balance should have been the hodl'd amount");
	assert(finalAccountBalance.lt(initialAccountBalance), "The hodler balance should have been less the hodl'd balance");
    });

    it("should not allow someone else to deposit ETH", async() => {
	let initialContractBalance = web3.eth.getBalance(deployedInstance.address);

	let notHodler = accounts[1];
	let hodlAmount = web3.toWei(1.16, 'ether');

	await assertRevert(deployedInstance.hodlMe.sendTransaction({from: notHodler, value: hodlAmount}));

	let finalContractBalance = web3.eth.getBalance(deployedInstance.address);

	assert(initialContractBalance.eq(finalContractBalance), "The contract balance should not have changed");
    });
});
