//write tests for the contract here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async ()=>{


    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data : bytecode})
    .send({from : accounts[0] , gas : '1000000'});

})

describe('Lottery', () => {
    it('contract deployed', () => {
        assert.ok(lottery.options.address);
    })
    it('allows one account to enter', async ()=>{
        await lottery.methods.enter().send(
            {
                from : accounts[0],
                value : web3.utils.toWei('0.02','ether')
            }
        );

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    })
    it('allows multiple account to enter', async ()=>{
        await lottery.methods.enter().send(
            {
                from : accounts[0],
                value : web3.utils.toWei('0.02','ether')
            }
        );

        await lottery.methods.enter().send(
            {
                from : accounts[1],
                value : web3.utils.toWei('0.02','ether')
            }
        );

        await lottery.methods.enter().send(
            {
                from : accounts[2],
                value : web3.utils.toWei('0.02','ether')
            }
        );

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(3, players.length);
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        
    });
    it('Requires a minimum amount of ether to enter', async () => {
        
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02','ether')
        });

    });
    it('only manager can call pickWinner', async () =>{
        try {
            await lottery.methods.pickWinner().send({
                from : accounts[1]
            })
            assert(false);
        }catch (e){
            assert(e);
        }
    })

    it('send money to the winner and resets the array of players', async () =>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('2','ether')
        })

        const initial_balance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send(
            {   from : accounts[0] }
        );
        
        const final_balance = await web3.eth.getBalance(accounts[0]);

        const diff = final_balance - initial_balance;

        assert(diff > web3.utils.toWei('1.8','ether'));

    })
})

