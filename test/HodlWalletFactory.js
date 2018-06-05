var HodlWalletFactory = artifacts.require("HodlWalletFactory");

contract('HodlWalletFactory', async (accounts) => {

    it("should deploy with the default fee", async () => {
	let instance = await HodlWalletFactory.deployed();
	let fee = await instance.fee.call();
	
	let expectedDefaultFee = web3.toWei(0.01, 'ether');
	assert.equal(fee, expectedDefaultFee, "The default deploy fee was wrong");
    });

    it("should allow the fee to be updated", async () => {
	let instance = await HodlWalletFactory.deployed();

	let newFeeAmount = web3.toWei(0.116, 'ether');
	await instance.setFee.sendTransaction(newFeeAmount, {from: accounts[0]});

	let fee = await instance.fee.call();

	assert.equal(fee, newFeeAmount, "The deploy fee should be updated");
    });
});
