import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../utils/votingAbi.json";
declare let window: any;

const currentProposals = [
  {
    name: "Web3 Vlog",
    description: "I'd like you to make videos about web3.",
    voteCount: 3,
  },
  {
    name: "UI Reviews",
    description: "I'd like you to make videos reviewing UIs.",
    voteCount: 1,
  },
];

export default function Home() {
  const contractAddress = "0x2549cE3794183983671F5f6b47eaac847Bfe1685";

  const [account, setAccount] = useState("");
  const [allProposals, setAllProposals] = useState([]);

  /**
   * @description Attempts to connect to the MetaMask wallet and set the account in React State.
   * @returns true or false depending on success or failure.
   */
  async function connectMetaMaskWallet(): Promise<boolean> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask connected");
        return false;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      return true;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  }

  /**
   * @description Formats array of proposals.
   * @param array an array of arrays, each representing a proposal
   * @returns an array of objects that each represent a proposal.
   */
  function formatProposalArray(array: any[][]): Object[] {
    return array.map((proposal) => {
      return {
        name: proposal[0],
        description: proposal[1],
        voteCount: proposal[2].toNumber(),
      };
    });
  }

  /**
   * @description Attempts to get all currrent proposals and set them into React State.
   * @returns true or false depending success or failure.
   */
  async function getAllProposals(): Promise<boolean> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask connected");
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      );
      const proposals = await votingPortalContract.getAllProposals();

      const formatedProposals = formatProposalArray(proposals);

      setAllProposals(formatedProposals);
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  /**
   * @description Attempts to vote a proposal based on the numeric ID (equivalent to the array index)
   * @param id the index of the proposal in the proposal array
   * @returns true or false depending on success or failure.
   */
  async function vote(id: number): Promise<boolean> {
    try {
      console.log("voted for: ", id);
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Propose &amp; vote for YT videos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-12 sm:px-24 md:px-28 lg:px-32 xl:px-64">
        <section className="w-full p-8 my-8 border-2 border-dashed border-gray-400 rounded">
          <h1 className="text-red-500 text-3xl font-extrabold mb-4">
            Propose &amp; vote subjects for your favorite content creators
          </h1>
          <p className="text-gray-800 text-xl">
            My little demonstration of a voting smart contract with a UI that
            interacts with it.
          </p>
        </section>
        <section className="w-full p-8 my-8 border-2 border-dashed border-gray-400 rounded">
          <h2 className="text-red-500 text-2xl font-medium mb-4">
            All current proposals
          </h2>
          <ul className="text-gray-800">
            {currentProposals.map(({ name, description, voteCount }, index) => (
              <li key={index} className="mb-8">
                <p className="text-xl mb-2">
                  "{name}" with{" "}
                  <mark className="bg-yellow-300 px-1">{voteCount} votes</mark>.{" "}
                  <button
                    className="inline-block px-2 bg-blue-100 rounded-sm text-blue-600 transition-colors hover:bg-blue-50"
                    onClick={(event: any) => {
                      vote(index);
                    }}
                  >
                    Vote this
                  </button>
                </p>
                <div className="text-gray-700">{description}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-gray-500">
          Made by{" "}
          <Link href="https://github.com/lazaralex98">
            <a className="text-blue-500 hover:underline">Alex Lazar</a>
          </Link>
        </p>
      </footer>
    </div>
  );
}
