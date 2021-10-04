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
    }

    struct Rent{
        uint id;
        bytes32 propertyHash;
        bytes32 rentedFrom;
        bytes32 rentedTo;
        uint depositedValue;
        uint rentValue;   
    }

    struct UserOwned{
        uint number;
        bytes32[] sellList;
    }

    struct UserRented{
        uint number;
        bytes32[] rentList;
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

    /*
    struct Department{
        address[] owners;
        uint[] perOwnerPercentage;
        bytes32 province; 
        bytes32 district;
        bytes32 addres;
        uint floorNumber;
        uint roomNumber;
        uint area;
        uint roomQuantity;
        uint bathroomQuantity;
        bool kitchen;
        bool laundry;
        bool terrace;
        bool diningRoom;
        bool parking;
        bool elevator;
        bytes32[] facilities;
        bool exists;
    }

    struct House{
        address[] owners;
        uint[] perOwnerPercentage;
        bytes32 province;
        bytes32 district;
        bytes32 addres;
        uint area;
        uint roomQuantity;
        uint bathroomQuantity;
        uint floorsQuantity;
        bool kitchen;
        bool laundry;
        bool terrace;
        bool diningRoom;
        bool parking;
        bool exists;
    }
    */
    address contractOwner;
    
    //Eventos
    event addNewProperty(bytes32 propertyHash);
    //event addNewDepartment(bytes32 propertyHash);
    //event addNewHouse(bytes32 propertyHash);
    event creationOfUser(address accountAddress);
    event creationOfSell(bytes32 sellHash);

    constructor() public{
        contractOwner = msg.sender;
    }


    //Mappings
    mapping (bytes32 => Property) propertyMapping;
    bytes32[] propertyArray;

    mapping(address => UserPropertyOwned) userPropertyOwnedMapping;
    
    /*
    mapping (bytes32 => Department) departmentMapping;
    bytes32[] departmentArray;

    mapping (bytes32 => House) houseMapping;
    bytes32[] houseArray;
    */

    mapping(bytes32 => Sell) sellMapping;
    bytes32[] sellArray;

    mapping(bytes32 => Rent) rentMapping;
    bytes32[] rentArray;

    mapping(bytes32 => UserOwned) userOwnedMapping;
    
    mapping(bytes32 => UserRented) userRentedMapping;
    
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

    
    //Funciones userOwned
    function addUserOwned(bytes32 _dni, bytes32 _sellHash) public{
        userOwnedMapping[_dni].number++;
        userOwnedMapping[_dni].sellList.push(_sellHash);
    }
    
    function getUserOwnedByDni(bytes32 _dni) public view returns (bytes32[] memory selledList){
        require(userOwnedMapping[_dni].number > 0, "User has no sells");
        return userOwnedMapping[_dni].sellList;
    }
    

    //Funciones userRented
    function addUserRented(bytes32 _dni, bytes32 _rentHash) public{
        userRentedMapping[_dni].number++;
        userRentedMapping[_dni].rentList.push(_rentHash);
    }

    function getUserRentedByDni(bytes32 _dni) public view returns (bytes32[] memory rentList){
        require(userRentedMapping[_dni].number > 0, "User has no rents");
        return userRentedMapping[_dni].rentList;
    }


    //Funciones Sell
    function createSell(uint _id, uint _price, bytes32 _propertyHash, address _sellTo, uint16 _sellPercentage) public{
        require(userPropertyOwnedMapping[msg.sender].propertyHash == _propertyHash, "You are not owner of the property");
        require(userPropertyOwnedMapping[msg.sender].percentOwn <= _sellPercentage, "You don't have enough property percentage");
        bytes32 sellHash = keccak256(abi.encodePacked(_id, _propertyHash));
        sellMapping[sellHash].id = _id;
        sellMapping[sellHash].propertyHash = _propertyHash;
        sellMapping[sellHash].percentOwn = userPropertyOwnedMapping[msg.sender].percentOwn;
        sellMapping[sellHash].buyFrom = msg.sender;
        sellMapping[sellHash].sellTo = _sellTo;
        sellMapping[sellHash].sellPercentage = _sellPercentage;
        sellMapping[sellHash].sellPrice = _price*10**18;
        sellMapping[sellHash].exists = true;
        sellArray.push(sellHash);
    }
    
    function getSellHashById(uint _id) public view returns (bytes32 sellHash){
        return sellArray[_id];
    }
    

    function paySell(bytes32 _sellHash) public payable returns (bool message){
        require(msg.sender == sellMapping[_sellHash].sellTo, "You are not the buyer of this sell");
        require(msg.value == sellMapping[_sellHash].sellPrice, string(abi.encodePacked("The amount is not correct, you sent ",msg.value," and required ",sellMapping[_sellHash].sellPrice)));
        payable(sellMapping[_sellHash].buyFrom).transfer(msg.value);


        for(uint i=0; i<propertyMapping[sellMapping[_sellHash].propertyHash].owners.length; i++){
            if(propertyMapping[sellMapping[_sellHash].propertyHash].owners[i] == sellMapping[_sellHash].buyFrom)
                delete propertyMapping[sellMapping[_sellHash].propertyHash].owners[i];
                delete propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn[i];
        }     

        propertyMapping[sellMapping[_sellHash].propertyHash].owners.push(msg.sender);
        propertyMapping[sellMapping[_sellHash].propertyHash].percentOwn.push(sellMapping[_sellHash].sellPercentage);
        return true;
    }
    

    //Funciones Property
    function createnNewProperty(string memory _province, string memory _district, string memory _addres, uint _area, address[] memory _owners, uint16[] memory _percentOwn) public{
        require(msg.sender == contractOwner, "You are not unauthorized");
        _province = _toLower(_province);
        _district = _toLower(_district);
        _addres = _toLower(_addres);
        bytes32 propertyHash = keccak256(abi.encodePacked(_province, _district, _addres, _area));
        require(propertyMapping[propertyHash].exists == false, "Property already exists");
        propertyMapping[propertyHash].province = stringToBytes32(_province);
        propertyMapping[propertyHash].district = stringToBytes32(_district);
        propertyMapping[propertyHash].addres = stringToBytes32(_addres);
        propertyMapping[propertyHash].area = _area;

        propertyMapping[propertyHash].owners = _owners;
        propertyMapping[propertyHash].percentOwn = _percentOwn;

        for(uint i=0; i<_owners.length; i++){
            userPropertyOwnedMapping[_owners[i]].propertyHash = propertyHash;
            userPropertyOwnedMapping[_owners[i]].percentOwn = _percentOwn[i];
        }

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

    //Funciones Department
    /*
    function createNewDepartment(string memory _province, string memory _district, string memory _addres, uint _area, uint _floorNumber, uint _roomNumber,
        uint _roomQuantity, uint _bathroomQuantity, bool _kitchen, bool _laundry, bool _terrace, bool _diningRoom, bool _parking, bool _elevator, string[] memory _facilities) public{
        require(msg.sender == contractOwner, "You are not unauthorized");
        _province = _toLower(_province);
        _district = _toLower(_district);
        _addres = _toLower(_addres);
        for(uint i=0; i < _facilities.length; i++){
            _facilities[i] = _toLower(_facilities[i]);
        }
        bytes32 departmentHash = keccak256(abi.encodePacked(_province, _district, _addres));
        require(departmentMapping[departmentHash].exists == false, "Department already exists");
        departmentMapping[departmentHash].province = stringToBytes32(_province);
        departmentMapping[departmentHash].district = stringToBytes32(_district);
        departmentMapping[departmentHash].addres = stringToBytes32(_addres);
        for(uint i=0; i < _facilities.length; i++){
            departmentMapping[departmentHash].facilities[i] = stringToBytes32(_facilities[i]);
        }
        departmentMapping[departmentHash].area = _area;
        departmentMapping[departmentHash].roomQuantity = _roomQuantity;
        departmentMapping[departmentHash].bathroomQuantity = _bathroomQuantity;
        departmentMapping[departmentHash].kitchen = _kitchen;
        departmentMapping[departmentHash].laundry = _laundry;
        departmentMapping[departmentHash].terrace = _terrace;
        departmentMapping[departmentHash].diningRoom = _diningRoom;
        departmentMapping[departmentHash].parking = _parking;
        departmentMapping[departmentHash].elevator = _elevator;
        departmentMapping[departmentHash].exists = true;
        departmentArray.push(departmentHash);
        emit addNewDepartment(departmentHash);
    }
    */

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