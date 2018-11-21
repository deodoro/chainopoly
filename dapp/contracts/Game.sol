pragma solidity ^0.4.24;

import "./ChainopolyCoin.sol";
import "./ChainopolyProperties.sol";
import "./Property.sol";
import "./AtomicSwap.sol";

contract Game {

    struct PlayerInfo {
        string name;
        string color;
        uint256 position;
    }

    event ActionEvent(string msg, address src, address target, uint256 value);

    uint256 constant MAX_PLAYERS = 6;
    uint256 constant BOARD_SIZE = 40;
    string[6] COLORS = ["blue", "red", "purple", "green", "orange", "darkturquoise"];

    address _owner;
    address[] _players;
    uint _curPlayer;
    mapping (address => PlayerInfo) _playerInfo;
    AtomicSwap _swap;
    enum State { INIT, MOVE, WAIT, FINISHED }
    State _state;
    ChainopolyCoin _coin;
    ChainopolyProperties _properties;

    event StateEvent(State state);
    event MoveEvent(address player, uint position);

    constructor(AtomicSwap swap, ChainopolyCoin coin, ChainopolyProperties properties) public {
        _state = State.INIT;
        _swap = AtomicSwap(swap);
        _coin = ChainopolyCoin(coin);
        _properties = ChainopolyProperties(properties);
        _owner = tx.origin;
    }

    function registerPlayer(string name) public {
        require(_state == State.INIT && _players.length < MAX_PLAYERS && _playerInfo[msg.sender].position == 0);
        require(_coin.transfer(msg.sender, 1500));
        _playerInfo[msg.sender] = PlayerInfo(name, COLORS[_players.length], 1);
        _players.push(msg.sender);
    }

    function _roll(uint dice) private {
        string memory action;
        address from;
        address to;
        uint256 value;
        require(_state == State.INIT || _state == State.MOVE);
        if (_state == State.MOVE)
            _curPlayer = (_curPlayer + 1) % _players.length;
        updatePlayerPosition(dice);
        (action, from, to, value) = preparePlayerAction();
        emit ActionEvent(action, from, to, value);
    }

    function roll() public {
        _roll(random());
    }

    function roll_fixed(uint dice) public {
        _roll(dice);
    }

    function getPlayerInfoByIndex(uint index) public view returns (address, string, string, uint256, bool) {
        require(index < MAX_PLAYERS);
        return getPlayerInfo(_players[index]);
    }

    function getPlayerInfo(address addr) public view returns (address, string, string, uint256, bool) {
        require(_playerInfo[addr].position > 0);
        return (addr, _playerInfo[addr].name, _playerInfo[addr].color, _playerInfo[addr].position - 1, isCurrentPlayer(addr));
    }

    function setState(State newState) private {
        _state = newState;
        emit StateEvent(_state);
    }

    function reset() public {
        require(msg.sender == _owner);
        _state = State.INIT;
        _swap.reset();
        _coin.reset();
        _properties.resetTo(this);
        _curPlayer = 0;
        for (uint i = 0; i < _players.length; i++) {
            delete _playerInfo[_players[i]];
        }
        delete(_players);
    }

    function getState() public view returns(State) {
        return _state;
    }

    function getPlayerCount() public view returns(uint256) {
        return _players.length;
    }

    function updatePlayerPosition(uint dice) private {
        _playerInfo[getCurrentPlayer()].position = (_playerInfo[getCurrentPlayer()].position + dice) % BOARD_SIZE;
        setState(State.WAIT);
        emit MoveEvent(getCurrentPlayer(), _playerInfo[getCurrentPlayer()].position-1);
    }

    function random() private view returns (uint8) {
        return 1 + uint8(uint256(keccak256(block.timestamp, block.difficulty))%12);
    }

    function getCurrentPlayer() public view returns(address) {
        return _players[_curPlayer];
    }

    function isCurrentPlayer(address player) public view returns (bool) {
        return player == getCurrentPlayer();
    }

    function commit() public {
        if (_state == State.WAIT && isCurrentPlayer(msg.sender) && !_swap.isPending()) {
            emit ActionEvent("commit", msg.sender, address(0), 0);
            setState(State.MOVE);
        }
    }

    function preparePlayerAction() private returns(string, address, address, uint256) {
        address curPlayer = getCurrentPlayer();
        uint256 tokenId = _properties.getTokenByPosition(_playerInfo[curPlayer].position);
        if (tokenId == 0) {
            return ("parking", curPlayer, address(0), 0);
        }
        else {
            address prop_owner = _properties.ownerOf(tokenId);
            Property prop = Property(_properties.getTokenContract(tokenId));

            if (prop_owner == address(this)) {
                _swap.addOffer(curPlayer, this, tokenId, prop.getPrice());
                return ("buy", curPlayer, this, prop.getPrice());
            }
            else {
                _swap.addIOU(curPlayer, prop_owner, prop.getRent());
                return ("rent", curPlayer, prop_owner, 0);
            }
        }
    }

}
