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

    struct Property{
        address[] owners;
        uint[] percentOwn;
        bytes32 province;
        bytes32 district;
        bytes32 addres;
        uint area;
        string ipfsHash;
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

    function RealEstateManagement() public{
        contractOwner = msg.sender;
    }


    //Mappings
    mapping (bytes32 => Property) propertyMapping;
    bytes32[] propertyArray;

    mapping(bytes32 => Sell) sellMapping;
    bytes32[] sellArray;

    mapping(bytes32 => Rent) rentMapping;
    bytes32[] rentArray;
    
    mapping(address => User) userMapping;
    address[] userArray;

    
    //Funciones

    //Funciones User
    function createNewUser(string memory _firstName, string memory _lastName, string memory _province, string memory _district, address _walletaddress, string memory _dni) public{
        require(msg.sender == contractOwner);
        require(bytes(_firstName).length<255);
        require(bytes(_lastName).length<255);
        require(bytes(_province).length<255);
        require(bytes(_district).length<255);
        require(userArray.length < 40000000);
        _firstName = _toLower(_firstName);
        _lastName = _toLower(_lastName);
        _province = _toLower(_province);
        _district = _toLower(_district);

        require(userMapping[_walletaddress].exists == false);
        userMapping[_walletaddress].firstName = stringToBytes32(_firstName);
        userMapping[_walletaddress].lastName = stringToBytes32(_lastName);
        userMapping[_walletaddress].province = stringToBytes32(_province);
        userMapping[_walletaddress].district = stringToBytes32(_district);
        userMapping[_walletaddress].dni = stringToBytes32(_dni);
        userMapping[_walletaddress].exists = true;
        userArray.push(_walletaddress);
        //emit creationOfUser(_walletaddress);
    }

    function getUserDetailsByAddress(address accountaddress) public view returns(bytes32 firstName, bytes32 lastName, bytes32 province, bytes32 district, bytes32 dni){
        require(userMapping[accountaddress].exists == true);
        firstName = userMapping[accountaddress].firstName;
        lastName = userMapping[accountaddress].lastName;
        province = userMapping[accountaddress].province;
        district = userMapping[accountaddress].district;
        dni = userMapping[accountaddress].dni;
    }

    function getUserArraylength() public view returns (uint length){
        return userArray.length;
    }

    function getUserAddressById(uint _id) public view returns (address accountaddress){
        require(_id> 0 && _id < 40000000);
        return userArray[_id-1];
    }

    function getUsersArray() public view returns (address[] memory users){
        return userArray;
    }

    //Funciones Sell
    function createSell(uint _price, bytes32 _propertyHash, address _sellTo, uint16 _sellPercentage) public{
        require(sellArray.length < 10000000);
        require(_price > 0 && _price < 10000000000);
        require(userMapping[msg.sender].exists == true);
        require(userMapping[_sellTo].exists == true);

        //Verificar que sea owner y que posea el porcentaje que se desea vender
        address[] memory propOwners = propertyMapping[_propertyHash].owners;
        uint[] memory propPercOwn = propertyMapping[_propertyHash].percentOwn;
        bool isOwner;
        uint percOwn;
        for(uint i=0; i<propOwners.length; i++){
            if(propOwners[i] == msg.sender){
                require(propPercOwn[i] >= _sellPercentage);
                isOwner=true;
                percOwn = propPercOwn[i];
            }
        }
        require(isOwner);

        uint _id = sellArray.length + 1;
        bytes32 sellHash = keccak256(_id, _propertyHash);
        sellMapping[sellHash].id = _id;
        sellMapping[sellHash].propertyHash = _propertyHash;
        sellMapping[sellHash].percentOwn = percOwn;
        sellMapping[sellHash].buyFrom = msg.sender;
        sellMapping[sellHash].sellTo = _sellTo;
        sellMapping[sellHash].sellPercentage = _sellPercentage;
        sellMapping[sellHash].sellPrice = _price;
        sellMapping[sellHash].exists = true;
        sellMapping[sellHash].completed = false;
        sellArray.push(sellHash);
        //emit creationOfSell(_id, sellHash);
    }

    function convertEtherToWei(uint value) public pure returns (uint){
        return value*10**18;
    }
    
    function getSellHashById(uint _id) public view returns (bytes32 sellHash){
        require(_id>0 && _id < 10000000);
        return sellArray[_id-1];
    }
    

    function paySell(bytes32 _sellHash) public payable{
        require(msg.sender == sellMapping[_sellHash].sellTo);
        require(msg.value == convertEtherToWei(sellMapping[_sellHash].sellPrice));
        sellMapping[_sellHash].buyFrom.transfer(msg.value);

        for(uint i=0; i<propertyMapping[sellMapping[_sellHash].propertyHash].owners.length; i++){
            if(propertyMapping[sellMapping[_sellHash].propertyHash].owners[i] == sellMapping[_sellHash].buyFrom){
                uint leftPercentage = propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i] - sellMapping[_sellHash].sellPercentage;
                if(leftPercentage <= 0){
                    propertyMapping[sellMapping[_sellHash].propertyHash].owners[i] = propertyMapping[sellMapping[_sellHash].propertyHash].owners[propertyMapping[sellMapping[_sellHash].propertyHash].owners.length-1];
                    propertyMapping[sellMapping[_sellHash].propertyHash].owners = deleteFromAddressArray(propertyMapping[sellMapping[_sellHash].propertyHash].owners, propertyMapping[sellMapping[_sellHash].propertyHash].owners.length-1);

                    propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i] = propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.length -1];
                    //propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.pop();
                    propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn = deleteFromUintArray(propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn, propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.length-1);
                }else{
                    propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i] = leftPercentage;
                }
            }
        }     

        propertyMapping[sellMapping[_sellHash].propertyHash].owners.push(msg.sender);
        propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.push(sellMapping[_sellHash].sellPercentage);
        sellMapping[_sellHash].completed = true;
        //emit sellPayed(_sellHash);
    }

    //Funciones Rent
    function createRent(bytes32 _propertyHash, address _rentedTo, uint _securityDeposit, uint _rentValue) public{
        require(rentArray.length < 10000000);
        require(userMapping[msg.sender].exists == true);
        require(userMapping[_rentedTo].exists == true);
        require(_rentValue > 0 && _rentValue < 10000000000);
        require(_securityDeposit > 0 && _securityDeposit<10000000000 && _securityDeposit < _rentValue);
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
        require(isOwner);

        uint _id = rentArray.length + 1;
        bytes32 rentHash = keccak256(_id, _propertyHash);
        rentMapping[rentHash].id = _id;
        rentMapping[rentHash].propertyHash = _propertyHash;
        rentMapping[rentHash].rentedFrom = propOwners;
        rentMapping[rentHash].agreedOwners = new bool[](propOwners.length);
        rentMapping[rentHash].agreedOwners[ownerIndex] = true;
        rentMapping[rentHash].rentedTo = _rentedTo;
        rentMapping[rentHash].securityDeposit = _securityDeposit;
        rentMapping[rentHash].rentValue = _rentValue;
        rentMapping[rentHash].representative = msg.sender;
        rentMapping[rentHash].state = RentState.CREATED;
        rentArray.push(rentHash);
        //emit creationOfRent(_id, rentHash);
    }

    function agreeRent(bytes32 _rentHash) public{
        require(userMapping[msg.sender].exists == true);
        address[] memory rentPropOwners = rentMapping[_rentHash].rentedFrom;

        bool isOwner;
        for(uint i=0; i<rentPropOwners.length; i++){
            if(rentPropOwners[i] == msg.sender){
                isOwner=true;
                rentMapping[_rentHash].agreedOwners[i] = true;
            }
        }
        require(isOwner);
    }

    function paySecurityDeposit(bytes32 _rentHash) public payable{
        require(msg.sender == rentMapping[_rentHash].rentedTo);
        require(msg.value == convertEtherToWei(rentMapping[_rentHash].securityDeposit));
        for(uint i=0; i<rentMapping[_rentHash].agreedOwners.length; i++){
            require(rentMapping[_rentHash].agreedOwners[i]==true);
        }
        rentMapping[_rentHash].representative.transfer(msg.value);
        rentMapping[_rentHash].state = RentState.STARTED;
        //emit startOfRent(_rentHash);
    }

    function payRent(bytes32 _rentHash) public payable{
        require(rentMapping[_rentHash].state == RentState.STARTED);
        require(msg.sender == rentMapping[_rentHash].rentedTo);
        require(msg.value == convertEtherToWei(rentMapping[_rentHash].rentValue));
        rentMapping[_rentHash].representative.transfer(msg.value);
        //emit rentPayed(_rentHash);
    }

    function terminateRent(bytes32 _rentHash) public payable{
        require(msg.sender == rentMapping[_rentHash].representative);
        rentMapping[_rentHash].rentedTo.transfer(msg.value);
        rentMapping[_rentHash].state = RentState.TERMINATED;
        //emit rentTerminated(_rentHash);
    }

    function getRentHashById(uint _id) public view returns(bytes32 _rentHash){
        require(_id>0 && _id < 10000000);
        return rentArray[_id-1];
    }

    //Funciones Property
    function createnNewProperty(string memory _province, string memory _district, string memory _addres, uint _area, address[] memory _owners, uint16[] memory _percentOwn, string memory _ipfsHash) public{
        require(propertyArray.length<400000000);
        require(msg.sender == contractOwner);
        require(bytes(_province).length<255);
        require(bytes(_district).length<255);
        require(bytes(_addres).length<255);
        require(_area<10000);
        require(_owners.length>0 && _owners.length<10);
        _province = _toLower(_province);
        _district = _toLower(_district);
        _addres = _toLower(_addres);
        bytes32 propertyHash = keccak256(_province, _district, _addres, _area);
        require(propertyMapping[propertyHash].exists == false);
        for(uint i=0; i<_owners.length;i++){
            require(userMapping[_owners[i]].exists==true);
        }

        uint sum = 0;
        for(uint j=0; j<_percentOwn.length;j++){
            require(_percentOwn[j]>0 && _percentOwn[j]<=100);
            sum = sum + _percentOwn[j];
        }
        require(sum==100);
        //require(userMapping[accountaddress].exists);
        propertyMapping[propertyHash].province = stringToBytes32(_province);
        propertyMapping[propertyHash].district = stringToBytes32(_district);
        propertyMapping[propertyHash].addres = stringToBytes32(_addres);
        propertyMapping[propertyHash].area = _area;

        propertyMapping[propertyHash].owners = _owners;
        propertyMapping[propertyHash].percentOwn = _percentOwn;
        propertyMapping[propertyHash].ipfsHash = _ipfsHash;
        /*
        for(uint i=0; i<_owners.length; i++){
            userPropertyOwnedMapping[_owners[i]].propertyHash = propertyHash;
            userPropertyOwnedMapping[_owners[i]].percentOwn = _percentOwn[i];
        }
        */
        propertyMapping[propertyHash].exists = true;
        propertyArray.push(propertyHash);
        //emit addNewProperty(propertyHash);
    }
    
    function getPropertyHashById(uint id) public view returns(bytes32 propertyHash) {
        require(id>0 && id < 400000000);
        return propertyArray[id-1];
    }

    function getPropertyByHash(bytes32 propertyHash) public view returns(bytes32 province, bytes32 district, bytes32 addres, uint area, address[] memory owners, uint[] memory percentOwn, string memory ipfsHash) {
        require(propertyMapping[propertyHash].exists == true);
        province = propertyMapping[propertyHash].province;
        district = propertyMapping[propertyHash].district;
        addres = propertyMapping[propertyHash].addres;
        area = propertyMapping[propertyHash].area;
        owners = propertyMapping[propertyHash].owners;
        percentOwn = propertyMapping[propertyHash].percentOwn;
        ipfsHash = propertyMapping[propertyHash].ipfsHash;
    }

    function getPropertyArray() public view returns (bytes32[] memory property){
        return propertyArray;
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

    function deleteFromAddressArray(address[] storage myArray, uint index) internal returns (address[]){
        myArray[index] = myArray[myArray.length - 1];
        delete myArray[myArray.length - 1];
        myArray.length--;
        return myArray;
    }

    function deleteFromUintArray(uint[] storage myArray, uint index) internal returns (uint[]){
        myArray[index] = myArray[myArray.length - 1];
        delete myArray[myArray.length - 1];
        myArray.length--;
        return myArray;
    }

}