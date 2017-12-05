module.exports = async function(callback) {

  const assert = require('assert');
  const GoPowerToken = artifacts.require('GoPowerToken');
  var token = await GoPowerToken.deployed();

  assert.equal(process.argv.length, 8);
  var address = process.argv[6];
  var newValue = process.argv[7];
  assert( await token.mintUpto(address, newValue, {gas: 456000}) );

  callback()
}
