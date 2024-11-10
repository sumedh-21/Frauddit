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
    mapping(string => mapping(string => bool)) public fraudReportExists;  // This is the mapping you're using

    uint public reportCount;

    event ReportSubmitted(uint id, address reporter, string fraudType, string description, uint timestamp);

    // Function to check if a report with the same fraudType and description already exists
    function reportExists(string memory _fraudType, string memory _description) public view returns (bool) {
        return fraudReportExists[_fraudType][_description];
    }

    // Function to submit a report after validation
    function submitReport(string memory _fraudType, string memory _description) public {
        // Check if the report already exists
        require(!reportExists(_fraudType, _description), "This report already exists!");

        // Create the new report
        reports[reportCount] = Report(reportCount, msg.sender, _fraudType, _description, block.timestamp);

        // Mark the fraud report as existing
        fraudReportExists[_fraudType][_description] = true;

        // Emit the event for new report
        emit ReportSubmitted(reportCount, msg.sender, _fraudType, _description, block.timestamp);
        reportCount++;
    }

    // Function to get all reports (optional, depending on your needs)
    function getReports() public view returns (Report[] memory) {
        Report[] memory allReports = new Report[](reportCount);

        for (uint i = 0; i < reportCount; i++) {
            allReports[i] = reports[i];
        }

        return allReports;
    }
}
