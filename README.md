# Simple Ethereum smart contract deployer and tester
## Before getting started : 
    1. Make sure you have a metamask wallet and your secret key
    2. Change .env.example to .env file 
    3. Write your secret key to your local .env file

## Using your own contract source code
    1. Paste your own contract source code to /contracts.
    2. Modify deployer at /deploy.js.
    3. Modify tests at /test/contract-name.test.js.

## Run

```
    npm install --force
    node deploy.js
    npm run test
```
