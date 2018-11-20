pragma solidity ^0.4.24;

import "./ChainopolyCoin.sol";
import "./ChainopolyProperties.sol";
import "./AtomicSwap.sol";

contract Game {

    struct PlayerInfo {
        string name;
        string color;
        uint256 position;
    }
    uint256 constant MAX_PLAYERS = 6;
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

    function roll() public pure {

    }

    function getPlayerInfoByIndex(uint index) public view returns (address, string, string, uint256) {
        require(index < MAX_PLAYERS);
        return getPlayerInfo(_players[index]);
    }

    function getPlayerInfo(address addr) public view returns (address, string, string, uint256) {
        require(_playerInfo[addr].position > 0);
        return (addr, _playerInfo[addr].name, _playerInfo[addr].color, _playerInfo[addr].position - 1);
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
        _properties.reset();
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

}
