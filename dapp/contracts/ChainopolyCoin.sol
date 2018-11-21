pragma solidity ^0.4.24;

contract ITransferReceiver {
    function OnTransfer(address from, address to, uint value) public;
}

contract ChainopolyCoin {
	mapping (address => uint) private _balances;
    address[] private _accounts;
    mapping (address => bool) private _accountIndexes;
    ITransferReceiver private _receiver;
    address private _myAccount;

    event XFer(address from, address to, uint amount);

	constructor() public {
		_balances[tx.origin] = 10 ** 10;
        _myAccount = tx.origin;
	}

    function checkIndex(address account) private returns (bool) {
        if (_accountIndexes[account])
            return false;
        else {
            _accountIndexes[account] = true;
            _accounts.push(account);
        }
    }

	function transfer(address receiver, uint amount) public returns (bool) {
        require(receiver != address(0));
		if (_balances[msg.sender] >= amount) {
    		_balances[msg.sender] -= amount;
    		_balances[receiver] += amount;
            checkIndex(receiver);
            if (_receiver != address(0))
                _receiver.OnTransfer(msg.sender, receiver, amount);
    		emit XFer(msg.sender, receiver, amount);
            return true;
        }
        else
            return false;
	}

	function balanceOf(address addr) public view returns(uint) {
		return _balances[addr];
	}

    function registerCallback(address receiver) public returns(bool) {
        _receiver = ITransferReceiver(receiver);
        return true;
    }

    function reset() public {
        for(uint256 i = 0; i < _accounts.length; i++) {
            _balances[_accounts[i]] = 0;
            delete _accountIndexes[_accounts[i]];
        }
        delete _accounts;
        _balances[_myAccount] = 10 ** 10;
    }

}
