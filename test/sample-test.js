const { expect } = require("chai");
const { utils } = require("web3");

describe("Voting", function () {
  it("Should return the proposal with 1 vote after voting", async function () {
    // deploy the contract
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy(
      "Web3 Vlog",
      "You should make a vlog of you learning web3."
    );
    await votingContract.deployed();

    // test initial proposal
    let proposal = await votingContract.getProposal(0);
    let proposalFormated = {
      name: proposal[0],
      description: proposal[1],
      voteCount: proposal[2].toNumber(),
    };
    expect(proposalFormated).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 1,
    });

    // vote for initial proposal & test it
    await votingContract.voteProposal(0, ethers.utils.parseEther("0.001"), {
      gasLimit: 300000,
    });
    proposal = await votingContract.getProposal(0);
    proposalFormated = {
      name: proposalAfterVote[0],
      description: proposalAfterVote[1],
      voteCount: proposalAfterVote[2].toNumber(),
    };
    expect(proposalFormated).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 2,
    });
  });
});

// describe("Proposal", function () {
//   it("Should return the new list of proposals after submitting one", async function () {
//     // deploy the contract
//     const VotingContract = await ethers.getContractFactory("VotingContract");
//     const votingContract = await VotingContract.deploy(
//       "Web3 Vlog",
//       "You should make a vlog of you learning web3."
//     );
//     await votingContract.deployed();

//     // get an array of all proposals and convert it from an array of arrays to an array of objects, then test it
//     const allProposalsBeforeProposal = await votingContract.getProposals();
//     const allProposalsBeforeProposalCleaned = allProposalsBeforeProposal.map(
//       (proposal) => {
//         return {
//           name: proposal[0],
//           description: proposal[1],
//           voteCount: proposal[2].toNumber(),
//         };
//       }
//     );
//     expect(allProposalsBeforeProposalCleaned).to.eql([
//       {
//         name: "Web3 Vlog",
//         description: "You should make a vlog of you learning web3.",
//         voteCount: 0,
//       },
//     ]);

//     // send a new proposal
//     await votingContract.sendProposal(
//       "Landing Page Reviews",
//       "We want more landing page reviews.",
//       ethers.utils.parseEther("0.002"),
//       {
//         gasLimit: 300000,
//       }
//     );

//     // get an array of all proposals and convert it from an array of arrays to an array of objects, then test it
//     const allProposalsAfterProposal = await votingContract.getProposals();
//     const allProposalsAfterProposalCleaned = allProposalsAfterProposal.map(
//       (proposal) => {
//         return {
//           name: proposal[0],
//           description: proposal[1],
//           voteCount: proposal[2].toNumber(),
//         };
//       }
//     );
//     expect(allProposalsAfterProposalCleaned).to.eql([
//       {
//         name: "Web3 Vlog",
//         description: "You should make a vlog of you learning web3.",
//         voteCount: 0,
//       },
//       {
//         name: "Landing Page Reviews",
//         description: "We want more landing page reviews.",
//         voteCount: 0,
//       },
//     ]);
//   });
// });
