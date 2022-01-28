pragma solidity ^0.8.11;

contract SupplyChainStorage{
    

    struct basicDetails{
        string registrationNo;
        string farmerName;
        string farmAddress;
        string exporterName;
        string importerName;
    }

    struct fabricManufacturer{
        string fabricType;
        string dyeUsed;
        string waterUsed;
    }

    struct shirtManufacturer{
        string manufacturerName;
        string personInCharge;
    }

    //SuppyChain contract should contain these
    basicDetails basicDetailsData;
    fabricManufacturer fabricManufacturerData;
    shirtManufacturer shirtManufacturerData;

    mapping (address => basicDetails) batchBasicDetails;
    mapping (address => fabricManufacturer) batchFabricManufacturer;
    mapping (address => shirtManufacturer) batchShirtManufacturer;

    //batchNo is only generated during this function, will be same in the 
    //rest of the structs
    function setBasicDetails(string memory _registrationNo,
        string memory _farmerName,
        string memory _farmAddress,
        string memory _exporterName,
        string memory _importerName) public returns(address){

            //Generates a batchNo based on the senders address and the 
            //time of the transaction
            // uint tmpData = uint(keccak256(msg.sender, block.timestamp));
            // address batchNo = address(tmpData);


            address batchNo = address(bytes20(sha256(abi.encodePacked(msg.sender,block.timestamp))));

            //Setting the basicDetails of the entity
            basicDetailsData.registrationNo = _registrationNo;
            basicDetailsData.farmerName = _farmerName;
            basicDetailsData.farmAddress = _farmAddress;
            basicDetailsData.exporterName = _exporterName;
            basicDetailsData.importerName = _importerName;
            batchBasicDetails[batchNo] = basicDetailsData;

            return batchNo;
        }

    
    //Requires the batchNo which is the identifer for the individual structs
    function getBasicDetails(address _batchNo) public view returns(string memory registrationNo,
                             string memory farmerName,
                             string memory farmAddress,
                             string memory exporterName,
                             string memory importerName) {
        
        basicDetails memory tmpData = batchBasicDetails[_batchNo];
        
        return (tmpData.registrationNo,tmpData.farmerName,tmpData.farmAddress,tmpData.exporterName,tmpData.importerName);
    }
} 