var GoPowerToken = artifacts.require("GoPowerToken");

module.exports = function(deployer) {
  deployer.deploy(GoPowerToken, {gas: 4567000});
};
