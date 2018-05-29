pragma solidity ^0.4.19;

contract HodlWallet {
  
  event Deposit(uint value);
  event Withdrawl(uint date);
  
  uint deployDate;
  uint withdrawDate;
  address hodler;
    
  function HodlWallet(uint _withdrawDate, address _hodler) public {
    require(_withdrawDate > now + 10 minutes);

    deployDate = now;
    hodler = _hodler;
    withdrawDate = _withdrawDate;
  }

  function getHodler() public constant returns(address) {
    return hodler;
  }
    
  function getDeployDate() public constant returns(uint) {
    return deployDate;
  }
    
  function getWithdrawDate() public constant returns(uint) {
    return withdrawDate;
  }
    
  function getBalance() public constant returns(uint) {
    return address(this).balance;
  }

  function getAllState() public constant returns (uint, uint, uint) {
    return (deployDate, withdrawDate, getBalance());
  }
    
  function hodlMe() public isHodler isBeforeWithdraw payable {
    emit Deposit(msg.value);
  }
    
  function withdraw() public isHodler isAfterWithdraw {
    hodler.transfer(getBalance());
    emit Withdrawl(now);
  }
    
  modifier isHodler() {
    require(msg.sender == hodler);
    _;
  }
    
  modifier isBeforeWithdraw() {
    require(now < withdrawDate);
    _;
  }
    
  modifier isAfterWithdraw() {
    require(now > withdrawDate);
    _;
  }
}
