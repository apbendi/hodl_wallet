pragma solidity ^0.4.19;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/HodlWalletFactory.sol';

contract TestHodlWalletFactory {
  
  function testItDeploysWithTheDefaultFeeAndUpdatesItLater() public {
    HodlWalletFactory factory = new HodlWalletFactory();

    Assert.equal(factory.fee(), 0.01 ether, "It should deploy the factory with the default fee");

    factory.setFee(0.116 ether);

    Assert.equal(factory.fee(), 0.116 ether, "It should update the factory deployment fee");
  }
}
