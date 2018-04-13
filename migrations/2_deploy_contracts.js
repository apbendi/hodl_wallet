var HodlWallet = artifacts.require("./HodlWallet.sol");

module.exports = function(deployer) {
    deployer.deploy(HodlWallet, 0);
};
