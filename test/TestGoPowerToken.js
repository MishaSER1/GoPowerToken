const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}

const mineBlock = function () {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_mine",
      id: 12345
    }, function(err, result) {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}


// Specifically request an abstraction for GoPowerToken
var GoPowerToken = artifacts.require("GoPowerToken");

contract('GoPowerToken', function(accounts) {

  it("can set tradeRobot", async function() {
    token = await GoPowerToken.deployed();
    await token.setTradeRobot(accounts[1]);
    await timeTravel(86400 * 3) // 3 days later
    await mineBlock()           // workaround for https://github.com/ethereumjs/testrpc/issues/336
    robot = await token.tradeRobot.call();
    assert.equal(robot, accounts[1]);
  });

});
