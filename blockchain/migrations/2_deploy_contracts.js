const FraudReport = artifacts.require("FraudReport");

module.exports = function (deployer) {
  deployer.deploy(FraudReport);
};
