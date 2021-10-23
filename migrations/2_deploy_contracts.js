const RealEstateManagement = artifacts.require("RealEstateManagement");

module.exports = function (deployer) {
  deployer.deploy(RealEstateManagement);
};
