pragma solidity >=0.4.22 <0.9.0;

contract RealEstateManagement{

    struct User{
        string dni;
        string firstName;
        string lastName;
        string province;
        string district;
    }

    struct Property{
        string province;
        string district;
        string addres;
        uint area;
    }

    struct Department{
        Property basicAttributes;
        uint roomQuantity;
        uint bathroomQuantity;
        bool kitchen;
        bool laundry;
        bool terrace;
        bool diningRoom;
        string[] facilities;
        bool parking;
        bool elevator;
    }

    struct House{
        Property basicAttributes;
        uint roomQuantity;
        uint bathroomQuantity;
        bool kitchen;
        bool laundry;
        bool terrace;
        bool diningRoom;
        uint floorsQuantity;
        bool parking;
    }

}