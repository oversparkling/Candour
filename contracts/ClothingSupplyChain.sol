pragma solidity ^0.8.11;

import "./SupplyChainStorage.sol";



contract ClothingSupplyChain {
    SupplyChainStorage supplyChainStorage;
    event CottonHarvested(address indexed user, address indexed batchNo);
    event FabricManufactured(address indexed user, address indexed batchNo);
    event ShirtManufactured(address indexed user, address indexed batchNo);
    constructor(address _supplyChainAddress) public{
        supplyChainStorage = SupplyChainStorage(_supplyChainAddress);
        // console.log("Hello");
    }

        function addBasicDetails(string memory _registrationNo,
                             string memory _farmerName,
                             string memory _farmAddress,
                             string memory _exporterName,
                             string memory _importerName
                            ) public  returns(address) {
    
        address batchNo = supplyChainStorage.setBasicDetails(_registrationNo,
                                                            _farmerName,
                                                            _farmAddress,
                                                            _exporterName,
                                                            _importerName);
        
        emit CottonHarvested(msg.sender, batchNo); 
        
        return (batchNo);
    }  
}