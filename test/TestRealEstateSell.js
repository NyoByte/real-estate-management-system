var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
        //Usuarios para Nyo-PoW
        //truffle test --network pow
        //truffle test ./test/TestRealEstateSell.js
        //admin
        walletAdmin = "0xC4eb09c84dcA2af4FC06E2aEc9001D174F3C7d13";
        //users
        walletUser1 = "0x9FA9D5D730631d5ad1A5ecBC2Df7240d724276A6"; //con propiedad inicial
        walletUser2 = "0x9a7cc61f961614A1aF1B563238fEa878222dECAd"; //con propiedad inicial
        walletUser3 = "0xE8cAcd04313a771422c35606AC5117ac11C7Ca2e"; //para createSell
        walletUser4 = "0xEf001b4d579724F36817F629d84652c2B39207f1"; //para createRent
    })

    it("Test Sell", async () => {
        //console.log(web3.utils.toWei(2, 'ether'));
        //============ Creacion de usuarios ============
        console.log("\n\nTest User creation:")
        var initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Initial: ${initial.toString()}`);
        var start = new Date().getTime();
        // Obtain gas used from the receipt
        var receipt = await rem.createNewUser("User1", "xxx", "Lima", "La Molina", walletUser1, "12345678", { from: accounts[1] });
        var end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        var gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${gasUsed}`);

        // Obtain gasPrice from the transaction
        var tx = await web3.eth.getTransaction(receipt.tx);
        var gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${gasPrice}`);

        // Final balance
        var final = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Final: ${final.toString()}`);
        await rem.createNewUser("User2", "xxx", "Lima", "La Molina", walletUser2, "74125863", { from: accounts[1] });
        await rem.createNewUser("User3", "xxx", "Lima", "Ate", walletUser3, "12398546", { from: accounts[1] });
        await rem.createNewUser("User4", "xxx", "Lima", "Jesus María", walletUser4, "32458716", { from: accounts[1] });
        const userAddress = await rem.getUserAddressById(0)
        //assert.equal(initial - final, gasUsed, "Consumo diferente xd");
        assert.equal(userAddress, walletUser1, "User not created correctly");

        
        //============ Creacion de la propiedad ============
        console.log("\n\nTest Property creation")
        // Initial balance of the account
        initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Initial: ${initial.toString()}`);

        start = new Date().getTime();
        // Obtain gas used from the receipt
        receipt = await rem.createnNewProperty("Lima", "San Luis", "Av. Siempre viva 123", 120, [walletUser1, walletUser2], [50,50], { from: accounts[1] });
        end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${gasUsed}`);

        // Obtain gasPrice from the transaction
        tx = await web3.eth.getTransaction(receipt.tx);
        gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${gasPrice}`);

        // Final balance
        final = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Final: ${final.toString()}`);


        //============ Creacion de la venta ============
        console.log("\n\nTest Sell creation")
        // Initial balance of the account
        const propertyHash = await rem.getPropertyHashById(0)
        initial = await web3.eth.getBalance(walletUser1);
        console.log(`Gas Initial: ${initial.toString()}`);

        start = new Date().getTime();
        // Obtain gas used from the receipt
        receipt = await rem.createSell(2,propertyHash,walletUser3,50, {from: accounts[2]});
        end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${receipt.receipt.gasUsed}`);

        // Obtain gasPrice from the transaction
        tx = await web3.eth.getTransaction(receipt.tx);
        gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${tx.gasPrice}`);

        // Final balance
        final = await web3.eth.getBalance(walletUser1);
        console.log(`Gas Final: ${final.toString()}`);

        //const hash = web3.utils.soliditySha3('0', propertyHash)

        //assert.equal(hash, rem.getSellHashById(0), "Property not created correctly");

        //============ Pago de la venta ============
        console.log("\n\nTest pay sell")
        // Initial balance of the account
        const sellHash = await rem.getSellHashById(0)
        initial = await web3.eth.getBalance(walletUser3);
        console.log(`Gas Initial: ${initial.toString()}`);

        start = new Date().getTime();
        // Obtain gas used from the receipt
        receipt = await rem.paySell(sellHash, {from: accounts[4], value: web3.utils.toWei('2', 'ether')});
        end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${receipt.receipt.gasUsed}`);

        // Obtain gasPrice from the transaction
        tx = await web3.eth.getTransaction(receipt.tx);
        gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${tx.gasPrice}`);

        // Final balance
        final = await web3.eth.getBalance(walletUser3);
        console.log(`Gas Final: ${final.toString()}`);

    });
});