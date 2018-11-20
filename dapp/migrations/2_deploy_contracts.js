var ChainopolyCoin = artifacts.require("./ChainopolyCoin.sol");
var ChainopolyProperties = artifacts.require("./ChainopolyProperties.sol");
var AtomicSwap = artifacts.require("./AtomicSwap.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainopolyProperties).then(instance => {
    var properties = require('../../server/assets/properties.json');
    var c = 1;
    var promises = properties.map(p => {
        return instance.mintTokenWithInfo(c++, p.name, p.color, p.price, p.rent, p.position);
    });
    return Promise.all(promises);
  });
  deployer.deploy(ChainopolyCoin).then(() => {
    return deployer.deploy(AtomicSwap, ChainopolyCoin.address);
  });
};
