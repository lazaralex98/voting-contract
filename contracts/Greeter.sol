//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";


contract VotingContract {
  struct Proposal {
    string name;   
    string description;
    uint voteCount; 
  }

  Proposal[] public proposals;

  constructor(string memory _proposal_name, string memory _proposal_description) {
    console.log("Deploying a VotingContract with first proposal:", _proposal_name);
    proposals.push(Proposal(
      _proposal_name,
      _proposal_description,
      0
    ));
  }

  function getProposals() public view returns (Proposal[] memory) {
    console.log("Getting all proposals");
    return proposals;
  }

  function getProposal(uint _index) public view returns (Proposal memory) {
    console.log("Getting proposal with index of: '%s'", _index);
    return proposals[_index];
  }

  function sendProposal(string memory _proposal_name, string memory _proposal_description) public {
    console.log("Proposing video subject: '%s'", _proposal_name);
    proposals.push(Proposal(
      _proposal_name,
      _proposal_description,
      0
    ));
  }

  function voteProposal(uint _index) public {
    console.log("Proposal of index: '%s' has '%s' vote(s). Voting for it.", _index, proposals[_index].voteCount);
    proposals[_index].voteCount += 1;
    console.log("Vote cast! Now proposal of index: '%s' has '%s' vote(s).", _index, proposals[_index].voteCount);
  }
}
