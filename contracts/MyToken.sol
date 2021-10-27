// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract MyToken {
    string name = "Mehdi Token";
    uint256 totalSupply = 100000;
    uint8 decimals = 10;
    mapping (address => uint256) private _balances;
    
    constructor() {
        _balances[msg.sender] = totalSupply;
    }
    function balanceOf(address _owner) public view returns (uint256){
        return _balances[_owner];
    }
     function ethBalanceOf(address _owner) public view returns (uint256){
        return _owner.balance;
    }
    
    function transfer(address from, address to, uint256 value) public returns (bool) {
    require(value <= _balances[from]);
    require(to != address(0));

    _balances[from] -= value;
    _balances[to] += value;
    return true;
  }
  function buyToken() public payable {

    uint amount = msg.value * 100 / 1000000000000000000;
    require(ethBalanceOf(msg.sender) >= amount/100, "not enough ether");
    require(msg.sender != address(0));
    
    _balances[msg.sender] += amount;
  }
  function sellToken(uint amount) public payable {
    transfer(msg.sender, address(this), amount);
     payable(msg.sender).transfer(amount / 100 * 1000000000000000000);
     
  }
  function getTotalSupply() public view returns (uint256) {
      return totalSupply;
  }
    
    
    
    
}