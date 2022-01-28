var SupplyChainStorage = artifacts.require("./SupplyChainStorage.sol");
var ClothingSupplyChain = artifacts.require("./ClothingSupplyChain.sol");

module.exports = function (deployer) {
  deployer.deploy(SupplyChainStorage).then(()=>{
    return deployer.deploy(ClothingSupplyChain,SupplyChainStorage.address);
  }).catch(function(error){
    console.log(error)
  });
};
