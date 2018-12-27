var ChainopolyProperties = artifacts.require("./ChainopolyProperties.sol");

contract('ChainopolyProperties', function(accounts) {
  var meta;
  it("should mint a few tokens", function() {
    var oldBalance;
    return ChainopolyProperties.deployed().then(function(instance) {
        meta = instance;
        return meta.balanceOf.call(accounts[0]);
    }).then(function(result) {
        oldBalance = result.toNumber();
        return meta.mintWithTokenURI(1001, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.mintWithTokenURI(1002, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.mintWithTokenURI(1003, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.balanceOf.call(accounts[0]);
    }).then(function(result) {
        assert.equal(result.toNumber() - oldBalance, 3);
    });
  });
  it("should transfer", function() {
    var account_one = accounts[0];
    var account_two = accounts[1];
    var balance_account_one;
    var balance_account_two;

    return ChainopolyProperties.deployed().then(function(instance) {
        meta = instance;
        return instance.mintWithTokenURI(1004, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.balanceOf.call(accounts[0]);
    }).then(function(balance) {
        balance_account_one = balance.toNumber();
    }).then(function() {
        return meta.balanceOf.call(accounts[1]);
    }).then(function(balance) {
        balance_account_two = balance.toNumber();
    }).then(function(result) {
        return meta.ownerOf.call(1004);
    }).then(function(addr) {
        assert.equal(addr, accounts[0]);
    }).then(function(result) {
        return meta.transfer(accounts[1], 1004, { from: accounts[0] });
    }).then(function() {
        return meta.ownerOf.call(1004);
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
  it("should return tokens for an account", function() {
    return ChainopolyProperties.deployed().then(function(instance) {
        meta = instance;
        return meta.mintWithTokenURI(1005, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.mintWithTokenURI(1006, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.mintWithTokenURI(1007, '{}', {from: accounts[0]});
    }).then(function(result) {
        return meta.transfer(accounts[2], 1005, { from: accounts[0] });
    }).then(function(result) {
        return meta.transfer(accounts[2], 1006, { from: accounts[0] });
    }).then(function(result) {
        return meta.transfer(accounts[2], 1007, { from: accounts[0] });
    }).then(function(result) {
        return meta.tokensOf.call(accounts[2]);
    }).then(function(result) {
        var properties = result.filter(i => i > 0);
        return assert.equal(properties.length, 3);
    });
  });
});
