var WalletProvider = require("truffle-wallet-provider");

var privKey = require('fs').readFileSync('./wallet-private-key').toString().trim();
var wallet = require('ethereumjs-wallet').fromPrivateKey(Buffer.from(privKey, 'hex'));
var infuraAccessToken = require('fs').readFileSync('./infura-access-token').toString().trim();

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new WalletProvider(wallet, "https://ropsten.infura.io/".concat(infuraAccessToken))
      },
      network_id: 3,
      gas: 2200000
    },
    live: {
      provider: function() {
        return new WalletProvider(wallet, "https://mainnet.infura.io/".concat(infuraAccessToken))
      },
      network_id: 1,
      gas: 2200000
    }
  }
};
