```Utility to interact with nash savings contract.
Examples:

> node src/bin.js fee
1%

> node src/bin.js balanceOf 0x12345...
Balance of 0x1234... 
 * 0.000000 ausdc
 * 0.000000 ausdt
 * 100.000000 adai
 * 0.200000 abusd
 * 0.000000 agusd
Note, withdrawal amounts must be in fixed point format with 6 digits.
So withdrawing 1.000000 usdc would be: 1000000

> PRIVATE_KEY="[ETH PRIVATE KEY]" node src/bin.js withdraw 1000000 0 0 0 0
Withdrawing to wallet 0x00000...
DONE

Available commands:
  help
  fee
  balanceOf
  withdraw [usdc] [usdt] [dai] [busd] [gusd]`)
}
```
