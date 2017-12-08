#!/bin/sh

NETWORK=development
TESTADDR="0x627306090abab3a6e1400e9345bc60c78a8bef57"
CMD="truffle --network $NETWORK exec scripts/callGPT.js"

$CMD startPresale
$CMD setRobot $TESTADDR
$CMD finishPresale
$CMD startICO
$CMD mintUpto $TESTADDR 97e18
$CMD mint $TESTADDR 1e18
$CMD getBalance $TESTADDR
$CMD collect
$CMD finishICO
$CMD transfer 0xf17f52151ebef6c7334fad080c5704d77216b732 3e18
$CMD transferExt 0xf17f52151ebef6c7334fad080c5704d77216b732 34e18
