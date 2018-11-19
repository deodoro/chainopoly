pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ChainopolyCoin.sol";

contract TestChainopolyCoin {

  function testInitialBalanceUsingDeployedContract() public {
    ChainopolyCoin meta = ChainopolyCoin(DeployedAddresses.ChainopolyCoin());

    uint expected = 10000;

    Assert.equal(meta.balanceOf(tx.origin), expected, "Owner should have 10000 ChainopolyCoin initially");
  }

  function testInitialBalanceWithNewChainopolyCoin() public {
    ChainopolyCoin meta = new ChainopolyCoin();

    uint expected = 10000;

    Assert.equal(meta.balanceOf(tx.origin), expected, "Owner should have 10000 ChainopolyCoin initially");
  }

}
