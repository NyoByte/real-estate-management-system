pragma solidity >=0.4.22 <0.9.0;

contract RealEstateManagement{

    //Structs
    struct User{
        bytes32 firstName;
        bytes32 dni;
        bytes32 lastName;
        bytes32 province;
        bytes32 district;
        bool exists;
    }

    struct Sell{
        uint id;
        bytes32 propertyHash;
        uint percentOwn;
        address buyFrom;
        address sellTo;
        uint sellPercentage;
        uint sellPrice;
        bool exists;
        bool completed;
    }

    enum RentState{CREATED, STARTED, TERMINATED}

    struct Rent{
        uint id;
        bytes32 propertyHash;
        address[] rentedFrom;
        address representative;
        bool[] agreedOwners;
        address rentedTo;
        uint securityDeposit;
        uint rentValue;
        RentState state;
    }

    struct UserPropertyOwned{
        bytes32 propertyHash;
        uint16 percentOwn;
    }

    struct Property{
        address[] owners;
        uint[] percentOwn;
        bytes32 province;
        bytes32 district;
        bytes32 addres;
        uint area;
        bytes32 ipfsHash;
        bool exists;
    }

    address contractOwner;
    
    //Eventos
    event addNewProperty(bytes32 propertyHash);
    event creationOfUser(address accountAddress);
    event creationOfSell(uint id, bytes32 sellHash);
    event sellPayed(bytes32 sellHash);
    event creationOfRent(uint id, bytes32 rentHash);
    event startOfRent(bytes32 rentHash);
    event rentPayed(bytes32 rentHash);
    event rentTerminated(bytes32 rentHash);

    constructor() public{
        contractOwner = msg.sender;
    }


    //Mappings
    mapping (bytes32 => Property) propertyMapping;
    bytes32[] propertyArray;

    mapping(address => UserPropertyOwned) userPropertyOwnedMapping;

    mapping(bytes32 => Sell) sellMapping;
    bytes32[] sellArray;

    mapping(bytes32 => Rent) rentMapping;
    bytes32[] rentArray;
    
    mapping(address => User) userMapping;
    address[] userArray;

    
    //Funciones

    //Funciones User
    function createNewUser(string memory _firstName, string memory _lastName, string memory _province, string memory _district, address _walletaddress, string memory _dni) public{
        require(msg.sender == contractOwner, "You are not unauthorized");
        _firstName = _toLower(_firstName);
        _lastName = _toLower(_lastName);
        _province = _toLower(_province);
        _province = _toLower(_district);

        require(userMapping[_walletaddress].exists == false, "User already exists");
        userMapping[_walletaddress].firstName = stringToBytes32(_firstName);
        userMapping[_walletaddress].lastName = stringToBytes32(_lastName);
        userMapping[_walletaddress].province = stringToBytes32(_province);
        userMapping[_walletaddress].district = stringToBytes32(_district);
        userMapping[_walletaddress].dni = stringToBytes32(_dni);
        userMapping[_walletaddress].exists = true;
        userArray.push(_walletaddress);
        emit creationOfUser(_walletaddress);
    }

    function getUserDetailsByAddress(address accountaddress) public view returns(bytes32 firstName, bytes32 lastName, bytes32 province, bytes32 district, bytes32 dni){
        require(userMapping[accountaddress].exists == true, "User does not exist");
        firstName = userMapping[accountaddress].firstName;
        lastName = userMapping[accountaddress].lastName;
        province = userMapping[accountaddress].province;
        district = userMapping[accountaddress].district;
        dni = userMapping[accountaddress].dni;
    }

    function getUserArraylength() public view returns (uint length){
        return userArray.length;
    }

    function getUserAdressById(uint _id) public view returns (address accountaddress){
        return userArray[_id];
    }

    //Funciones Sell
    function createSell(uint _price, bytes32 _propertyHash, address _sellTo, uint16 _sellPercentage) public{
        require(userMapping[msg.sender].exists == true, "Only registered users can create sells");
        require(userMapping[_sellTo].exists == true, "You can only sell to a registered user");

        //Verificar que sea owner y que posea el porcentaje que se desea vender
        address[] memory propOwners = propertyMapping[_propertyHash].owners;
        uint[] memory propPercOwn = propertyMapping[_propertyHash].percentOwn;
        bool isOwner;
        for(uint i=0; i<propOwners.length; i++){
            if(propOwners[i] == msg.sender){
                require(propPercOwn[i] >= _sellPercentage, "You don't have enough property percentage");
                isOwner=true;
            }
        }
        require(isOwner, "You are not owner of the property");

        uint _id = sellArray.length;
        bytes32 sellHash = keccak256(abi.encodePacked(_id, _propertyHash));
        sellMapping[sellHash].id = _id;
        sellMapping[sellHash].propertyHash = _propertyHash;
        sellMapping[sellHash].percentOwn = userPropertyOwnedMapping[msg.sender].percentOwn;
        sellMapping[sellHash].buyFrom = msg.sender;
        sellMapping[sellHash].sellTo = _sellTo;
        sellMapping[sellHash].sellPercentage = _sellPercentage;
        sellMapping[sellHash].sellPrice = _price*10**18;
        sellMapping[sellHash].exists = true;
        sellMapping[sellHash].completed = false;
        sellArray.push(sellHash);
        emit creationOfSell(_id, sellHash);
    }
    
    function getSellHashById(uint _id) public view returns (bytes32 sellHash){
        return sellArray[_id];
    }
    

    function paySell(bytes32 _sellHash) public payable{
        require(msg.sender == sellMapping[_sellHash].sellTo, "You are not the buyer of this sell");
        require(msg.value == sellMapping[_sellHash].sellPrice, "The amount is not correct");
        payable(sellMapping[_sellHash].buyFrom).transfer(msg.value);

        for(uint i=0; i<propertyMapping[sellMapping[_sellHash].propertyHash].owners.length; i++){
            if(propertyMapping[sellMapping[_sellHash].propertyHash].owners[i] == sellMapping[_sellHash].buyFrom){
                uint leftPercentage = propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i] - sellMapping[_sellHash].sellPercentage;
                if(leftPercentage <= 0){
                    propertyMapping[sellMapping[_sellHash].propertyHash].owners[i] = propertyMapping[sellMapping[_sellHash].propertyHash].owners[propertyMapping[sellMapping[_sellHash].propertyHash].owners.length-1];
                    propertyMapping[sellMapping[_sellHash].propertyHash].owners.pop();

                    propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i] = propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.length -1];
                    propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.pop();
                }else{
                    propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i] = leftPercentage;
                }
            }
        }     

        propertyMapping[sellMapping[_sellHash].propertyHash].owners.push(msg.sender);
        propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.push(sellMapping[_sellHash].sellPercentage);
        sellMapping[_sellHash].completed = true;
        emit sellPayed(_sellHash);
    }

    //Funciones Rent
    function createRent(bytes32 _propertyHash, address _rentedTo, uint _securityDeposit, uint _rentValue) public{
        require(userMapping[msg.sender].exists == true, "Only registered users can create rents");
        require(userMapping[_rentedTo].exists == true, "You can only rent to a registered user");

        //Verificar que sea owner
        address[] memory propOwners = propertyMapping[_propertyHash].owners;
        bool isOwner;
        uint ownerIndex;
        for(uint i=0; i<propOwners.length; i++){
            if(propOwners[i] == msg.sender){
                isOwner=true;
                ownerIndex = i;
            }
        }
        require(isOwner, "You are not owner of the property");

        uint _id = rentArray.length;
        bytes32 rentHash = keccak256(abi.encodePacked(_id, _propertyHash));
        rentMapping[rentHash].id = _id;
        rentMapping[rentHash].propertyHash = _propertyHash;
        rentMapping[rentHash].rentedFrom = propOwners;
        rentMapping[rentHash].agreedOwners = new bool[](propOwners.length);
        rentMapping[rentHash].agreedOwners[ownerIndex] = true;
        rentMapping[rentHash].rentedTo = _rentedTo;
        rentMapping[rentHash].securityDeposit = _securityDeposit*10**18;
        rentMapping[rentHash].rentValue = _rentValue*10**18;
        rentMapping[rentHash].representative = msg.sender;
        rentMapping[rentHash].state = RentState.CREATED;
        rentArray.push(rentHash);
        emit creationOfRent(_id, rentHash);
    }

    function agreeRent(bytes32 _rentHash) public{
        require(userMapping[msg.sender].exists == true, "Only registered users can create rents");
        address[] memory rentPropOwners = rentMapping[_rentHash].rentedFrom;

        bool isOwner;
        for(uint i=0; i<rentPropOwners.length; i++){
            if(rentPropOwners[i] == msg.sender){
                isOwner=true;
                rentMapping[_rentHash].agreedOwners[i] = true;
            }
        }
        require(isOwner, "You are not owner of the property");
    }

    function paySecurityDeposit(bytes32 _rentHash) public payable{
        require(msg.sender == rentMapping[_rentHash].rentedTo, "You are not tenant of this rent");
        require(msg.value == rentMapping[_rentHash].securityDeposit, "Wrong amount");
        for(uint i=0; i<rentMapping[_rentHash].agreedOwners.length; i++){
            require(rentMapping[_rentHash].agreedOwners[i]==true, "Not all property owners have signed the contract");
        }
        payable(rentMapping[_rentHash].representative).transfer(msg.value);
        rentMapping[_rentHash].state = RentState.STARTED;
        emit startOfRent(_rentHash);
    }

    function payRent(bytes32 _rentHash) public payable{
        require(rentMapping[_rentHash].state == RentState.STARTED, "Rent state not started");
        require(msg.sender == rentMapping[_rentHash].rentedTo, "You are not tenant of this rent");
        require(msg.value == rentMapping[_rentHash].rentValue, "Wrong amount");
        payable(rentMapping[_rentHash].representative).transfer(msg.value);
        emit rentPayed(_rentHash);
    }

    function terminateRent(bytes32 _rentHash) public payable{
        require(msg.sender == rentMapping[_rentHash].representative, "You are not representative of this rent owners");
        payable(rentMapping[_rentHash].rentedTo).transfer(msg.value);
        rentMapping[_rentHash].state = RentState.TERMINATED;
        emit rentTerminated(_rentHash);
    }

    function getRentHashById(uint _id) public view returns(bytes32 _rentHash){
        return rentArray[_id];
    }

    //Funciones Property
    function createnNewProperty(string memory _province, string memory _district, string memory _addres, uint _area, bytes32 _ipfsHash, address[] memory _owners, uint16[] memory _percentOwn) public{
        require(msg.sender == contractOwner, "You are not authorized");
        _province = _toLower(_province);
        _district = _toLower(_district);
        _addres = _toLower(_addres);
        bytes32 propertyHash = keccak256(abi.encodePacked(_province, _district, _addres, _area));
        require(propertyMapping[propertyHash].exists == false, "Property already exists");
        for(uint i=0; i<_owners.length;i++){
            require(userMapping[_owners[i]].exists==true,"User does not exists");
            // Debería ir estas dos lineas ?
            userPropertyOwnedMapping[_owners[i]].propertyHash = propertyHash;
            userPropertyOwnedMapping[_owners[i]].percentOwn = _percentOwn[i];
        }
        //require(userMapping[accountaddress].exists);
        propertyMapping[propertyHash].province = stringToBytes32(_province);
        propertyMapping[propertyHash].district = stringToBytes32(_district);
        propertyMapping[propertyHash].addres = stringToBytes32(_addres);
        propertyMapping[propertyHash].area = _area;
        propertyMapping[propertyHash].ipfsHash = _ipfsHash;

        propertyMapping[propertyHash].owners = _owners;
        propertyMapping[propertyHash].percentOwn = _percentOwn;
        /*
        for(uint i=0; i<_owners.length; i++){
            userPropertyOwnedMapping[_owners[i]].propertyHash = propertyHash;
            userPropertyOwnedMapping[_owners[i]].percentOwn = _percentOwn[i];
        }
        */
        propertyMapping[propertyHash].exists = true;
        propertyArray.push(propertyHash);
        emit addNewProperty(propertyHash);
    }
    
    function getPropertyHashById(uint id) public view returns(bytes32 propertyHash) {
        return propertyArray[id];
    }

    function getPropertyByHash(bytes32 propertyHash) public view returns(bytes32 province, bytes32 district, bytes32 addres, uint area, address[] memory owners, uint[] memory percentOwn) {
        require(propertyMapping[propertyHash].exists == true, "Land doesn't exist");
        province = propertyMapping[propertyHash].province;
        district = propertyMapping[propertyHash].district;
        addres = propertyMapping[propertyHash].addres;
        area = propertyMapping[propertyHash].area;
        owners = propertyMapping[propertyHash].owners;
        percentOwn = propertyMapping[propertyHash].percentOwn;
        
    }


    //Funciones globales
    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }
}