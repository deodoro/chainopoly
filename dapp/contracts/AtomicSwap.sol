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

    mapping (address => mapping (address => Offer)) private _offers;
    mapping (address => mapping (address => uint)) private _iou;
    uint256 private _pendingCount;

    event TransferEvent(address indexed _from, address indexed _to, uint _value);

    constructor (address coin) public {
        require(coin.call(bytes4(keccak256("registerCallback(address)")),this));
        // ChainopolyCoin _coin = ChainopolyCoin(coin);
        // coin.registerCallback(this);
    }

    function addIOU (address to, address from, uint value) public returns(bool) {
        require(value > 0);
        if (_iou[to][from] > 0)
            return false;
        else {
            _iou[to][from] = value;
            _pendingCount = _pendingCount.add(1);
            return true;
        }
    }

    function addOffer (address to, address from, uint256 tokenId, uint value) public returns(bool) {
        require(value > 0);
        if (_offers[to][from].value > 0)
            return false;
        else {
            _offers[to][from] = Offer(tokenId, value);
            _pendingCount = _pendingCount.add(1);
            return true;
        }
    }

    function isPending () public view returns(bool) {
        return _pendingCount > 0;
    }

    function OnTransfer(address to, address from, uint value) public {
        emit TransferEvent(address(0),address(0),0);
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

}
