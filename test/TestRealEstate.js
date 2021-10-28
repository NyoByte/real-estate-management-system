var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
        //Usuarios para Nyo-Poa
        walletUser1 = "0x77aad785F37FF010C22203BCB867B4B00eeF5914";
        walletUser2 = "0x176411Fde97F4c9CD04166cfD3B986045235F9E2";
        walletUser3 = "0xfc1110E952C42fa6c4C0A24eE4fB4D34Fe95758b";
        WalletUser4 = "0x47822E2ad973a0971107F93952d418df82b0eE99";
    })

    it("Test User creation", async () => {
        // Initial balance of the account
        const initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Initial: ${initial.toString()}`);

        const start = new Date().getTime();
        // Obtain gas used from the receipt
        const receipt = await rem.createNewUser("User1", "xxx", "Lima", "La Molina", walletUser1, "12345678", { from: accounts[1] });
        const end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        const gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${receipt.receipt.gasUsed}`);

        // Obtain gasPrice from the transaction
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${tx.gasPrice}`);

        // Final balance
        const final = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Final: ${final.toString()}`);

        const userAddress = await rem.getUserAddressById(0)
        //assert.equal(initial - final, gasUsed, "Consumo diferente xd");
        assert.equal(userAddress, "0x08D1194ce504eB0Ae30D50D04a212ecDb79762DF", "User not created correctly");
    });
    it("Test Property creation", async () => {
        // Initial balance of the account
        const initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Initial: ${initial.toString()}`);

        const start = new Date().getTime();
        // Obtain gas used from the receipt
        const receipt = await rem.createnNewProperty();
        const end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        const gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${receipt.receipt.gasUsed}`);

        // Obtain gasPrice from the transaction
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${tx.gasPrice}`);

        // Final balance
        const final = await web3.eth.getBalance(accounts[1]);
        console.log(`Gas Final: ${final.toString()}`);

        const userAddress = await rem.getUserAddressById(0)
        //assert.equal(initial - final, gasUsed, "Consumo diferente xd");
        assert.equal(userAddress, "0x08D1194ce504eB0Ae30D50D04a212ecDb79762DF", "User not created correctly");
    });
});