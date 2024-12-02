// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ContentRegistry.sol";

contract RightsManager {
    struct License {
        uint256 contentId;
        uint256 expiration;
        bool isExclusive;
        uint256 price;
    }

    ContentRegistry public contentRegistry;
    mapping(uint256 => License) public licenses;
    mapping(uint256 => mapping(address => bool)) public activeLicenses;

    event LicenseCreated(uint256 contentId, uint256 expiration, uint256 price);
    event LicensePurchased(uint256 contentId, address licensee);

    constructor(address _contentRegistry) {
        contentRegistry = ContentRegistry(_contentRegistry);
    }

    function createLicense(
        uint256 contentId,
        uint256 expiration,
        bool exclusive,
        uint256 price
    ) public {
        require(contentRegistry.ownerOf(contentId) == msg.sender, "Not content owner");

        licenses[contentId] = License(
            contentId,
            expiration,
            exclusive,
            price
        );

        emit LicenseCreated(contentId, expiration, price);
    }

    function purchaseLicense(uint256 contentId) public payable {
        License memory license = licenses[contentId];
        require(license.expiration > block.timestamp, "License expired");
        require(msg.value >= license.price, "Insufficient payment");

        if(license.isExclusive) {
            require(!hasActiveLicenses(contentId), "Exclusive license already sold");
        }

        activeLicenses[contentId][msg.sender] = true;
        payable(contentRegistry.ownerOf(contentId)).transfer(msg.value);

        emit LicensePurchased(contentId, msg.sender);
    }

    function hasActiveLicenses(uint256 contentId) public view returns (bool) {
        License memory license = licenses[contentId];
        if(block.timestamp > license.expiration) {
            return false;
        }
        return true;
    }
}
