//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract VotingContract {
  // TODO should be required to pay to vote/propose
  address payable public owner;

  // events make it easier to track what happened on the blockchain even though that info is public
  event NewProposalOrVote(address indexed from, uint256 timestamp, string name);

  struct Proposal {
    string name; // short name for the proposal
    string description; // description of the proposal
    uint256 voteCount; // the amount of votes that the proposal has
  }

  struct Voter {
    bool voted; // wether the address has voted or not
    bool proposed; // wether the address has proposed or not
  }

  // an array the contains all current proposals
  Proposal[] public proposals;

  // each address gets a Voter struct
  mapping(address => Voter) public voters;

  // TODO make it such that on deployment you can change proposa/vote prices

  // on deployment we create an initial proposal and set prices
  constructor(string memory _proposal_name, string memory _proposal_description)
  {
    owner = payable(msg.sender);

    proposals.push(Proposal(_proposal_name, _proposal_description, 0));
  }

  // returns an array with all current Proposal structs
  // hint for the frontend: the Proposal structs will be non-associative arrays that you need to convert to objects
  function getProposals() public view returns (Proposal[] memory) {
    return proposals;
  }

  // returns a Proposal based on its index in the proposals array
  function getProposal(uint256 _index) public view returns (Proposal memory) {
    return proposals[_index];
  }

  // checks if address has proposed yet and if enough funds and then add his new Proposal to the proposals array
  function sendProposal(
    string memory _proposal_name,
    string memory _proposal_description,
    uint256 _payAmount
  ) public payable {
    Voter storage sender = voters[msg.sender];
    require(!sender.proposed, "You already proposed.");

    require(_payAmount <= 0.002 ether, "Insufficient Ether provided");

    (bool success, ) = owner.call{ value: _payAmount }("");
    require(success, "Failed to send money");

    proposals.push(Proposal(_proposal_name, _proposal_description, 0));
    sender.proposed = true;

    emit NewProposalOrVote(msg.sender, block.timestamp, "proposal");
  }

  // check if address has voted and if enough funds and vote for a Proposal based on its index in the proposals array
  function voteProposal(uint256 _index, uint256 _payAmount) public payable {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "You already voted.");

    require(_payAmount <= 0.001 ether, "Insufficient Ether provided");

    (bool success, ) = owner.call{ value: _payAmount }("");
    require(success, "Failed to send money");

    proposals[_index].voteCount += 1;
    sender.voted = true;

    emit NewProposalOrVote(msg.sender, block.timestamp, "vote");
  }
}