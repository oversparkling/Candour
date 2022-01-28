pragma solidity ^0.8.11;

contract IntermediateStage{
    
    event CottonHarvested(address indexed user, address indexed batchNo);
    event FabricManufactured(address indexed user, address indexed batchNo);
    event ShirtManufactured(address indexed user, address indexed batchNo);


    string public companyName;
    string public personInCharge;
    uint public dateTime;
    uint public batchNo;

    // constructor(string memory _companyName , string memory _personInCharge) {
    //     companyName = _companyName;
    //     personInCharge = _personInCharge;
    //     dateTime = block.timestamp;
    // }

    constructor() {
        companyName = "Test";
        personInCharge = "Test";
        dateTime = block.timestamp;
    }

    function updateCompanyName(string memory _companyName) public {
        companyName = _companyName;
    }


    


}