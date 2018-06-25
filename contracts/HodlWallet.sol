pragma solidity ^0.4.24;

contract HodlWallet {
  
  event Deposit(uint value);
  event Withdrawl(uint date);
  
  uint deployDate;
  uint withdrawDate;
  address hodler;
    
  constructor(uint _withdrawDate, address _hodler) public {
    require(_withdrawDate > now + 10 minutes);

    deployDate = now;
    hodler = _hodler;
    withdrawDate = _withdrawDate;
  }

  function getWalletState() public constant returns (address, uint, uint, uint) {
    return (hodler, deployDate, withdrawDate, address(this).balance);
  }
    
  function hodlMe() public isHodler isBeforeWithdraw payable {
    emit Deposit(msg.value);
  }
    
  function withdraw() public isHodler isAfterWithdraw {
    hodler.transfer(address(this).balance);
    emit Withdrawl(now);
  }
    
  modifier isHodler() {
    require(msg.sender == hodler, "Caller was not the hodler");
    _;
  }
    
  modifier isBeforeWithdraw() {
    require(now < withdrawDate, "Called after the withdraw date");
    _;
  }
    
  modifier isAfterWithdraw() {
    require(now > withdrawDate, "Called before teh withdraw date");
    _;
  }
}
