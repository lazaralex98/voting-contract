import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import votingAbi from "../utils/votingAbi.json";
import { Fragment } from "react";
import { Popover, Disclosure, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
        console.warn("Make sure you have MetaMask connected");
        return false;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      return true;
    } catch (error) {
      console.error("Error: ", error);
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
        console.warn("Make sure you have MetaMask connected");
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        votingAbi.abi,
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
   * @requires user to pay 0.001 ETH
   * @param id the index of the proposal in the proposal array
   * @returns true or false depending on success or failure.
   */
  async function vote(id: number): Promise<boolean> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.warn("Make sure you have MetaMask connected");
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        votingAbi.abi,
        signer
      );

      const voteTxn = await votingPortalContract.voteProposal(
        id,
        ethers.utils.parseEther("0.001"),
        {
          gasLimit: 300000,
        }
      );
      console.log("Mining...", voteTxn.hash);
      console.log("Sending vote...");

      await voteTxn.wait();

      console.log("Mined -- ", voteTxn.hash);
      console.log("Voted for ", id);

      getAllProposals();
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  return (
    <div>
      <Head>
        <title>Propose &amp; vote for YT videos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <Disclosure as="nav" className="bg-white shadow sticky top-0 z-10">
        {({ open }) => (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    Alex Lazar
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <a
                      href="#"
                      className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Proposal Board
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {account ? (
                      <button
                        onClick={connectMetaMaskWallet}
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span>Propose subject</span>
                      </button>
                    ) : (
                      <button
                        onClick={connectMetaMaskWallet}
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span>Connect wallet</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {/* Current: "bg-blue-50 border-blue-500 text-blue-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
                >
                  Proposal Board
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* Hero section */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  Propose &amp; vote subjects
                </span>{" "}
                <span className="block text-blue-600 xl:inline">
                  for your favorite content creators
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                You can use blockchain technology and ETH to help your favorite
                content creators decide what to do next.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  {account ? (
                    <button
                      type="button"
                      disabled={true}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 md:py-4 md:text-lg md:px-10"
                    >
                      <span>Your wallet is connected, scroll down to vote</span>
                    </button>
                  ) : (
                    <button
                      onClick={connectMetaMaskWallet}
                      type="button"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      <span>Connect wallet</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main
        id="main"
        className="flex flex-col items-center justify-center w-full flex-1 px-12 sm:px-24 md:px-28 lg:px-32 xl:px-64"
      >
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
