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
    expect(proposalBeforeVote).to.be.include(
      "Web3 Vlog",
      "You should make a vlog of you learning web3.",
      { _hex: ethers.utils.hexlify(0), _isBigNumber: true }
    );

    await votingContract.voteProposal(0);
    const proposalAfterVote = await votingContract.getProposal(0);
    expect(proposalAfterVote).to.be.include(
      "Web3 Vlog",
      "You should make a vlog of you learning web3.",
      { _hex: ethers.utils.hexlify(1), _isBigNumber: true }
    );
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
      [
        "Web3 Vlog",
        "You should make a vlog of you learning web3.",
        { _hex: ethers.utils.hexlify(0), _isBigNumber: true },
      ],
    ]);

    await votingContract.setProposal(
      "Landing Page Reviews",
      "We want more landing page reviews."
    );

    // why is the response an array of arrays instead of being an array of objects?
    // aren't structs supposed to be like objects?
    const allProposalsAfterProposal = await votingContract.getProposals();
    expect(allProposalsAfterProposal).to.eql([
      [
        "Web3 Vlog",
        "You should make a vlog of you learning web3.",
        { _hex: ethers.utils.hexlify(0), _isBigNumber: true },
      ],
      [
        "Landing Page Reviews",
        "We want more landing page reviews.",
        { _hex: ethers.utils.hexlify(0), _isBigNumber: true },
      ],
    ]);
  });
});
