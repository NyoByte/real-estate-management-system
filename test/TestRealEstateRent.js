var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
        //Usuarios para Nyo-PoW
        //truffle test --network pow
        //truffle test ./test/TestRealEstateRent.js --network pow
        //admin
        walletAdmin = "0xC4eb09c84dcA2af4FC06E2aEc9001D174F3C7d13";
        //users
        walletUser1 = "0x9FA9D5D730631d5ad1A5ecBC2Df7240d724276A6"; //con propiedad inicial
        walletUser2 = "0x9a7cc61f961614A1aF1B563238fEa878222dECAd"; //con propiedad inicial
        walletUser3 = "0xE8cAcd04313a771422c35606AC5117ac11C7Ca2e"; //para createSell - no se usa acá
        walletUser4 = "0xEf001b4d579724F36817F629d84652c2B39207f1"; //para createRent
        //Variables
        iteracciones = 30;
        media = 0;
        varianza = 0;
        arrayTime = new Array();
        desvEst = 0;
    })

    function resultado(media, varianza, desvEst, arrayTime, name){
        media = media/iteracciones;
        console.log(`Transaction time Total (ms): ${media}`);
        console.log("\nResultado | "+name+" :")
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
    }
    
    function setVariables(){
        media = 0;
        varianza = 0;
        arrayTime = new Array();
        desvEst = 0;
    }

    it("Test Rent", async () => {
        //============ Creacion de usuarios ============
        await rem.createNewUser("User1", "xxx", "Lima", "La Molina", walletUser1, "12345678", { from: accounts[1] });
        await rem.createNewUser("User2", "xxx", "Lima", "La Molina", walletUser2, "74125863", { from: accounts[1] });
        await rem.createNewUser("User3", "xxx", "Lima", "Ate", walletUser3, "12398546", { from: accounts[1] });
        await rem.createNewUser("User3", "xxx", "Lima", "Ate", walletUser4, "12647283", { from: accounts[1] });
        const userAddress1 = await rem.getUserAddressById(0)
        const userAddress2 = await rem.getUserAddressById(1)
        const userAddress3 = await rem.getUserAddressById(2)
        const userAddress4 = await rem.getUserAddressById(3)
        assert.equal(userAddress1, walletUser1, "User not created correctly");
        assert.equal(userAddress2, walletUser2, "User not created correctly");
        assert.equal(userAddress3, walletUser3, "User not created correctly");
        assert.equal(userAddress4, walletUser4, "User not created correctly");

        //============ Creacion de la propiedad ============
        await rem.createnNewProperty("Lima", "San Luis", "Av. Siempre viva 123", 120, [walletUser1, walletUser2], [50,50], { from: accounts[1] });

        //============ Creacion de la renta ============
        console.log("\n\nTest Rent creation")
        // Initial balance of the account
        const propertyHash = await rem.getPropertyHashById(0)
        initial = await web3.eth.getBalance(walletUser1);
        console.log(`Gas Initial: ${initial.toString()}`);
        for (var i=0; i<iteracciones; i++) {
            // start for
            start = new Date().getTime();
            // Obtain gas used from the receipt
            receipt = await rem.createRent(propertyHash,walletUser4,4,2, {from: accounts[2]});
            end = new Date().getTime();
            console.log(`Transaction time ${i+1}: ${end - start}`);
            gasUsed = receipt.receipt.gasUsed;
            console.log(`GasUsed ${i+1}: ${receipt.receipt.gasUsed}`);

            // Obtain gasPrice from the transaction
            tx = await web3.eth.getTransaction(receipt.tx);
            gasPrice = parseInt(tx.gasPrice);
            console.log(`GasPrice ${i+1}: ${tx.gasPrice}`);

            // Final balance
            arrayTime.push(end-start);
            media = media + (end-start);
        }
        final = await web3.eth.getBalance(walletUser1);
        console.log(`Gas Final: ${final.toString()}`);

        resultado(media, varianza, desvEst, arrayTime, "Creación de renta");
        setVariables();

        //============ Estar de acuerdo con la renta ============
        console.log("\n\nTest agree rent")
        initial = await web3.eth.getBalance(walletUser2);
        console.log(`Gas Initial: ${initial.toString()}`);

        for (var i=0; i<iteracciones; i++) {
            // start for
            // Initial balance of the account
            var rentHash = await rem.getRentHashById(i)

            start = new Date().getTime();
            // Obtain gas used from the receipt
            receipt = await rem.agreeRent(rentHash, {from: walletUser2});
            end = new Date().getTime();
            console.log(`Transaction time ${i+1}: ${end - start}`);
            gasUsed = receipt.receipt.gasUsed;
            console.log(`GasUsed ${i+1}: ${receipt.receipt.gasUsed}`);

            // Obtain gasPrice from the transaction
            tx = await web3.eth.getTransaction(receipt.tx);
            gasPrice = parseInt(tx.gasPrice);
            console.log(`GasPrice ${i+1}: ${tx.gasPrice}`);

            // Final balance
            arrayTime.push(end-start);
            media = media + (end-start);
        }
        final = await web3.eth.getBalance(walletUser2);
        console.log(`Gas Final: ${final.toString()}`);

        resultado(media, varianza, desvEst, arrayTime, "Acuerdo con la renta");
        setVariables();

        //============ Pago del depósito ============
        console.log("\n\nTest pay security deposit")
        // Initial balance of the account
        initial = await web3.eth.getBalance(walletUser4);
        console.log(`Gas Initial: ${initial.toString()}`);

        for (var i=0; i<iteracciones; i++) {
            // start for
            var rentHash = await rem.getRentHashById(i)
            start = new Date().getTime();
            // Obtain gas used from the receipt
            receipt = await rem.paySecurityDeposit(rentHash, {from: walletUser4,  value: web3.utils.toWei('4', 'ether')});
            end = new Date().getTime();
            console.log(`Transaction time ${i+1}: ${end - start}`);
            gasUsed = receipt.receipt.gasUsed;
            console.log(`GasUsed ${i+1}: ${receipt.receipt.gasUsed}`);

            // Obtain gasPrice from the transaction
            tx = await web3.eth.getTransaction(receipt.tx);
            gasPrice = parseInt(tx.gasPrice);
            console.log(`GasPrice ${i+1}: ${tx.gasPrice}`);

            // Final balance
            arrayTime.push(end-start);
            media = media + (end-start);
        }
        final = await web3.eth.getBalance(walletUser4);
        console.log(`Gas Final: ${final.toString()}`);

        resultado(media, varianza, desvEst, arrayTime, "Pago depósito");
        setVariables();

        //============ Pago de la renta ============
        console.log("\n\nTest pay rent")
        // Initial balance of the account
        initial = await web3.eth.getBalance(walletUser4);
        console.log(`Gas Initial: ${initial.toString()}`);

        for (var i=0; i<iteracciones; i++) {
            // start for
            var rentHash = await rem.getRentHashById(i)
            start = new Date().getTime();
            // Obtain gas used from the receipt
            receipt = await rem.payRent(rentHash, {from: walletUser4,  value: web3.utils.toWei('2', 'ether')});
            end = new Date().getTime();
            console.log(`Transaction time ${i+1}: ${end - start}`);
            gasUsed = receipt.receipt.gasUsed;
            console.log(`GasUsed ${i+1}: ${receipt.receipt.gasUsed}`);

            // Obtain gasPrice from the transaction
            tx = await web3.eth.getTransaction(receipt.tx);
            gasPrice = parseInt(tx.gasPrice);
            console.log(`GasPrice ${i+1}: ${tx.gasPrice}`);

            // Final balance
            arrayTime.push(end-start);
            media = media + (end-start);
        }
        final = await web3.eth.getBalance(walletUser4);
        console.log(`Gas Final: ${final.toString()}`);

        resultado(media, varianza, desvEst, arrayTime, "Pago Renta");
        setVariables();

    });
});