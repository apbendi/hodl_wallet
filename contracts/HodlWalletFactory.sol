pragma solidity ^0.4.19;

import "./HodlWallet.sol";

contract HodlWalletFactory {

  event LogDeployment(address indexed hodler, address wallet);

  function HodlWalletFactory() public {
    
  }

  function deployWallet(uint _withdrawDate) public {
    HodlWallet newWallet = new HodlWallet(_withdrawDate, msg.sender);
    emit LogDeployment(msg.sender, newWallet);
  }
}

