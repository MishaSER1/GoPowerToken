module.exports = async function(callback) {
  const assert = require('assert');
  assert(process.argv.length >= 7);
  var command = process.argv[6];

  const GoPowerToken = artifacts.require('GoPowerToken');
  var token = await GoPowerToken.deployed();

  switch(command) {
    case "startPresale":
      assert.equal(process.argv.length, 7);
      assert( token.startPresale({gas: 60000}) );
      break;
    case "finishPresale":
      assert.equal(process.argv.length, 7);
      assert( token.finishPresale({gas: 61000}) );
      break;
    case "startICO":
      assert.equal(process.argv.length, 7);
      assert( token.startICO({gas: 61000}) );
      break;
    case "finishICO":
      assert.equal(process.argv.length, 7);
      assert( token.finishICO({gas: 151000}) );
      break;
    case "getBalance":
      assert.equal(process.argv.length, 8);
      var address = process.argv[7];
      var balance = await token.balanceOf.call(address);
      console.log(balance.toNumber());
      break;
    case "setRobot":
      assert.equal(process.argv.length, 8);
      var address = process.argv[7];
      assert( await token.setTradeRobot(address, {gas: 61000}) );
      break;
    case "mint":
      assert.equal(process.argv.length, 9);
      var address = process.argv[7];
      var newValue = process.argv[8];
      assert( await token.mint(address, newValue, {gas: 112000}) );
      break;
    case "mintUpto":
      assert.equal(process.argv.length, 9);
      var address = process.argv[7];
      var newValue = process.argv[8];
      assert( await token.mintUpto(address, newValue, {gas: 112000}) );
      break;
    case "collect":
      assert.equal(process.argv.length, 7);
      assert( token.collect({gas: 51000}) );
      break;
    case "transfer":
      assert.equal(process.argv.length, 9);
      var address = process.argv[7];
      var amount = process.argv[8];
      assert( await token.transfer(address, amount, {gas: 71000}) );
      break;
    case "transferExt":
      assert.equal(process.argv.length, 9);
      var address = process.argv[7];
      var amount = process.argv[8];
      assert( await token.transfer(address, amount, {gas: 71000}) );
      break;
    default:
      assert.fail("unknown command: ".concat(command));
  }

  callback()
}
