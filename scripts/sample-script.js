const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(
    "Web3 Vlog!",
    "It would really fun to watch a video of you learning web3."
  );

  await votingContract.deployed();

  console.log("VotingContract deployed to:", votingContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
