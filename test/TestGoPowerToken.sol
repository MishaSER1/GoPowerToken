pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/GoPowerToken.sol";

contract TestGoPowerToken {
  GoPowerToken gptoken = GoPowerToken(DeployedAddresses.GoPowerToken());

  // Testing the initial properties of GoPowerToken
  function testGoPowerTokenInitialProperties() public {
    Assert.equal(gptoken.testingInProgress(), true, "Expected gptoken.testingInProgress == true");
    Assert.equal(gptoken.presaleStartedAt(), 0, "Expected gptoken.presaleStartedAt == 0");
  }

}
