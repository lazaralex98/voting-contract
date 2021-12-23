import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { ethers } from "ethers";
import votingAbi from "../utils/votingAbi.json";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

declare let window: any;

// TODO clean this up & implement some types/interfaces

export default function Home() {
  const contractAddress: string = "0xEA70184e6337eEe02233Ff8252C0e53AE5380Da2";
  const toastOptions: Object = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const [account, setAccount] = useState("");
  const [allProposals, setAllProposals] = useState([]);
  const [voter, setVoter] = useState({ voted: false, proposed: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      getAllProposals();
    }
  }, []);

  /**
   * @description Attempts to connect to the MetaMask wallet and set the account in React State.
   * @returns true or false depending on success or failure.
   */
  async function connectMetaMaskWallet(): Promise<boolean> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.warn("Make sure you have MetaMask connected");
        toast.warn("Make sure MetaMask is connected.", toastOptions);
        return false;
      }

      setLoading(true);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      console.log("Connected MetaMask: ", accounts[0]);
      getVoter();
      getAllProposals();
      setLoading(false);
      toast("We connected to MetaMask!", toastOptions);
      return true;
    } catch (error) {
      setLoading(false);
      console.error("Error when connecting MetaMask: ", error);
      toast.error(
        "An unexpected error occurred when connecting to MetaMask!",
        toastOptions
      );
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
   * @description Attempts to get the voter object that matches user's address and sets it into React State.
   * @returns true or false depending success or failure.
   */
  async function getVoter(): Promise<any> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.warn("Make sure you have MetaMask connected");
        toast.warn("Make sure MetaMask is connected.", toastOptions);
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        votingAbi.abi,
        signer
      );
      const voter = await votingPortalContract.getVoter({
        gasLimit: 300000,
      });

      const formatedVoter = {
        voted: voter[0],
        proposed: voter[1],
      };

      setVoter(formatedVoter);
      return true;
    } catch (error) {
      console.error("Error when fetching voter:", error);
      toast.error(
        "An unexpected error occurred when fetching voter.",
        toastOptions
      );
      return false;
    }
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
        toast.warn("Make sure MetaMask is connected.", toastOptions);
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        votingAbi.abi,
        signer
      );
      const proposals = await votingPortalContract.getProposals({
        gasLimit: 300000,
      });

      const formatedProposals = formatProposalArray(proposals);

      setAllProposals(formatedProposals);
      return true;
    } catch (error) {
      console.error("Error when fetching proposals:", error);
      toast.error(
        "An unexpected error occurred when fetching proposals.",
        toastOptions
      );
      return false;
    }
  }

  /**
   * @description Attempts to get proposal based on id and returns it as an object
   * @param id the index of the proposal in the proposal array
   * @returns proposal object or false depending success or failure.
   */
  async function getProposal(id: number): Promise<any> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.warn("Make sure you have MetaMask connected");
        toast.warn("Make sure MetaMask is connected.", toastOptions);
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        votingAbi.abi,
        signer
      );
      const proposal = await votingPortalContract.getProposal(id, {
        gasLimit: 300000,
      });

      const formatedProposal = {
        name: proposal[0],
        description: proposal[1],
        voteCount: proposal[2].toNumber(),
      };

      return formatedProposal;
    } catch (error) {
      console.error("Error when fetching proposal with id " + id + ": ", error);
      toast.error(
        "An unexpected error occurred when fetching proposal with id of:" + id,
        toastOptions
      );
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
      setLoading(true);
      const { ethereum } = window;
      if (!ethereum) {
        console.warn("Make sure you have MetaMask connected");
        toast.warn("Make sure MetaMask is connected.", toastOptions);
        setLoading(false);
        return false;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const votingPortalContract = new ethers.Contract(
        contractAddress,
        votingAbi.abi,
        signer
      );

      const voteTxn = await votingPortalContract.voteProposal(id, {
        value: ethers.utils.parseEther("0.001"),
        gasLimit: 300000,
      });
      console.log(
        "Sending vote for id " + id + " with transaction hash:",
        voteTxn.hash
      );

      await voteTxn.wait();

      toast("You voted for " + id, toastOptions);
      console.log("Successfully voted for ", id);

      setLoading(false);
      getAllProposals();
      return true;
    } catch (error) {
      console.error("Error when voting for id " + id + ": ", error);
      toast.error("An unexpected error occurred when voting.", toastOptions);
      setLoading(false);
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
      <Disclosure as="nav" className="bg-white shadow">
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
                        // TODO create a propose() function that will be used here onClick
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
                        <span>Connect MetaMask</span>
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
      {account ? (
        ""
      ) : (
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
                  You can use blockchain technology and ETH to help your
                  favorite content creators decide what to do next.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    {account ? (
                      <button
                        type="button"
                        disabled={true}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 md:py-4 md:text-lg md:px-10"
                      >
                        <span>
                          Your wallet is connected, scroll down to vote
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={connectMetaMaskWallet}
                        type="button"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        <span>Connect MetaMask</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gray-50 overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
                <div className="ml-4 mt-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Video Proposals
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {voter.voted
                      ? "You have already voted."
                      : "To vote click on one of the proposals below."}
                  </p>
                </div>
                <div className="ml-4 mt-4 flex-shrink-0">
                  {account ? (
                    <button
                      // TODO create a propose() function that will be used here onClick
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Propose subject
                    </button>
                  ) : (
                    <button
                      onClick={connectMetaMaskWallet}
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Connect MetaMask
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {allProposals.map((proposal, index) => (
                  <li key={index}>
                    <a
                      onClick={() => {
                        if (account && !voter.voted) {
                          vote(index);
                        }
                      }}
                      className={`block  ${
                        account && !voter.voted
                          ? "hover:bg-gray-50 cursor-pointer"
                          : ""
                      }`}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {proposal.name} - id: {index}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {proposal.voteCount} votes
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {proposal.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Loading modal */}
      <Transition.Root show={loading} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setLoading}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg
                      className="animate-spin h-5 w-5 text-blue-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Loading...
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please wait while we proccess your request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <ToastContainer />

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
