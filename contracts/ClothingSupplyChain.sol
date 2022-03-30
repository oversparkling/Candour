pragma solidity ^0.8.11;

import "./SupplyChainStorage.sol";

contract ClothingSupplyChain {
    SupplyChainStorage supplyChainStorage;
    event CottonHarvested(address indexed user, address indexed batchNo);
    event CottonBatchNo(
        address indexed user,
        string fertiliser,
        string water,
        string deforestation,
        string biowaste
    );
    event FabricManufactured(address indexed user, address indexed batchNo);
    event FabricBatchNo(
        address indexed user,
        string water,
        string electricity,
        string toxicWaste
    );

    event ShirtManufactured(address indexed user, address indexed batchNo);
    event RetrievedAll(
        address indexed user,
        SupplyChainStorage.cottonHarvester[] result
    );

    constructor(address _supplyChainAddress) public {
        supplyChainStorage = SupplyChainStorage(_supplyChainAddress);
    }

    function setCottonHarvester(
        string memory _fertiliser,
        string memory _water,
        string memory _deforestation,
        string memory _biowaste
    ) public returns (address) {
        address batchNo = supplyChainStorage.setCottonHarvester(
            _fertiliser,
            _water,
            _deforestation,
            _biowaste
        );

        emit CottonHarvested(msg.sender, batchNo);

        return (batchNo);
    }

    function getAllCottonHarvester(address _batchNo)
        public
        returns (
            string memory _fertiliser,
            string memory _water,
            string memory _deforestation,
            string memory _biowaste
        )
    {
        /* Call Storage Contract */
        (
            _fertiliser,
            _water,
            _deforestation,
            _biowaste
        ) = supplyChainStorage.getCottonHarvester(_batchNo);
        emit CottonBatchNo(
            msg.sender,
            _fertiliser,
            _water,
            _deforestation,
            _biowaste
        );
        return (
            _fertiliser,
            _water,
            _deforestation,
            _biowaste
        );
    }

    function getAllCottonHarvester()
        public
        returns (SupplyChainStorage.cottonHarvester[] memory result)
    {
        SupplyChainStorage.cottonHarvester[] memory tempResult = supplyChainStorage
            .getAllCottonHarvester();
        emit RetrievedAll(msg.sender, tempResult);
        return (tempResult);
    }

    function setFabricDetails(
        address batchNo,
        string memory water,
        string memory electricity,
        string memory toxicWaste
    ) public returns (address) {
        supplyChainStorage.setFabricDetails(
            batchNo,
            water,
            electricity,
            toxicWaste
        );

        emit FabricManufactured(msg.sender, batchNo);

        return (batchNo);
    }



    function getFabricDetails(address _batchNo)
        public
        returns (
            string memory water,
            string memory electricity,
            string memory toxicWaste
        )
    {
        /* Call Storage Contract */
        (
            water,
            electricity,
            toxicWaste
        ) = supplyChainStorage.getFabricDetails(_batchNo);
        emit FabricBatchNo(
            msg.sender,
            water,
            electricity,
            toxicWaste
        );
        return (water,
            electricity,
            toxicWaste);
    }
}
