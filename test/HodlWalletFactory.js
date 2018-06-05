var HodlWalletFactory = artifacts.require("HodlWalletFactory");

contract('HodlWalletFactory', async (accounts) => {

    it("should deploy with the default fee", async () => {
	let instance = await HodlWalletFactory.deployed();
	let fee = await instance.fee.call();
	
	let expectedDefaultFee = web3.toWei(0.01, 'ether');
	assert.equal(fee, expectedDefaultFee, "The default deployfee was wrong");
    });
});
