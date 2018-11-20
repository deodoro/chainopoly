pragma solidity ^0.4.24;

contract Property {

    string private _name;
    string private _color;
    uint256 private _price;
    uint256 private _rent;
    uint256 private _position;

    constructor(string name, string color, uint256 price, uint256 rent, uint256 position) public {
        _name = name;
        _color = color;
        _price = price;
        _rent = rent;
        _position = position;
    }

    function getName() public view returns(string) {
        return _name;
    }

    function getColor() public view returns(string) {
        return _color;
    }

    function getPrice() public view returns(uint256) {
        return _price;
    }

    function getRent() public view returns(uint256) {
        return _rent;
    }

    function getPosition() public view returns(uint256) {
        return _position;
    }

}
