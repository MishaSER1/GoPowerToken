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

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res);
    })
  );

const getBalance = (account, at) =>
  promisify(cb => web3.eth.getBalance(account, at, cb));


// Specifically request an abstraction for GoPowerToken
var GoPowerToken = artifacts.require("GoPowerToken");

contract('GoPowerToken', function(accounts) {

  let bountyAddress = 0x0;
  let teamAddress = 0x0;
  let settlementsAddress = 0x0;

  //===== before Presale =====

  it("can set tradeRobot", async function() {
    let token = await GoPowerToken.deployed();
    await token.setTradeRobot(accounts[1]);
    await timeTravel(86400 * 3) // 3 days later
    await mineBlock()           // workaround for https://github.com/ethereumjs/testrpc/issues/336
    let robot = await token.tradeRobot();
    assert.equal(robot, accounts[1]);
  });

  it("cannot mint before the sale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mint(accounts[2], 15e18, {from: accounts[1]});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot buy before presale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.buy({value: 1*1e18});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });


  //===== Start Presale =====

  it("can start presale", async function() {
    let token = await GoPowerToken.deployed();
    await token.startPresale();
  });

  it("can set tradeRobot", async function() {
    let token = await GoPowerToken.deployed();
    await token.setTradeRobot(accounts[2]);
    let robot = await token.tradeRobot();
    assert.equal(robot, accounts[2]);
    await token.setTradeRobot(accounts[1]);
    robot = await token.tradeRobot();
    assert.equal(robot, accounts[1]);
  });

  it("can mint during presale", async function() {
    let token = await GoPowerToken.deployed();
    await token.mint(accounts[2], 10e18, {from: accounts[1]});
    let balance = await token.balanceOf(accounts[2]);
    assert.equal(balance.toNumber(), 10e18);
    await token.mintUpto(accounts[2], 15e18, {from: accounts[1]});
    balance = await token.balanceOf(accounts[2]);
    assert.equal(balance.toNumber(), 15e18);
  });

  it("cannot mint on behalf of non robot", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mint(accounts[2], 15e18);
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot mintUpto on behalf of non robot", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mintUpto(accounts[2], 5000e18);
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("can mintUpto during presale", async function() {
    let token = await GoPowerToken.deployed();
    await token.mintUpto(accounts[2], 27e18, {from: accounts[1]});
    let balance = await token.balanceOf(accounts[2]);
    assert.equal(balance.toNumber(), 27e18);
  });

  it("can buy during sale", async function() {
    let token = await GoPowerToken.deployed();
    await token.buy({value: 1*1e18});
    let balance = await token.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 2625e18);
  });

  it("buy() does proper rounding", async function() {
    let token = await GoPowerToken.deployed();
    await token.buy({value: 1.0000057e+18});
    let balance = await token.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 5250.01e18);
    await token.buy({value: 1.0000058e+18});
    balance = await token.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 7875.03e18);
  });

  it("rate is constant during presale", async function() {
    await timeTravel(86400 * 3);
    await mineBlock();
    let token = await GoPowerToken.deployed();
    await token.buy({value: 1*1e18});
    let balance = await token.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 10500.03e18);
  });

  it("cannot start ICO during presale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.startICO();
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });


  //===== Finish Presale =====

  it("can finish presale", async function() {
    let token = await GoPowerToken.deployed();
    await token.finishPresale();
  });

  it("can set tradeRobot", async function() {
    let token = await GoPowerToken.deployed();
    await token.setTradeRobot(accounts[2]);
    let robot = await token.tradeRobot();
    assert.equal(robot, accounts[2]);
    await token.setTradeRobot(accounts[1]);
    robot = await token.tradeRobot();
    assert.equal(robot, accounts[1]);
  });

  it("cannot mint after presale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mint(accounts[2], 500e18, {from: accounts[1]});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot mintUpto after presale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mintUpto(accounts[2], 5000e18, {from: accounts[1]});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot buy after presale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.buy({value: 1*1e18});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });


  //===== Start ICO =====

  it("can start ICO", async function() {
    await timeTravel(86400 * 3);
    await mineBlock();
    let token = await GoPowerToken.deployed();
    await token.startICO();
  });

  it("can set tradeRobot", async function() {
    let token = await GoPowerToken.deployed();
    await token.setTradeRobot(accounts[2]);
    let robot = await token.tradeRobot();
    assert.equal(robot, accounts[2]);
    await token.setTradeRobot(accounts[1]);
    robot = await token.tradeRobot();
    assert.equal(robot, accounts[1]);
  });

  it("can mint during ICO", async function() {
    let token = await GoPowerToken.deployed();
    await token.mint(accounts[2], 11e18, {from: accounts[1]});
    let balance = await token.balanceOf(accounts[2]);
    assert.equal(balance.toNumber(), 38e18);
    await token.mintUpto(accounts[2], 45e18, {from: accounts[1]});
    balance = await token.balanceOf(accounts[2]);
    assert.equal(balance.toNumber(), 45e18);
  });

  it("can buy during ICO", async function() {
    let token = await GoPowerToken.deployed();
    await token.buy({value: 2*1e18, from: accounts[3]});
    let balance = await token.balanceOf(accounts[3]);
    assert.equal(balance.toNumber(), 4550e18);
  });

  it("does proper calculation of daily rate increment", async function() {
    await timeTravel(86400 * 1 - 100);
    await mineBlock();
    let token = await GoPowerToken.deployed();
    await token.buy({value: 2*1e18, from: accounts[4]});
    let balance = await token.balanceOf(accounts[4]);
    assert.equal(balance.toNumber(), 4550e18);
    await timeTravel(100); 
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[5]});
    balance = await token.balanceOf(accounts[5]);
    assert.equal(balance.toNumber(), 4527.36e18);
    await timeTravel(86400 * 6 - 100); // nearly a week from the start of ICO
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[6]});
    balance = await token.balanceOf(accounts[6]);
    assert.equal(balance.toNumber(), 4417.48e18);
    await timeTravel(100);
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[7]});
    balance = await token.balanceOf(accounts[7]);
    assert.equal(balance.toNumber(), 4057.97e18);
    await timeTravel(86400 * 7); // two weeks from the start of ICO
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[7]});
    balance = await token.balanceOf(accounts[7]);
    assert.equal(balance.toNumber(), 7656.1e18);
    await timeTravel(86400 * 7); // three weeks from the start of ICO
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[7]});
    balance = await token.balanceOf(accounts[7]);
    assert.equal(balance.toNumber(), 10981.89e18);
    await timeTravel(86400 * 7); // four weeks from the start of ICO
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[7]});
    balance = await token.balanceOf(accounts[7]);
    assert.equal(balance.toNumber(), 14052.07e18);
    await timeTravel(86400 * 7); // five weeks from the start of ICO
    await mineBlock();
    await token.buy({value: 2*1e18, from: accounts[7]});
    balance = await token.balanceOf(accounts[7]);
    assert.equal(balance.toNumber(), 17030.79e18);
  });

  it("cannot buy beyond supply limit", async function() {
    let token = await GoPowerToken.deployed();
    await token.mint(accounts[9], 530 * 1e6 * 1e18, {from: accounts[1]});
    let balance = await token.balanceOf(accounts[9]);
    assert.equal(balance.toNumber(), 530 * 1e6 * 1e18);
    await token.mintUpto(accounts[9], 599900000e18, {from: accounts[1]});
    balance = await token.balanceOf(accounts[9]);
    assert.equal(balance.toNumber(), 599900000e18);
    await token.buy({value: 20*1e18});
    try {
      await token.buy({value: 20*1e18});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });


  //===== Finish ICO =====

  it("can finish ICO", async function() {
    let token = await GoPowerToken.deployed();
    await token.finishICO();
  });

  it("cannot set tradeRobot after ICO", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.setTradeRobot(accounts[2]);
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot mint after ICO", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mint(accounts[2], 500e18, {from: accounts[1]});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot mintUpto after ICO", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.mintUpto(accounts[2], 5000e18, {from: accounts[1]});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("cannot buy after ICO", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.buy({value: 1*1e18});
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("tokens properly distributed after ICO", async function() {
    let token = await GoPowerToken.deployed();
    let bountyBalance = await token.balanceOf(bountyAddress);
    let teamBalance = await token.balanceOf(teamAddress);
    let settlementsBalance = await token.balanceOf(settlementsAddress);
    assert.equal(bountyBalance.toNumber(), 20*1e6*1e18);
    assert.equal(teamBalance.toNumber(), 30*1e6*1e18);
    assert.equal(settlementsBalance.toNumber(), 50*1e6*1e18); 
  });

  it("has proper totalSupply after ICO", async function() {
    let token = await GoPowerToken.deployed();
    let totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 699975407.89e18);
  });

  it("cannot restart presale", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.startPresale();
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  })

  it("cannot restart ICO", async function() {
    let token = await GoPowerToken.deployed();
    try {
      await token.startICO();
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });

  it("can collect funds", async function() {
    let token = await GoPowerToken.deployed();
    let oldBalance = await getBalance(accounts[0]);
    await token.collect();
    let newBalance = await getBalance(accounts[0]);
    let amount = newBalance.toNumber() - oldBalance.toNumber();
    assert.equal(amount, 41.9970008*1e18);
  });


  it("can ", async function() {
    let token = await GoPowerToken.deployed();
  });

  it("cannot ", async function() {
    let token = await GoPowerToken.deployed();
    try {
      throw new Error("test");
    } catch(e) {
      return true;
    }
    throw new Error("I should never see this!");
  });


});
