var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
        //Usuarios para Nyo-PoW
        //truffle test --network pow
        //truffle test ./test/TestRealEstateUsers.js --network pow
        //admin
        walletAdmin = "0xC4eb09c84dcA2af4FC06E2aEc9001D174F3C7d13";
        //users
        walletUser1 = "0x9FA9D5D730631d5ad1A5ecBC2Df7240d724276A6"; //usuario1
        //Variables
        iteracciones = 2;
        media = 0;
        varianza = 0;
        arrayTime = new Array();
        desvEst = 0;
    })

    it("Test User creation", async () => {
        //============ Creacion de usuarios ============
        console.log("\n\nTest User creation:")
        var initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Initial: ${initial.toString()}`);

        for (var i=0; i<iteracciones; i++) {
            // start for
            var start = new Date().getTime();
            // Obtain gas used from the receipt
            var receipt = await rem.createNewUser("User1", "xxx", "Lima", "La Molina", walletUser1, "12345678", { from: accounts[1] });
            var end = new Date().getTime();
            console.log(`Transaction time ${i+1}: ${end - start}`);
            var gasUsed = receipt.receipt.gasUsed;
            console.log(`GasUsed ${i+1}: ${gasUsed}`);

            // Obtain gasPrice from the transaction
            var tx = await web3.eth.getTransaction(receipt.tx);
            var gasPrice = parseInt(tx.gasPrice);
            console.log(`GasPrice ${i+1}: ${gasPrice}`);

            // Final balance
            arrayTime.push(end-start);
            media = media + (end-start);

            const userAddress = await rem.getUserAddressById(0)
            assert.equal(userAddress, walletUser1, "User not created correctly");
            await rem.deleteUser(walletUser1,  { from: accounts[1] });
            console.log(`User deleted`);
            // end for
        }

        var final = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Final: ${final.toString()}`);
        
        
        media = media/iteracciones;
        console.log(`Transaction time Total (ms): ${media}`);
        console.log("\nResultado | Creación un usuario:")
        media = media/1000;
        console.log(`Media: ${media}`);
        arrayTime.forEach(element => {
            var temp = element/1000 - media
            temp = temp * temp
            varianza = varianza + temp
        });
        varianza = varianza/iteracciones;
        console.log(`Varianza: ${varianza}`);
        desvEst = Math.sqrt(varianza);
        console.log(`Desviación Estandar: ${desvEst}`);
    });
});