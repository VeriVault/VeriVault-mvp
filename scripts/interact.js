async function main() {
  // Contract addresses from deployment
  const contentRegistryAddress = "YOUR_CONTENT_REGISTRY_ADDRESS";
  const rightsManagerAddress = "YOUR_RIGHTS_MANAGER_ADDRESS";

  // Get contract instances
  const ContentRegistry = await ethers.getContractFactory("ContentRegistry");
  const RightsManager = await ethers.getContractFactory("RightsManager");

  const contentRegistry = await ContentRegistry.attach(contentRegistryAddress);
  const rightsManager = await RightsManager.attach(rightsManagerAddress);

  // Register new content
  const tx1 = await contentRegistry.registerContent(
    "QmYourContentHash",
    "ipfs://yourMetadata"
  );
  await tx1.wait();
  console.log("Content registered");

  // Create license
  const oneDay = 24 * 60 * 60;
  const expiration = Math.floor(Date.now() / 1000) + oneDay;
  const price = ethers.utils.parseEther("0.1");

  const tx2 = await rightsManager.createLicense(
    1, // tokenId
    expiration,
    false, // not exclusive
    price
  );
  await tx2.wait();
  console.log("License created");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
