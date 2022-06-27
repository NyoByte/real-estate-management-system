var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[0] });        
        
        // ============ Creacion de usuarios ============
        await rem.createNewUser("User1", "xxx", "Lima", "La Molina", accounts[2], "12345678", { from: accounts[0] });
        await rem.createNewUser("User2", "xxx", "Lima", "La Molina", accounts[3], "74125863", { from: accounts[0] });
        await rem.createNewUser("User3", "xxx", "Lima", "Ate", accounts[4], "12398546", { from: accounts[0] });
        await rem.createNewUser("User4", "xxx", "Lima", "Jesus María", accounts[5], "32458716", { from: accounts[0] });
        await rem.createNewUser("User5", "xxx", "Lima", "San Juan de Miraflores", accounts[6], "54312369", { from: accounts[0] });
        await rem.createNewUser("User6", "xxx", "Lima", "Miraflores", accounts[7], "54387342", { from: accounts[0] });

        //============ Creacion de la propiedad ============
        receipt = await rem.createnNewProperty("Lima", "San Luis", "Av. Siempre viva 123", 120, [accounts[2], accounts[3]], [50,50], { from: accounts[0] });
        receipt = await rem.createnNewProperty("Lima", "San Luis", "Av. Siempre viva 456", 200, [accounts[4], accounts[5], accounts[6]], [30,20, 50], { from: accounts[0] });

        propertyHash = await rem.getPropertyHashById(0);
        propertyHash2 = await rem.getPropertyHashById(1);
    })

    it("should transfer property", async () => {
        //============ Creacion de la venta ============
        await rem.createSell(2,propertyHash,accounts[3],50, {from: accounts[2]});

        var sellHash = await rem.getSellHashById(0);

        //============ Pago de la venta ============
        await rem.paySell(sellHash, {from: accounts[3], value: web3.utils.toWei('2', 'ether')});

        var property = await rem.getPropertyByHash(propertyHash);

        expect(property.owners).to.include.members([accounts[3]])
    });

    it("should fail to create sell", async() => {
        try{
            await rem.createSell(3,propertyHash,accounts[4],100, {from: accounts[3]});
        }catch(err){
            assert.include(err.message, "You don't have enough property percentage")
        }
    })

    it("should fail to sell", async () => {
        await rem.createSell(3,propertyHash,accounts[4],50, {from: accounts[3]});
        
        var sellHash = await rem.getSellHashById(1);

        try{
            await rem.paySell(sellHash, {from: accounts[4], value: web3.utils.toWei('1', 'ether')});
        }catch(err){
            assert.include(err.message, "The amount is not correct");
        }
    })

    it("should fail to rent", async () => {
        await rem.createRent(propertyHash2, accounts[7], 1, 3, {from: accounts[4]});

        var rentHash = await rem.getRentHashById(0);
        try{
            await rem.paySecurityDeposit(rentHash, {from: accounts[7], value: web3.utils.toWei('1', 'ether')})
        }catch(err){
            assert.include(err.message, "Not all property owners have signed the contract");
        }
    })

    it("should start rent", async () => {
        await rem.createRent(propertyHash2, accounts[7], 1, 3, {from: accounts[4]});

        var rentHash = await rem.getRentHashById(0);

        await rem.agreeRent(rentHash, {from: accounts[5]})
        await rem.agreeRent(rentHash, {from: accounts[6]})
        
        var receipt = await rem.paySecurityDeposit(rentHash, {from: accounts[7], value: web3.utils.toWei('1', 'ether')})
        assert.equal(receipt.logs[0].event, "startOfRent")
    })
});