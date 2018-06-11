var HodlWallet = artifacts.require("HodlWallet");

contract ('HodlWallet', async (accounts) => {

    it("should deploy with default state", async () => {
	let sendWithdrawDate = Math.trunc(Date.now() / 1000) + 24*60*60 + 60; // One day and one minute in the future
	let instance = await HodlWallet.new(sendWithdrawDate, accounts[0]);

	let hodler = await instance.getHodler.call();
	let [_deployDate, withdrawDate, balance] = await instance.getAllState.call();
	
	assert.equal(hodler, accounts[0], "Hodler should be the deployer");
	assert(balance.eq(0), "Hodl'd balance should be 0 at deploy");
	assert(withdrawDate.eq(sendWithdrawDate), "Withdraw date should have been what was sent");
    });
});
