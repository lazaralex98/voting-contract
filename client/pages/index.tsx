import Head from "next/head";
import Link from "next/link";

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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Propose &amp; vote for YT videos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-64">
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
          <h2 className="text-red-500 text-2xl font-extrabold mb-4">
            All current proposals
          </h2>
          <ul className="text-gray-800">
            {currentProposals.map(({ name, description, voteCount }) => (
              <li className="mb-8">
                <p className="text-xl mb-2">
                  "{name}" with{" "}
                  <mark className="bg-yellow-300 px-1">{voteCount} votes</mark>.{" "}
                  <button
                    className="inline-block px-2 bg-blue-100 rounded-sm text-blue-600 transition-colors hover:bg-blue-50"
                    onClick={console.log("click")}
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
