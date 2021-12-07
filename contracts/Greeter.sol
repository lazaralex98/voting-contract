//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";


contract VotingContract {
  // TODO should be required to pay to vote/propose

  struct Proposal {
    string name; // short name for the proposal
    string description; // description of the proposal
    uint voteCount; // the amount of votes that the proposal has
  }

  struct Voter {
    bool voted; // wether the address has voted or not
    bool proposed; // wether the address has proposed or not
  }

  // an array the contains all current proposals
  Proposal[] public proposals;

  // each address gets a Voter struct
  mapping(address => Voter) public voters;

  // on deployment we create an initial proposal
  constructor(string memory _proposal_name, string memory _proposal_description) {
    proposals.push(Proposal(
      _proposal_name,
      _proposal_description,
      0
    ));
  }

  // returns an array with all current Proposal structs 
  // hint for the frontend: the Proposal structs will be non-associative arrays that you need to convert to objects
  function getProposals() public view returns (Proposal[] memory) {
    return proposals;
  }

  // returns a Proposal based on its index in the proposals array
  function getProposal(uint _index) public view returns (Proposal memory) {
    return proposals[_index];
  }

  // checks if address has proposed yet and then add his new Proposal to the proposals array
  function sendProposal(string memory _proposal_name, string memory _proposal_description) public {
    Voter storage sender = voters[msg.sender];
    require(!sender.proposed, "You already proposed.");
    
    proposals.push(Proposal(
      _proposal_name,
      _proposal_description,
      0
    ));
    sender.proposed = true;
  }

  // check if address has voted and vote for a Proposal based on its index in the proposals array
  function voteProposal(uint _index) public {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "You already voted.");

    proposals[_index].voteCount += 1;
    sender.voted = true;
  }
}
