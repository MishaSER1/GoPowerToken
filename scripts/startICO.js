module.exports = async function(callback) {

  const assert = require('assert');
  const GoPowerToken = artifacts.require('GoPowerToken');
  var token = await GoPowerToken.deployed();

  assert( token.startICO() );

  callback()
}
