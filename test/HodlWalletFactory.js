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

    it("should deploy a wallet", async () => {
	let instance = await HodlWalletFactory.deployed();
	let withdrawDate = (Date.now() / 1000) + 24*60*60 + 60; // One day and one minute from now
	let deployFee = await instance.fee.call();

	let txHash =
	    await instance
	    .deployWallet
	    .sendTransaction(withdrawDate, {from: accounts[1], value: deployFee});

	let balance = web3.eth.getBalance(instance.address);

	assert.equal(balance.toString(), deployFee.toString(), "The deploy fee should be in the factory balance");
    });

    it("should find a past wallet", async () => {
	let instance = await HodlWalletFactory.deployed();

	let getDeploys = new Promise( (resolve, reject) => {
	    instance
		.LogDeployment({hodler: accounts[1]}, {fromBlock: 0, toBlock: 'latest'})
		.get( (error, deploys) => {
		    if (null != error) {
			reject(error);
			return;
		    }

		    resolve(deploys);
		});
	});

	let deploys = await getDeploys;
	assert.equal(1, deploys.length);
    });
});
