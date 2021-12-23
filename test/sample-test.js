const { expect } = require("chai");
const { utils } = require("web3");

describe("Voting", function () {
  it("Should return the proposal with 2 votes after voting", async function () {
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
    await votingContract.voteProposal(0, {
      gasLimit: 300000,
    });
    proposal = await votingContract.getProposal(0);
    proposalFormated = {
      name: proposal[0],
      description: proposal[1],
      voteCount: proposal[2].toNumber(),
    };
    expect(proposalFormated).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 2,
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
    let allProposals = await votingContract.getProposals();
    let allProposalsFormated = allProposals.map((proposal) => {
      return {
        name: proposal[0],
        description: proposal[1],
        voteCount: proposal[2].toNumber(),
      };
    });
    expect(allProposalsFormated).to.eql([
      {
        name: "Web3 Vlog",
        description: "You should make a vlog of you learning web3.",
        voteCount: 1,
      },
    ]);

    // send a new proposal
    await votingContract.sendProposal(
      "Landing Page Reviews",
      "We want more landing page reviews.",
      {
        gasLimit: 300000,
      }
    );

    // get an array of all proposals and convert it from an array of arrays to an array of objects, then test it
    allProposals = await votingContract.getProposals();
    allProposalsFormated = allProposals.map((proposal) => {
      return {
        name: proposal[0],
        description: proposal[1],
        voteCount: proposal[2].toNumber(),
      };
    });
    expect(allProposalsFormated).to.eql([
      {
        name: "Web3 Vlog",
        description: "You should make a vlog of you learning web3.",
        voteCount: 1,
      },
      {
        name: "Landing Page Reviews",
        description: "We want more landing page reviews.",
        voteCount: 1,
      },
    ]);
  });
});
