pragma solidity ^0.4.19;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/HodlWalletFactory.sol';

contract TestHodlWalletFactory {

  uint public initialBalance = 1 ether;
  
  function testItDeploysWithTheDefaultFeeAndUpdatesItLater() public {
    HodlWalletFactory factory = new HodlWalletFactory();

    Assert.equal(factory.fee(), 0.01 ether, "It should deploy the factory with the default fee");

    factory.setFee(0.116 ether);

    Assert.equal(factory.fee(), 0.116 ether, "It should update the factory deployment fee");
  }

  function testItDeploysAWallet() public {
    HodlWalletFactory factory = new HodlWalletFactory();

    factory.deployWallet.value(0.01 ether)(now + 2 days);
    
    Assert.equal(factory.getBalance(), 0.01 ether, "It should have the fee in the contract balance");

    factory.setFee(0.02 ether);
    factory.deployWallet.value(0.02 ether)(now + 10 days);

    Assert.equal(factory.fee(), 0.02 ether, "It should update the deployment fee after a previous deployment");
    Assert.equal(factory.getBalance(), 0.03 ether, "It should have additional fee after deployment");
  }

  /* function testItAllowsForBalanceWithdraw() public { */
  /*   HodlWalletFactory factory = new HodlWalletFactory(); */

  /*   factory.deployWallet.value(0.01 ether)(now + 2 days); */
  /*   uint preWithdrawBalance = address(this).balance; */
    
  /*   factory.withdraw(); */

  /*   Assert.equal(address(this).balance, preWithdrawBalance + 0.03 ether, "It should withdraw deployment fees for the factory owner"); */
  /* } */
}
