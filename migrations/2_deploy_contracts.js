var HodlWalletFactory = artifacts.require("./HodlWalletFactory.sol");

module.exports = function(deployer) {
    deployer.deploy(HodlWalletFactory);
};
