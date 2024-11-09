// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudReport {
    struct Report {
        uint id;
        address reporter;
        string fraudType;
        string description;
        uint timestamp;
    }

    mapping(uint => Report) public reports;
    uint public reportCount;

    event ReportSubmitted(uint id, address reporter, string fraudType, string description, uint timestamp);

    function submitReport(string memory _fraudType, string memory _description) public {
        reports[reportCount] = Report(reportCount, msg.sender, _fraudType, _description, block.timestamp);
        emit ReportSubmitted(reportCount, msg.sender, _fraudType, _description, block.timestamp);
        reportCount++;
    }
}
