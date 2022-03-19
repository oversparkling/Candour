pragma solidity ^0.8.11;

import "./SupplyChainStorage.sol";

contract ClothingSupplyChain {
    SupplyChainStorage supplyChainStorage;
    event CottonHarvested(address indexed user, address indexed batchNo);
    event CottonBatchNo(
        address indexed user,
        string registrationNo,
        string farmerName,
        string farmAddress,
        string exporterName,
        string importerName
    );
    event FabricManufactured(address indexed user, address indexed batchNo);
    event FabricBatchNo(
        address indexed user,
        string factoryName,
        string fabricType,
        string dyeUsed,
        string pocName,
        string pocId,
        string waterUsed
    );

    event ShirtManufactured(address indexed user, address indexed batchNo);
    event RetrievedAll(
        address indexed user,
        SupplyChainStorage.basicDetails[] result
    );

    struct basicDetails {
        string registrationNo;
        string farmerName;
        string farmAddress;
        string exporterName;
        string importerName;
    }

    struct fabricDetails {
        string factoryName;
        string fabricType;
        string dyeUsed;
        string waterUsed;
        string pocName;
        string pocId;
    }

    constructor(address _supplyChainAddress) public {
        supplyChainStorage = SupplyChainStorage(_supplyChainAddress);
    }

    function setBasicDetails(
        string memory _registrationNo,
        string memory _farmerName,
        string memory _farmAddress,
        string memory _exporterName,
        string memory _importerName
    ) public returns (address) {
        address batchNo = supplyChainStorage.setBasicDetails(
            _registrationNo,
            _farmerName,
            _farmAddress,
            _exporterName,
            _importerName
        );

        emit CottonHarvested(msg.sender, batchNo);

        return (batchNo);
    }

    function getBasicDetails(address _batchNo)
        public
        returns (
            string memory registrationNo,
            string memory farmerName,
            string memory farmAddress,
            string memory exporterName,
            string memory importerName
        )
    {
        /* Call Storage Contract */
        (
            registrationNo,
            farmerName,
            farmAddress,
            exporterName,
            importerName
        ) = supplyChainStorage.getBasicDetails(_batchNo);
        emit CottonBatchNo(
            msg.sender,
            registrationNo,
            farmerName,
            farmAddress,
            exporterName,
            importerName
        );
        return (
            registrationNo,
            farmerName,
            farmAddress,
            exporterName,
            importerName
        );
    }

    function getAllBasicDetails()
        public
        returns (SupplyChainStorage.basicDetails[] memory result)
    {
        SupplyChainStorage.basicDetails[] memory tempResult = supplyChainStorage
            .getAllBasicDetails();
        emit RetrievedAll(msg.sender, tempResult);
        return (tempResult);
    }

    function setFabricDetails(
        address batchNo,
        string memory factoryName,
        string memory fabricType,
        string memory dyeUsed,
        string memory pocName,
        string memory pocId,
        string memory waterUsed
    ) public returns (address) {
        supplyChainStorage.setFabricDetails(
            batchNo,
            factoryName,
            fabricType,
            dyeUsed,
            pocName,
            pocId,
            waterUsed
        );

        emit FabricManufactured(msg.sender, batchNo);

        return (batchNo);
    }



    function getFabricDetails(address _batchNo)
        public
        returns (
            string memory factoryName,
            string memory fabricType,
            string memory dyeUsed,
            string memory _pocName,
            string memory _pocId,
            string memory _waterUsed
        )
    {
        /* Call Storage Contract */
        (
            factoryName,
            fabricType,
            dyeUsed,
            _pocName,
            _pocId,
            _waterUsed
        ) = supplyChainStorage.getFabricDetails(_batchNo);
        emit FabricBatchNo(
            msg.sender,
            factoryName,
            fabricType,
            dyeUsed,
            _pocName,
            _pocId,
            _waterUsed
        );
        return (factoryName, fabricType, dyeUsed, _pocName, _pocId, _waterUsed);
    }
}
