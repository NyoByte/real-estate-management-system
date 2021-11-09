var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

contract('RealEstateManagement', function (accounts) {
    //let rem = RealEstateManagement.new( {from: accounts[0]});
    before(async function () {
        rem = await RealEstateManagement.new({ from: accounts[1] });
        //Usuarios para Nyo-Poa
        //admin
        await rem.createNewUser("User1", "xxx", "Lima", "La Molina", accounts[1], "12345678", { from: accounts[1] });
        await rem.createNewUser("User1", "xxx", "Lima", "La Molina", accounts[2], "12345678", { from: accounts[1] });

        await rem.createnNewProperty("Lima", "San Luis", "Av. Siempre viva 123", 120, [accounts[1]], [100], { from: accounts[1] })

        propertyHash = await rem.getPropertyHashById(0)

    })

    it("Test multiple sells 1", () => {
        console.log("Starting...")
        let end = false
        for(i=2;i<9;i++){
            rem.createSell(2,propertyHash,accounts[i],1, {from: accounts[1]}).then(function (tx) {
                if(i==8){
                    end = true
                }
                console.log("Sell created")
                console.log(tx)
            })
        }
        while(!end){
        }
    });
});