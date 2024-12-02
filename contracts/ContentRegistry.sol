// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentRegistry is ERC721, Ownable {
    struct Content {
        string contentHash;
        string metadataURI;
        address creator;
        uint256 timestamp;
        bool isVerified;
    }

    mapping(uint256 => Content) public contents;
    mapping(uint256 => mapping(address => bool)) private authorizedUsers;
    uint256 private _tokenIds;

    event ContentRegistered(uint256 tokenId, string contentHash, address creator);
    event ContentVerified(uint256 tokenId);
    event AccessGranted(uint256 tokenId, address user);

    constructor() ERC721("ContentAuthToken", "CAT") {}

    function registerContent(string memory contentHash, string memory metadataURI)
        public returns (uint256)
    {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        contents[newTokenId] = Content({
            contentHash: contentHash,
            metadataURI: metadataURI,
            creator: msg.sender,
            timestamp: block.timestamp,
            isVerified: false
        });

        _safeMint(msg.sender, newTokenId);

        emit ContentRegistered(newTokenId, contentHash, msg.sender);
        return newTokenId;
    }

    function verifyContent(uint256 tokenId) public onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        contents[tokenId].isVerified = true;
        emit ContentVerified(tokenId);
    }

    function grantAccess(uint256 tokenId, address user) public {
        require(ownerOf(tokenId) == msg.sender, "Not the content owner");
        authorizedUsers[tokenId][user] = true;
        emit AccessGranted(tokenId, user);
    }

    function hasAccess(uint256 tokenId, address user) public view returns (bool) {
        return authorizedUsers[tokenId][user] || ownerOf(tokenId) == user;
    }

    function getContent(uint256 tokenId) public view returns (Content memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return contents[tokenId];
    }
}
