const CheckUniswapNFT = artifacts.require("CheckUniswapNFT");

module.exports = function (deployer, network, accounts) {
  const userAddress = accounts[3];
  deployer.deploy(CheckUniswapNFT, userAddress)
};
