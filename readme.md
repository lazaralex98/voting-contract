# Voting & proposal contract

It started off with me playing around trying to understand the basics of solidity and how to connect it to a contract from the frontend.

But now it has evolved into a small dApp where you can:

1. Make proposals for me to make YT videos
2. Vote on existent proposals

## Seeing it live

To see the project live you can access it [here](http://voting-contract.vercel.app/).

You will need:

- a MetaMask wallet
- 0,0049 ETH on the Rinkeby Network

## How I have build it and issues I've encountered

To build it I used the docs from Solidity, Hardhat & Ethers.js as these were the main web3 technologies I have used in building the dApp. I have also used Alchemy for the ethereum node.

I had a hard time figuring out how to create ETH transfers in Solidity.

I saw people use `uint256 _payAmount` based solution where the payamount would be passed as a parameter of the Solidity method. For some reason, that didn't work for me and I decided to use a `msg.value` based solution where, in the client, you would pass the pay amount as an option the same as you would pass the `gasLimit` option.

That worked very well, altough I had a short episode there where I didn't realise I have to redeploy the contract **AND** re-copy the ABI to my client's utils folder. (You will find some funny commit messages in there at the point where this was happening :)) ).

I had someone more experienced than me peer review my code and they noticed I hadn't implement a check for the network. So, I made sure that the app would let you know if you aren't on Rinkeby.

In terms of web2 tech, I have used:

- Typescript because it makes debugging easier and I feel makes code cleaner
- TailwindCSS & TailwindUI to save time on designing and building the UI
- Next.js just because I love it, altough I haven't used any of its features as this was a fairly small application
- Toastify to save time on creating notifications

## What I would like to add to it

- a few more tests
- split app in components
- use more next.js features
