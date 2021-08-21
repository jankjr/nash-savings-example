const ethers = require('ethers')
const savingsAbi = require('./abi.json')
const contractAddress = '0x774073229CD5839F38F60f2B98Be3C99dAC9AD21'
const coins = [
  'ausdc',
  'adai',
  'ausdt',
  'agusd',
  'abusd'
]
const provider = new ethers.providers.JsonRpcProvider('https://consensus1.eth.nash.io')
const contract = new ethers.Contract(
  contractAddress,
  savingsAbi,
  provider
)

async function fee() {
  console.log("Current withdrawal fee")
  const manualWithdrawlFee = await contract.manualWithdrawalFee()
  console.log((parseInt(manualWithdrawlFee) / 100) + "%")
}
function printBalances(balances) {
  for (let i = 0 ; i < balances.length ; i ++) {
    const coin = coins[i]
    const rawBalance = balances[i].toString()
    const integer = rawBalance.length <= 6 ? '0' : rawBalance.slice(0, rawBalance.length - 6) || '0'
    const digits = rawBalance.slice(rawBalance.length - 6, rawBalance.length)
    console.log(" * " + integer + "." + digits.padEnd(6, '0') + ' ' + coin)
  }
}
async function balanceOf(address) {
  console.log("Balance of " + address)
  const balances = await contract.balanceOf(...address)
  printBalances(balances)
}

async function withdraw(amounts) {
  if (process.env.PRIVATE_KEY == null) {
    console.error("PRIVATE_KEY is not set")
    process.exit(1)
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  
  const contractWithSigner = new ethers.Contract(
    contractAddress,
    savingsAbi,
    wallet.connect(provider)
  )
  console.log("Withdrawing to wallet " + wallet.address)
  await contractWithSigner.withdraw(amounts)
  console.log("DONE")
}

function help() {
  console.log(`Utility to interact with nash savings contract.
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

const cmds = {
  help,
  fee,
  balanceOf,
  withdraw
}

async function main() {
  const cmd = process.argv[2]
  const args = process.argv.slice(3)
  if (cmds[cmd] == null) {
    cmds.help()
    return
  }
  await cmds[cmd](args)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });