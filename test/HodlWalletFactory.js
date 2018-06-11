var HodlWalletFactory = artifacts.require("HodlWalletFactory");

let assertRevert = async promise => {
  try {
    await promise;
    assert.fail('Expected revert not received');
  } catch (error) {
    const revertFound = error.message.search('revert') >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};

contract('HodlWalletFactory', async (accounts) => {

    it("should deploy with the default fee", async () => {
	let instance = await HodlWalletFactory.deployed();
	let fee = await instance.fee.call();
	
	let expectedDefaultFee = web3.toWei(0.01, 'ether');
	assert(fee.eq(expectedDefaultFee), "The default deploy fee was wrong");
    });

    it("should allow the fee to be updated", async () => {
	let instance = await HodlWalletFactory.deployed();

	let newFeeAmount = web3.toWei(0.116, 'ether');
	await instance.setFee.sendTransaction(newFeeAmount, {from: accounts[0]});

	let fee = await instance.fee.call();

	assert(fee.eq(newFeeAmount), "The deploy fee should be updated");
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

	assert(balance.eq(deployFee), "The deploy fee should be in the factory balance");

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

    it("should not allow someone other than the owner to withdraw fees", async() => {
	let instance = await HodlWalletFactory.deployed();
	await assertRevert(instance.withdraw.sendTransaction({from: accounts[1]}));
    });

    it("should allow the factory owner to withdraw fees", async() => {
	let instance = await HodlWalletFactory.deployed();
	let initOwnerBalance = web3.eth.getBalance(accounts[0]);
	let initFactoryBalance = web3.eth.getBalance(instance.address);

	await instance.withdraw.sendTransaction({from: accounts[0]});

	let finalOwnerBalance = web3.eth.getBalance(accounts[0]);
	let finalFactoryBalance = web3.eth.getBalance(instance.address);

	assert.equal(0, finalFactoryBalance, "The factory balance should have been emptied");
	assert(finalOwnerBalance.gt(initOwnerBalance), "The factory should have received a payout");
	assert(finalOwnerBalance.lt(initOwnerBalance.plus(initFactoryBalance)), "The final owner balance should include payout less transaction fees");
    });
});
