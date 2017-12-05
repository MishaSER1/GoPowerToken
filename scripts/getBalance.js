module.exports = async function(callback) {

  const assert = require('assert');
  const GoPowerToken = artifacts.require('GoPowerToken');
  var token = await GoPowerToken.deployed();

  assert.equal(process.argv.length, 7);
  var address = process.argv[6];
  var balance = await token.balanceOf(address, {gas: 456000});
  console.log(balance.toNumber());

  callback()
}
