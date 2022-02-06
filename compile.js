const path = require("path");
const fs = require("fs");
const solc = require("solc");


//TODO : MODIFY NAME OF YOUR CONTRACT
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");
module.exports = solc.compile(source, 1).contracts[":Lottery"];
