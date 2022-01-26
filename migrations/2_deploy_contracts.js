const intermediateStage = artifacts.require("./IntermediateStage.sol");

module.exports = function (deployer) {
  deployer.deploy(intermediateStage);
};
