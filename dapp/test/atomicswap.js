var AtomicSwap = artifacts.require("./AtomicSwap.sol");

contract('AtomicSwap', function(accounts) {
  var meta;
  it("should add iou", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        return AtomicSwap.deployed().then(function(instance) {
            meta = instance;
            return meta.isPending.call();
        }).then(function(result) {
            assert.ok(!result);
            return meta.addIOU(account_two, account_one, 100, {from: account_one});
        }).then(function(result) {
            assert.ok(result);
            return meta.isPending();
        }).then(function(result) {
            assert.ok(result);
            return meta.TransferReceived(account_two, account_one, 100);
        }).then(function(result) {
            return meta.isPending();
        }).then(function(result) {
            assert.ok(!result);
        });
  });
  it("should add offer", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        return AtomicSwap.deployed().then(function(instance) {
            meta = instance;
            return meta.isPending.call();
        }).then(function(result) {
            assert.ok(!result);
            return meta.addOffer(account_two, account_one, 1, 100, {from: account_one});
        }).then(function(result) {
            assert.ok(result);
            return meta.isPending();
        }).then(function(result) {
            assert.ok(result);
            return meta.TransferReceived(account_two, account_one, 100);
        }).then(function(result) {
            return meta.isPending();
        }).then(function(result) {
            assert.ok(!result);
        });
  });
  it("should be pending with either iou or offer", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        return AtomicSwap.deployed().then(function(instance) {
            meta = instance;
            return meta.isPending.call();
        }).then(function(result) {
            assert.ok(!result);
            return meta.addOffer(account_two, account_one, 1, 100, {from: account_one});
        }).then(function(result) {
            assert.ok(result);
            return meta.addIOU(account_two, account_one, 101, {from: account_one});
        }).then(function(result) {
            assert.ok(result);
            return meta.isPending();
        }).then(function(result) {
            assert.ok(result);
            return meta.TransferReceived(account_two, account_one, 100);
        }).then(function(result) {
            return meta.isPending();
        }).then(function(result) {
            assert.ok(result);
            return meta.TransferReceived(account_two, account_one, 101);
        }).then(function(result) {
            return meta.isPending();
        }).then(function(result) {
            assert.ok(!result);
        });
  });
});
