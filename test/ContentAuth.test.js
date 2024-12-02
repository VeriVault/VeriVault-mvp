const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Content Authentication System", function () {
  let ContentRegistry;
  let RightsManager;
  let contentRegistry;
  let rightsManager;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy ContentRegistry
    ContentRegistry = await ethers.getContractFactory("ContentRegistry");
    contentRegistry = await ContentRegistry.deploy();
    await contentRegistry.deployed();

    // Deploy RightsManager with ContentRegistry address
    RightsManager = await ethers.getContractFactory("RightsManager");
    rightsManager = await RightsManager.deploy(contentRegistry.address);
    await rightsManager.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct ContentRegistry address", async function () {
      expect(await rightsManager.contentRegistry()).to.equal(contentRegistry.address);
    });
  });

  describe("Content Registration", function () {
    it("Should register new content", async function () {
      const contentHash = "QmTest123";
      const metadataURI = "ipfs://metadata123";

      await contentRegistry.registerContent(contentHash, metadataURI);
      const tokenId = 1;

      const content = await contentRegistry.contents(tokenId);
      expect(content.contentHash).to.equal(contentHash);
      expect(content.creator).to.equal(owner.address);
    });
  });

  describe("License Management", function () {
    it("Should create and purchase license", async function () {
      // First register content
      await contentRegistry.registerContent("QmTest123", "ipfs://metadata123");
      const tokenId = 1;

      // Create license
      const oneDay = 24 * 60 * 60;
      const expiration = Math.floor(Date.now() / 1000) + oneDay;
      const price = ethers.utils.parseEther("0.1");

      await rightsManager.createLicense(tokenId, expiration, false, price);

      // Purchase license
      await rightsManager.connect(addr1).purchaseLicense(tokenId, {
        value: price
      });

      expect(await rightsManager.hasActiveLicenses(tokenId)).to.equal(true);
    });
  });
});
