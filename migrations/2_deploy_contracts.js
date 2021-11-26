var RealEstateManagement = artifacts.require("./RealEstateManagement.sol");

module.exports = function(deployer) {
  deployer.deploy(RealEstateManagement);
};
