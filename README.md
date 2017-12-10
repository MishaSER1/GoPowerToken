# GoPowerToken
GPT token ICO contract with tests

Developed and compiled with Truffle: http://truffleframework.com

Verified on Etherscan:
https://etherscan.io/address/0xa00425d3e2d3e9ff74f3e112b4d3a7978d7d88c2#code

# How to install
```
git clone https://github.com/TokenGo/GoPowerToken
GoPowerToken
npm install
echo -n "ADDRESS_PRIVATE_KEY_WITHOUT_0x_PREFIX" >wallet-private-key
echo -n "INFURA_ACCESS_TOKEN" >infura-access-token
truffle compile
```

# How to run tests
```
truffle develop
```
In another terminal:
```
truffle --network development migrate
truffle test
./scripts/testCallGPT.sh
```
