pragma solidity ^0.4.24;

import "./openzeppelin/math/SafeMath.sol";
import "./openzeppelin/utils/Address.sol";
import "./ChainopolyCoin.sol";

contract AtomicSwap is ITransferReceiver {
    using SafeMath for uint256;
    using Address for address;

    struct Offer {
        uint256 tokenId;
        uint value;
    }

    struct Key {
        address to;
        address from;
    }

    mapping (address => mapping (address => Offer)) private _offers;
    mapping (address => mapping (address => uint)) private _iou;
    uint256 private _pendingCount;

    event TraceEvent(string text, address _from, address _to, uint _value);

    constructor (address coin) public {
        (ChainopolyCoin(coin)).registerCallback(this);
    }

    function addIOU (address from, address to, uint value) public returns(bool) {
        require(value > 0);

        emit TraceEvent('iou', to, from, value);
        _pendingCount = _pendingCount.add(1);
        if (_iou[to][from] > 0)
            return false;
        else {
            _iou[to][from] = value;
            return true;
        }
    }

    function addOffer (address from, address to, uint256 tokenId, uint value) public returns(bool) {
        require(value > 0);

        emit TraceEvent('offer', to, from, value);
        _pendingCount = _pendingCount.add(1);
        if (_offers[to][from].value > 0)
            return false;
        else {
            _offers[to][from] = Offer(tokenId, value);
            return true;
        }
    }

    function isPending () public view returns(bool) {
        return _pendingCount > 0;
    }

    function OnTransfer(address from, address to, uint value) public {
        if (_pendingCount > 0) {
            if (_iou[to][from] == value) {
                _iou[to][from] = 0;
                _pendingCount = _pendingCount.sub(1);
            }
            else {
                if (_offers[to][from].value == value) {
                    _offers[to][from] = Offer(0,0);
                    _pendingCount = _pendingCount.sub(1);
                }
            }
        }
    }

    function reset() public {
        _pendingCount = 0;
    }

}
