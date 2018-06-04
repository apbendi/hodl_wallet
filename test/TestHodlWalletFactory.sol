pragma solidity ^0.4.19;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/HodlWalletFactory.sol';

contract TestHodlWalletFactory {
  
  function testItDeploysWithTheDefaultFee() public {
    HodlWalletFactory factory = HodlWalletFactory(DeployedAddresses.HodlWalletFactory());

    Assert.equal(factory.fee(), 0.01 ether, "It should set the deployment fee");
  }
}
