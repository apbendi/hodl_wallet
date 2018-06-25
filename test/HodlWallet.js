var HodlWallet = artifacts.require("HodlWallet");
var assertRevert = require('./helpers/assertRevert');
var TimeUtils = require('./helpers/TimeUtils');

contract ('HodlWallet', async (accounts) => {

    // GLOBAL TEST STATE

    let WithdrawOffset = 24*60*60 + 60; // One day and one minute
    let DepositAmount = web3.toWei(1.16, 'ether');
    var deployedInstance = null;

    // TESTS

    it("should deploy with default state", async () => {
	let sendWithdrawDate = await TimeUtils.latestTimeWithOffset(WithdrawOffset); // One day and one minute in the future
	deployedInstance = await HodlWallet.new(sendWithdrawDate, accounts[0]);

	let [hodler, _deployDate, withdrawDate, balance] = await deployedInstance.getWalletState.call();
	
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

	await assertRevert(deployedInstance.hodlMe.sendTransaction({from: accounts[1], value: DepositAmount}));

	let finalContractBalance = web3.eth.getBalance(deployedInstance.address);

	assert(initialContractBalance.eq(finalContractBalance), "The contract balance should not have changed");
    });

    it("should not allow the hodler to withdraw before the designated date", async() => {
	let initialContractBalance = web3.eth.getBalance(deployedInstance.address);

	await assertRevert(deployedInstance.withdraw.sendTransaction({from: accounts[0]}));

	let finalContractBalance = web3.eth.getBalance(deployedInstance.address);

	assert(initialContractBalance.eq(finalContractBalance));
    });

    it("should not allow someone other than the hodler to withdraw", async() => {
	TimeUtils.increaseTime(WithdrawOffset + 10);

	let initialContractBalance = web3.eth.getBalance(deployedInstance.address);

	await assertRevert(deployedInstance.withdraw.sendTransaction({from: accounts[1]}));

	let finalContractBalance = web3.eth.getBalance(deployedInstance.address);

	assert(initialContractBalance.eq(finalContractBalance));
    });

    it("should not allow the hodler to deposit more after the withdraw date", async() => {
	let initialContractBalance = web3.eth.getBalance(deployedInstance.address);

	await assertRevert(deployedInstance.hodlMe.sendTransaction({from: accounts[0], value: DepositAmount}));

	let finalContractBalance = web3.eth.getBalance(deployedInstance.address);

	assert(initialContractBalance.eq(finalContractBalance));
    });

    it("should allow the hodler to withdraw after the designated date", async() => {
	let initialContractBalance = web3.eth.getBalance(deployedInstance.address);
	let initialHodlerBalance = web3.eth.getBalance(accounts[0]);

	await deployedInstance.withdraw.sendTransaction({from: accounts[0]});

	let finalContractBalance = web3.eth.getBalance(deployedInstance.address);
	let finalHodlerBalance = web3.eth.getBalance(accounts[0]);

	assert(finalContractBalance.eq(0), "Contract should have been emptied");
	assert(finalHodlerBalance.gt(initialHodlerBalance), "Hodler balance should have received withdraw");
	assert(finalHodlerBalance.lt(initialHodlerBalance.plus(initialContractBalance)), "Final hodler balance should be initial less fees");
    });
});
