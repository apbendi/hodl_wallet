var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HodlWallet = artifacts.require("./HodlWallet.sol");

module.exports = function(deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(HodlWallet, 0);
};
