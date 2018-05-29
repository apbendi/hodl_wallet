pragma solidity ^0.4.19;

import "./HodlWallet.sol";

contract HodlWalletFactory {

  address owner;
  uint public fee;

  event LogDeployment(address indexed hodler, address wallet);

  function HodlWalletFactory() public {
    owner = msg.sender;
    fee = 0.01 ether;
  }

  function setFee(uint newFee) public ownerOnly {
    fee = newFee;
  }

  function deployWallet(uint _withdrawDate) public payable paysFee {
    HodlWallet newWallet = new HodlWallet(_withdrawDate, msg.sender);
    emit LogDeployment(msg.sender, newWallet);
  }

  modifier ownerOnly() {
    require(msg.sender == owner);
    _;
  }

  modifier paysFee() {
    require(msg.value == fee);
    _;
  }
}

