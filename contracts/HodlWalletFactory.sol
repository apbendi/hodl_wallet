pragma solidity ^0.4.19;

import "./HodlWallet.sol";

contract HodlWalletFactory {

  address owner;
  uint fee;

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

  function getFactoryState() public constant returns (address, uint, uint) {
    return (owner, fee, address(this).balance);
  }

  function withdraw() public ownerOnly {
    owner.transfer(address(this).balance);
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

