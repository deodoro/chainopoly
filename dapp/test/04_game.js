var Game = artifacts.require("./Game.sol");
var ChainopolyCoin = artifacts.require("./ChainopolyCoin.sol");

contract('Game', function(accounts) {
  var meta;
  it("should register players", function() {
        return Game.deployed().then(function(instance) {
            meta = instance;
            return ChainopolyCoin.deployed();
        }).then(function(_coin) {
            coin = _coin;
            return coin.balanceOf.call(accounts[0]);
        }).then(function(balance) {
            if (balance > 0)
                return coin.transfer(Game.address, balance, {from: accounts[0]});
            else
                return null;
        }).then(function(result, error) {
            return meta.getState();
        }).then(function(result) {
            assert.equal(result, 0, 'Invalid initial state');
            return meta.registerPlayer("deodoro", {from: accounts[0]});
        }).then(function(result) {
            return meta.getState.call();
        }).then(function(result) {
            assert.equal(result, 0, 'State changed on registerPlayer');
            return meta.getPlayerCount.call();
        }).then(function(result) {
            assert.equal(result.toNumber(), 1, 'One player');
            return meta.registerPlayer("mario", {from: accounts[0]})
                       .then(() => assert.ok(false))
                       .catch(() =>assert.ok(true));
        }).then(function(result) {
            return meta.getPlayerCount.call();
        }).then(function(result) {
            assert.equal(result.toNumber(), 1, 'Should not have added');
            return meta.registerPlayer("mario", {from: accounts[1]});
        }).then(function(result) {
            return meta.getPlayerCount.call();
        }).then(function(result) {
            assert.equal(result.toNumber(), 2, 'Should have added');
            return meta.getPlayerInfo.call(accounts[0]);
        }).then(function(result) {
            assert.equal(result[0], accounts[0], "Mismatch account");
            assert.equal(result[1], "deodoro", "Mismatch name");
            assert.equal(result[2], "blue", "Mismatch color");
            assert.equal(result[3].toNumber(), 0, "Mismatch position");
            return meta.getPlayerInfoByIndex.call(1);
        }).then(function(result) {
            assert.equal(result[0], accounts[1]);
            assert.equal(result[1], "mario");
            assert.equal(result[2], "red");
            assert.equal(result[3].toNumber(), 0);
        });
  });
  it("should reset", function() {
        return Game.deployed().then(function(instance) {
            meta = instance;
            return ChainopolyCoin.deployed();
        }).then(function(_coin) {
            coin = _coin;
            return meta.reset();
        }).then(function(result) {
            return meta.getState.call();
        }).then(function(result) {
            assert.equal(result, 0, 'Invalid initial state');
            return meta.getPlayerCount.call();
        }).then(function(result) {
            assert.equal(result.toNumber(), 0, 'Some player is registered');
            return coin.balanceOf.call(accounts[0]);
        }).then(function(result) {
            assert.equal(result.toNumber(), 10 ** 10, 'Balance not restored');
        });
  });
  it("should give coins away", function() {
        var coin;
        return Game.deployed().then(function(instance) {
            meta = instance;
            return ChainopolyCoin.deployed();
        }).then(function(_coin) {
            coin = _coin;
            return coin.balanceOf.call(accounts[0]);
        }).then(function(balance) {
            if (balance > 0)
                return coin.transfer(Game.address, balance, {from: accounts[0]});
            else
                return null;
        }).then(function() {
            return meta.registerPlayer("deodoro", {from: accounts[0]});
        }).then(function(result) {
            return meta.registerPlayer("mario", {from: accounts[1]});
        }).then(function(result) {
            return meta.getPlayerCount.call();
        }).then(function(result) {
            assert.equal(result.toNumber(), 2, 'Two players');
            return coin.balanceOf.call(accounts[0]);
        }).then(function(result) {
            assert.equal(result.toNumber(), 1500, 'Balance for first player')
            return coin.balanceOf.call(accounts[1]);
        }).then(function(result) {
            assert.equal(result.toNumber(), 1500, 'Balance for second player')
        });
  });
  it("should roll dice", function() {
        var coin;
        return Game.deployed().then(function(instance) {
            meta = instance;
            return ChainopolyCoin.deployed();
        }).then(function(_coin) {
            coin = _coin;
            return meta.reset();
        }).then(function() {
            return coin.balanceOf.call(accounts[0]);
        }).then(function(balance) {
            if (balance > 0)
                return coin.transfer(Game.address, balance, {from: accounts[0]});
            else
                return null;
        }).then(function() {
            return meta.registerPlayer("deodoro", {from: accounts[0]});
        }).then(function(result) {
            return meta.registerPlayer("mario", {from: accounts[1]});
        }).then(function(result) {
            return meta.roll_fixed(6);
        }).then(function(result) {
            return meta.getPlayerInfoByIndex.call(0);
        }).then(function(result) {
            assert.equal(result[3].toNumber(), 6, 'Moved')
            return meta.getPlayerInfoByIndex.call(1);
        }).then(function(result) {
            assert.equal(result[3].toNumber(), 0, 'Did not move')
            return meta.commit();
        }).then(function(result) {
            return meta.roll_fixed(2);
        }).then(function(result) {
            return meta.getPlayerInfoByIndex.call(0);
        }).then(function(result) {
            assert.equal(result[3].toNumber(), 6, 'Did not move')
            return meta.getPlayerInfoByIndex.call(1);
        }).then(function(result) {
            assert.equal(result[3].toNumber(), 2, 'Moved')
            return coin.transfer(Game.address, 60, {from: accounts[1]});
        }).then(function(result) {
            return meta.commit({from: accounts[1]});
        }).then(function(result) {
            console.log('roll');
            return meta.roll_fixed(39);
        }).then(function(result) {
            return meta.getPlayerInfoByIndex.call(0);
        }).then(function(result) {
            assert.equal(result[3].toNumber(), 5, 'Did not move')
            return coin.transfer(Game.address, 100, {from: accounts[0]});
        }).then(function(result) {
            return meta.commit();
        }).then(function(result) {
            return meta.roll();
        }).then(function(result) {
            return meta.getPlayerInfoByIndex.call(1);
        }).then(function(result) {
            assert.ok(result[3].toNumber() > 5, 'Did not move')
            assert.ok(false);
        });
  });
});
