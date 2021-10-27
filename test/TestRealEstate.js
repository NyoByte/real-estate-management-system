var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
    })

    it("Test User creation", async () => {
        // Initial balance of the account
        const initial = await web3.eth.getBalance(accounts[1]);
        console.log(`Initial: ${initial.toString()}`);

        const start = new Date().getTime();
        // Obtain gas used from the receipt
        const receipt = await rem.createNewUser("User1", "xxx", "Lima", "La Molina", "0x08D1194ce504eB0Ae30D50D04a212ecDb79762DF", "12345678", { from: accounts[1] });
        const end = new Date().getTime();
        console.log(`Transaction time: ${end - start}`);
        const gasUsed = receipt.receipt.gasUsed;
        console.log(`GasUsed: ${receipt.receipt.gasUsed}`);

        // Obtain gasPrice from the transaction
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = parseInt(tx.gasPrice);
        console.log(`GasPrice: ${tx.gasPrice}`);

        // Final balance
        const final = await web3.eth.getBalance(accounts[0]);
        console.log(`Final: ${final.toString()}`);

        const userAddress = await rem.getUserAddressById(0)

        assert.equal(userAddress, "0x08D1194ce504eB0Ae30D50D04a212ecDb79762DF", "User not created correctly");
    });
});