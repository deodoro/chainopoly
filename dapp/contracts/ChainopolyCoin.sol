pragma solidity ^0.4.24;

contract ChainopolyCoin {
	mapping (address => uint) balances;

	event TransferEvent(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		balances[tx.origin] = 10000;
	}

	function transfer(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit TransferEvent(msg.sender, receiver, amount);
		return true;
	}

	function balanceOf(address addr) public view returns(uint) {
		return balances[addr];
	}
}
