var ChainopolyProperties = artifacts.require("./ChainopolyProperties.sol");

contract('ChainopolyProperties', function(accounts) {
  var meta;
  it("should mint a few tokens", function() {
    return ChainopolyProperties.deployed().then(function(instance) {
        meta = instance;
        return instance.mintWithTokenURI(0, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.mintWithTokenURI(1, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.mintWithTokenURI(2, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.balanceOf.call(accounts[0]);
    }).then(function(result) {
        assert.equal(result.toNumber(), 3);
        return meta.listTokens.call();
    }).then(function(result) {
        assert.equal(result.toNumber(), 3);
    });
  });
  it("should transfer", function() {
    var account_one = accounts[0];
    var account_two = accounts[1];
    var balance_account_one;
    var balance_account_two;

    return ChainopolyProperties.deployed().then(function(instance) {
        meta = instance;
        return instance.mintWithTokenURI(3, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.balanceOf.call(accounts[0]);
    }).then(function(balance) {
        balance_account_one = balance.toNumber();
    }).then(function() {
        return meta.balanceOf.call(accounts[1]);
    }).then(function(balance) {
        balance_account_two = balance.toNumber();
    }).then(function(result) {
        return meta.ownerOf.call(3);
    }).then(function(addr) {
        assert.equal(addr, accounts[0]);
    }).then(function(result) {
        return meta.transfer(accounts[1], 3, { from: accounts[0] });
    }).then(function() {
        return meta.ownerOf.call(3);
    }).then(function(result) {
        return meta.balanceOf.call(accounts[0]);
    }).then(function(balance) {
        assert.equal(balance_account_one - 1, balance.toNumber());
    }).then(function() {
        return meta.balanceOf.call(accounts[1]);
    }).then(function(balance) {
        assert.equal(balance_account_two + 1, balance.toNumber());
    });
  });
});
