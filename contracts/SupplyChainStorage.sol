pragma solidity ^0.8.11;

contract SupplyChainStorage {
    struct cottonHarvester {
        string fertiliser;
        string water;
        string deforestation;
        string biowaste;
    }

    struct fabricManufacturer {
        string water;
        string electricity;
        string toxicWaste;
    }

    struct shirtManufacturer {
        string manufacturerName;
        string personInCharge;
    }
    address[] public batchNoArray;
    //SuppyChain contract should contain these
    cottonHarvester cottonHarvesterData;
    fabricManufacturer fabricManufacturerData;
    shirtManufacturer shirtManufacturerData;

    mapping(address => cottonHarvester) batchCottonHarvester;
    mapping(address => fabricManufacturer) batchFabricManufacturer;
    mapping(address => shirtManufacturer) batchShirtManufacturer;

    //batchNo is only generated during this function, will be same in the
    //rest of the structs
    function setCottonHarvester(
        string memory _fertiliser,
        string memory _water,
        string memory _deforestation,
        string memory _biowaste
    ) public returns (address) {
        //Generates a batchNo based on the senders address and the
        //time of the transaction
        // uint tmpData = uint(keccak256(msg.sender, block.timestamp));
        // address batchNo = address(tmpData);

        address batchNo = address(
            bytes20(sha256(abi.encodePacked(msg.sender, block.timestamp)))
        );

        //Setting the basicDetails of the entity
        cottonHarvesterData.fertiliser = _fertiliser;
        cottonHarvesterData.water = _water;
        cottonHarvesterData.deforestation = _deforestation;
        cottonHarvesterData.biowaste = _biowaste;
        batchCottonHarvester[batchNo] = cottonHarvesterData;
        batchNoArray.push(batchNo);
        return batchNo;
    }

    function getAllDetails(address batchNo) public returns (
        string memory _fertiliser,
        string memory _water,
        string memory _deforestation,
        string memory _biowaste,
        string memory water1,
        string memory electricity1,
        string memory toxicWaste1
    ){
        cottonHarvester memory tmpData = batchCottonHarvester[batchNo];
        fabricManufacturer memory tmpData1 = batchFabricManufacturer[batchNo];
        
    }

    //Requires the batchNo which is the identifer for the individual structs
    function getCottonHarvester(address _batchNo)
        public
        view
        returns (
            string memory fertiliser,
            string memory water,
            string memory deforestation,
            string memory biowaste
        )
    {
        cottonHarvester memory tmpData = batchCottonHarvester[_batchNo];

        return (
            tmpData.fertiliser,
            tmpData.water,
            tmpData.deforestation,
            tmpData.biowaste
        );
    }

    function getAllCottonHarvester()
        public
        view
        returns (cottonHarvester[] memory result)
    {
        uint256 length = batchNoArray.length;
        cottonHarvester[] memory cottonHarvesterArray = new cottonHarvester[](length);
        for (uint256 i = 0; i < batchNoArray.length; i++) {
            cottonHarvester memory basicDetail = batchCottonHarvester[
                batchNoArray[i]
            ];
            cottonHarvesterArray[i] = basicDetail;
        }
        return cottonHarvesterArray;
    }

    //Requires the batchNo which is the identifer for the individual structs
    function getFabricDetails(address _batchNo)
        public
        view
        returns (
            string memory water,
            string memory electricity,
            string memory toxicWaste
        )
    {
        fabricManufacturer memory tmpData = batchFabricManufacturer[_batchNo];

        return (
            tmpData.water,
            tmpData.electricity,
            tmpData.toxicWaste
        );
    }

    //Requires the batchNo which is the identifer for the individual structs
    function setFabricDetails(
        address batchNo,
        string memory water,
        string memory electricity,
        string memory toxicWaste
    ) public returns (address) {
        fabricManufacturerData.water = water;
        fabricManufacturerData.electricity = electricity;
        fabricManufacturerData.toxicWaste = toxicWaste;
        batchFabricManufacturer[batchNo] = fabricManufacturerData;
    }
}
