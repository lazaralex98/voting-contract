const { expect } = require("chai");

describe("Voting", function () {
  it("Should return the proposal with 1 vote after voting", async function () {
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy(
      "Web3 Vlog",
      "You should make a vlog of you learning web3."
    );

    await votingContract.deployed();

    const proposalBeforeVote = await votingContract.getProposal(0);
    expect(proposalBeforeVote).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 0,
    });

    await votingContract.voteProposal(0);
    const proposalAfterVote = await votingContract.getProposal(0);
    expect(proposalAfterVote).to.eql({
      name: "Web3 Vlog",
      description: "You should make a vlog of you learning web3.",
      voteCount: 1,
    });
  });
});

describe("Proposal", function () {
  it("Should return the new list of proposals after submitting one", async function () {
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy(
      "Web3 Vlog",
      "You should make a vlog of you learning web3."
    );

    await votingContract.deployed();

    const allProposalsBeforeProposal = await votingContract.getProposals();
    expect(allProposalsBeforeProposal).to.eql([
      {
        name: "Web3 Vlog",
        description: "You should make a vlog of you learning web3.",
        voteCount: 0,
      },
    ]);

    await votingContract.setProposal(
      "Landing Page Reviews",
      "We want more landing page reviews."
    );

    // why is the response an array of arrays instead of being an array of objects?
    // aren't structs supposed to be like objects?
    const allProposalsAfterProposal = await votingContract.getProposals();
    expect(allProposalsAfterProposal).to.eql([
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
