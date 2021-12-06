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
    const proposalBeforeVote = await votingContract.getProposal(0);
    const proposalObjBeforeVote = {
      name: proposalBeforeVote[0],
      description: proposalBeforeVote[1],
      voteCount: proposalBeforeVote[2].toNumber(),
    };
    expect(proposalObjBeforeVote).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 0,
    });

    // vote for initial proposal & test it
    votingContract.voteProposal(0);
    const proposalAfterVote = await votingContract.getProposal(0);
    const proposalObjAfterVote = {
      name: proposalAfterVote[0],
      description: proposalAfterVote[1],
      voteCount: proposalAfterVote[2].toNumber(),
    };
    expect(proposalObjAfterVote).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 1,
    });
  });
});

describe("Proposal", function () {
  it("Should return the new list of proposals after submitting one", async function () {
    // deploy the contract
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy(
      "Web3 Vlog",
      "You should make a vlog of you learning web3."
    );
    await votingContract.deployed();

    // get an array of all proposals and convert it from an array of arrays to an array of objects, then test it
    const allProposalsBeforeProposal = await votingContract.getProposals();
    const allProposalsBeforeProposalCleaned = allProposalsBeforeProposal.map(
      (proposal) => {
        return {
          name: proposal[0],
          description: proposal[1],
          voteCount: proposal[2].toNumber(),
        };
      }
    );
    expect(allProposalsBeforeProposalCleaned).to.eql([
      {
        name: "Web3 Vlog",
        description: "You should make a vlog of you learning web3.",
        voteCount: 0,
      },
    ]);

    // send a new proposal
    await votingContract.sendProposal(
      "Landing Page Reviews",
      "We want more landing page reviews."
    );

    // why is the response an array of arrays instead of being an array of objects?
    // aren't structs supposed to be like objects?
    const allProposalsAfterProposal = await votingContract.getProposals();
    const allProposalsAfterProposalCleaned = allProposalsAfterProposal.map(
      (proposal) => {
        return {
          name: proposal[0],
          description: proposal[1],
          voteCount: proposal[2].toNumber(),
        };
      }
    );
    expect(allProposalsAfterProposalCleaned).to.eql([
      {
        name: "Web3 Vlog",
        description: "You should make a vlog of you learning web3.",
        voteCount: 0,
      },
      {
        name: "Landing Page Reviews",
        description: "We want more landing page reviews.",
        voteCount: 0,
      },
    ]);
  });
});
