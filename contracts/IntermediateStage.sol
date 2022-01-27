pragma solidity ^0.8.11;

contract IntermediateStage{
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
}