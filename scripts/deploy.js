const hre = require("hardhat");

async function main() {
  // Deploy ContentRegistry first
  const ContentRegistry = await hre.ethers.getContractFactory("ContentRegistry");
  const contentRegistry = await ContentRegistry.deploy();
  await contentRegistry.deployed();
  console.log("ContentRegistry deployed to:", contentRegistry.address);

  // Deploy RightsManager with ContentRegistry address
  const RightsManager = await hre.ethers.getContractFactory("RightsManager");
  const rightsManager = await RightsManager.deploy(contentRegistry.address);
  await rightsManager.deployed();
  console.log("RightsManager deployed to:", rightsManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
