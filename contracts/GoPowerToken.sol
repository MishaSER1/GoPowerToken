pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract GoPowerToken is StandardToken, Ownable {

  string public name = 'GoPower Token';
  string public symbol = 'GPT';
  uint public decimals = 18;


  //
  //   Distribution of tokens
  //

  uint constant TOKEN_TOTAL_SUPPLY_LIMIT = 700 * 1e6 * 1e18;
  uint constant TOKEN_SALE_LIMIT =         600 * 1e6 * 1e18;
  uint constant RESERVED_FOR_SETTLEMENTS =  50 * 1e6 * 1e18;
  uint constant RESERVED_FOR_TEAM =         30 * 1e6 * 1e18;
  uint constant RESERVED_FOR_BOUNTY =       20 * 1e6 * 1e18;

  // TODO
  address constant settlementsAddress = 0x0;
  address constant teamAddress = 0x0;
  address constant bountyAddress = 0x0;


  //
  //   Token rate calculation parameters
  //

  uint constant TOKEN_RATE_INITIAL =  0.00057143 ether;
  uint constant TOKEN_RATE_ICO_DAILY_INCREMENT = TOKEN_RATE_INITIAL / 200;  // 0.5%
  uint constant BONUS_PRESALE = 50;    // 50%
  uint constant BONUS_ICO_WEEK1 = 30;  // 30%
  uint constant BONUS_ICO_WEEK2 = 20;  // 20%
  uint constant BONUS_ICO_WEEK3 = 10;  // 10%
  uint constant BONUS_ICO_WEEK4 = 5;   // 5%
  uint constant MINIMUM_PAYABLE_AMOUNT = 0.0001 ether;


  //
  //    State transitions
  //

  uint public presaleStartedAt;
  uint public presaleFinishedAt;
  uint public icoStartedAt;
  uint public icoFinishedAt;

  function presaleInProgress() private view returns (bool) {
    return ((presaleStartedAt > 0) && (presaleFinishedAt == 0));
  }

  function icoInProgress() private view returns (bool) {
    return ((icoStartedAt > 0) && (icoFinishedAt == 0));
  }

  modifier onlyDuringSale { require(presaleInProgress() || icoInProgress()); _; }
  modifier onlyAfterICO { require(icoFinishedAt > 0); _; }

  function startPresale() onlyOwner external returns(bool) {
    require(presaleStartedAt == 0);
    presaleStartedAt = now;
    return true;
  }

  function finishPresale() onlyOwner external returns(bool) {
    require(presaleInProgress());
    presaleFinishedAt = now;
    return true;
  }

  function startICO() onlyOwner external returns(bool) {
    require(presaleFinishedAt > 0);
    require(icoStartedAt == 0);
    icoStartedAt = now;
    return true;
  }

  function finishICO() onlyOwner external returns(bool) {
    require(icoInProgress());
    _mint_internal(settlementsAddress, RESERVED_FOR_SETTLEMENTS);
    _mint_internal(teamAddress, RESERVED_FOR_TEAM);
    _mint_internal(bountyAddress, RESERVED_FOR_BOUNTY);
    icoFinishedAt = now;
    tradeRobot = 0x0;
    return true;
  }


  //
  //  Trade robot permissions
  //

  address public tradeRobot;
  modifier onlyTradeRobot { require(msg.sender == tradeRobot); _; }

  function setTradeRobot(address _robot) onlyOwner external returns(bool) {
    require(icoFinishedAt == 0); // only if ICO is not finished (in progress or not started yet)
    tradeRobot = _robot;
    return true;
  }


  //
  //   Token sale logic
  //

  function _mint_internal(address _to, uint _amount) private {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Transfer(address(0), _to, _amount);
  }

  function mint(address _to, uint _amount) onlyDuringSale onlyTradeRobot public returns (bool) {
    require(totalSupply.add(_amount) <= TOKEN_SALE_LIMIT);
    _mint_internal(_to, _amount);
    return true;
  }

  function mintUpto(address _to, uint _newValue) external returns (bool) {
    var oldValue = balances[_to];
    require(_newValue > oldValue);
    return mint(_to, _newValue.sub(oldValue));
  }

  function buy() onlyDuringSale public payable {
    assert(msg.value >= MINIMUM_PAYABLE_AMOUNT);
    var tokenRate = TOKEN_RATE_INITIAL;
    uint amount;

    if (icoInProgress()) { // main ICO

      var daysFromIcoStart = now.sub(icoStartedAt).div(1 days);
      tokenRate = tokenRate.add( TOKEN_RATE_ICO_DAILY_INCREMENT.mul(daysFromIcoStart) );
      amount = msg.value.div(tokenRate);

      var weekNumber = 1 + daysFromIcoStart.div(7);
      if (weekNumber == 1) {
        amount = amount.add( amount.mul(BONUS_ICO_WEEK1).div(100) );
      } else if (weekNumber == 2) {
        amount = amount.add( amount.mul(BONUS_ICO_WEEK2).div(100) );
      } else if (weekNumber == 3) {
        amount = amount.add( amount.mul(BONUS_ICO_WEEK3).div(100) );
      } else if (weekNumber == 4) {
        amount = amount.add( amount.mul(BONUS_ICO_WEEK4).div(100) );
      }
    
    } else {  // presale

      amount = msg.value.div(tokenRate);
      amount = amount.add( amount.mul(BONUS_PRESALE).div(100) );
    }

    mint(msg.sender, amount);
  }

  function () external payable {
    buy();
  }

  function collect() onlyOwner external {
    msg.sender.transfer(this.balance);
  }


  //
  //   Token transfer operations are locked until the end of ICO
  //

  function transfer(address _to, uint _value) onlyAfterICO public returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint _value) onlyAfterICO public returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint _value) onlyAfterICO public returns (bool) {
    return super.approve(_spender, _value);
  }

  function increaseApproval(address _spender, uint _addedValue) onlyAfterICO public returns (bool) {
    return super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(address _spender, uint _subtractedValue) onlyAfterICO public returns (bool) {
    return super.decreaseApproval(_spender, _subtractedValue);
  }

}
