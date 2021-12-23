export interface formatedProposal {
  name: string;
  description: string;
  voteCount: number;
}

export interface voter {
  voted: boolean;
  proposed: boolean;
}

export interface proposalInput {
  name: string;
  description: string;
}
