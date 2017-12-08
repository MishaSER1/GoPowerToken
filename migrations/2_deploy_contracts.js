var GoPowerToken = artifacts.require("GoPowerToken");

module.exports = function(deployer) {
  deployer.deploy(GoPowerToken, {gas: 1874000});
};
