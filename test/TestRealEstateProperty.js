var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
        //Usuarios para Nyo-PoW
        //truffle test --network pow
        //truffle test ./test/TestRealEstateProperty.js --network pow
        //admin
        walletAdmin = "0xC4eb09c84dcA2af4FC06E2aEc9001D174F3C7d13";
        //users
        walletUser1 = "0x9FA9D5D730631d5ad1A5ecBC2Df7240d724276A6"; //con propiedad inicial
        walletUser2 = "0x9a7cc61f961614A1aF1B563238fEa878222dECAd"; //con propiedad inicial
        //Variables
        iteracciones = 30;
        media = 0;
        varianza = 0;
        arrayTime = new Array();
        desvEst = 0;
    })

    it("Test Property creation", async () => {
        //============ Creacion de usuarios ============
        //console.log("\n\nTest User creation:")
        await rem.createNewUser("User1", "xxx", "Lima", "La Molina", walletUser1, "12345678", { from: accounts[1] });
        await rem.createNewUser("User2", "xxx", "Lima", "La Molina", walletUser2, "74125863", { from: accounts[1] });
        const userAddress1 = await rem.getUserAddressById(0)
        const userAddress2 = await rem.getUserAddressById(1)
        assert.equal(userAddress1, walletUser1, "User not created correctly");
        assert.equal(userAddress2, walletUser2, "User not created correctly");
  
        //============ Creacion de la propiedad ============
        console.log("\n\nTest Property creation")
        // Initial balance of the account
        var initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Initial: ${initial.toString()}`);

        for (var i=0; i<iteracciones; i++) {
            // start for
            var start = new Date().getTime();
            // Obtain gas used from the receipt
            var receipt = await rem.createnNewProperty("Lima", "San Luis", "Av. Siempre viva 123", 120, [walletUser1, walletUser2], [50,50], { from: accounts[1] });
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

            const propertyHash = await rem.getPropertyHashById(0)
            await rem.deleteProperty(propertyHash,  { from: accounts[1] });
            console.log(`Property deleted`);
            //end for
        }

        var final = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Final: ${final.toString()}`);

        media = media/iteracciones;
        console.log(`Transaction time Total (ms): ${media}`);
        console.log("\nResultado | Creación una propiedad:")
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