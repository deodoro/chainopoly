var ChainopolyCoin = artifacts.require("./ChainopolyCoin.sol");
var ChainopolyProperties = artifacts.require("./ChainopolyProperties.sol");
var AtomicSwap = artifacts.require("./AtomicSwap.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainopolyCoin);
  deployer.deploy(ChainopolyProperties);
  deployer.deploy(AtomicSwap);
};
