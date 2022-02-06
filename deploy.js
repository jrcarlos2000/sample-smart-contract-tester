require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require ('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    process.env.SECRET_RECOVERY_PHRASE,
    'https://rinkeby.infura.io/v3/e8e3186de47a412ebe2534b36d2b9d33'
)

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from account', accounts[0]);

    const contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data : bytecode})
    .send({gas:'1000000', from: accounts[0]});

    console.log('Contract deployed at : ', contract.options.address);
    provider.engine.stop();
};
deploy();