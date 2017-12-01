// Specifically request an abstraction for GoPowerToken
var GoPowerToken = artifacts.require("GoPowerToken");

contract('GoPowerToken', function(accounts) {
  it("can set tradeRobot", function() {
    return GoPowerToken.deployed().then(function(instance) {
      token = instance;
      return token.setTradeRobot.call(accounts[1]);
    }).then(function(retval) {
      assert.equal(retval, true);
    }).then(function() {
      return token.tradeRobot.call();
    }).then(function(retval) {
      assert.equal(retval, accounts[1]);
    });;
  });
/*
  it("has proper tradeRobot", function() {
    return GoPowerToken.deployed().then(function(instance) {
      return instance.tradeRobot.call();
    }).then(function(retval) {
      assert.equal(retval, accounts[0], "");
    });
  });
  it("can start Presale", function() {
    return GoPowerToken.deployed().then(function(instance) {
      return instance.startPresale.call();
    }).then(function(retval) {
      assert.equal(retval, true, "");
    });
  });
  it("can mint 5000 GPT to the first account", function() {
    return GoPowerToken.deployed().then(function(instance) {
      return instance.mint.call(accounts[0], 5000);
    }).then(function(retval) {
      assert.equal(retval, true, "true is expected from mint()");
    });
  });
*/
});
