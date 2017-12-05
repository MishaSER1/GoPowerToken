module.exports = async function(callback) {

  const assert = require('assert');
  const GoPowerToken = artifacts.require('GoPowerToken');
  var token = await GoPowerToken.deployed();

  assert.equal(process.argv.length, 7);
  var address = process.argv[6];
  assert( await token.setTradeRobot(address) );

  callback()
}
