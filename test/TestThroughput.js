//ejecutar con truffle exec .\TestThroughput.js --network ganache

const RealEstateManagement = artifacts.require("RealEstateManagement");


//colocar cuentas de la red
const accounts = ['0x7c241a211e21CF015B75174bBf7677577451b0F9', '0x08d36Af2F51A78848d112f680F9e1698440DfB12', 
'0xDfc8bC8bAB7139C44E1dC281508f713302cE1eCE','0x74AD047BCaE617c4c2ff519f04E1dc066C46D87E',
'0x28DE4Ef8171118C99f2279453856728a69F9E1BB','0xa689e3b84bA061058A989ccDe5291B83Af57aae8',
'0x898D0DD82299639F17d1E520E31B9Da1a2d42633', '0x3a6dB86fbC9c6884841cD51a1827dE1e1f5F0EC7', 
'0x926bF3BABc0A02a3Ac7b28328F10164903d41d68', '0x2623f57597f43e0e91476563c4852c4Bc3bb5CC5']

module.exports = function(callback) {
    let instance = RealEstateManagement.deployed().then(instance => {
        /*accounts.forEach(function(account, index) {
            let start = new Date().getTime()
            instance.createNewUser("User"+index,"xxx","Lima","La Molina",account,"12345678", {from: accounts[0]}).then(function(result) {
                //print execution time
                let end = new Date().getTime()
                let time = end - start
                console.log("Time to create user "+index + time + "ms")
                console.log(result)
            });
        })*/

        instance.getPropertyHashById(0).then(function(hash) {
            console.log(hash)
            let start = new Date().getTime()
            let currentBlock = 0
            let numTransactions = 0
            for(let i = 0; i < 10; i++) {
                accounts.forEach(function(account, index) {
                    instance.createSell(20,hash,account,1, {from: accounts[0]}).then(function(result) {
                        if(currentBlock == 0){
                            currentBlock = result.receipt.blockNumber
                        }
                        if(result.receipt.blockNumber != currentBlock) {
                            console.log("Block number: "+currentBlock)
                            let end = new Date().getTime()
                            let time = end - start
                            console.log("Time: " + time + "ms")
                            
                            start = new Date().getTime()
                            currentBlock = result.receipt.blockNumber
                            numTransactions = 0
                        }else{
                            numTransactions++
                        }
                    });
                })
            }
        })
    })
}