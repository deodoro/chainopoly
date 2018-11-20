var ChainopolyCoin = artifacts.require("./ChainopolyCoin.sol");
var ChainopolyProperties = artifacts.require("./ChainopolyProperties.sol");
var AtomicSwap = artifacts.require("./AtomicSwap.sol");
var Game = artifacts.require("./Game.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainopolyProperties).then(instance => {
    var properties = require('../../server/assets/properties.json');
    var c = 1;
    var promises = properties.map(p => {
        return instance.mintTokenWithInfo(c++, p.name, p.color, p.price, p.rent, p.position);
    });
    return Promise.all(promises).then(() => instance);
  }).then(() => deployer.deploy(ChainopolyCoin))
    .then(() => deployer.deploy(AtomicSwap, ChainopolyCoin.address))
    .then(() => deployer.deploy(Game, AtomicSwap.address, ChainopolyCoin.address, ChainopolyProperties.address));
};
