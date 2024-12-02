require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
    },
    // Add your network configuration here
    goerli: {
      url: `https://goerli.infura.io/v3/YOUR-PROJECT-ID`,
      accounts: [`YOUR-PRIVATE-KEY`]
    }
  }
};
