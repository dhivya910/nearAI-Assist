import React, { useState, useEffect } from "react";
import logo from "../public/logo.webp";
import Layout from "../components/Layout";
import { Providers } from "../Providers";
import Chat from "../components/Chat";
import processAccount from "../utils/processAccount";
import processTx from "../utils/processTx";
import WorldCoinConnect from "../components/WorldCoin";

async function parseUrlToJson(
  url: string
): Promise<{ type: string; value: any }> {
  try {
    const regex =
      /https:\/\/beryx.io\/search\/fil\/mainnet\/(address|txs)\/([^?]+)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
      const type = match[1];
      const value = match[2];

      if (type === "txs") {
        const data = await processTx(value);
        return {
          type: "tx",
          value: data,
        };
      } else {
        const data = await processAccount(value);
        return {
          type: "address",
          value: data,
        };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      type: "error",
      value: error,
    };
  }

  return {
    type: "error",
    value: "Invalid URL",
  };
}

export default function ContentApp() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [chatActive, setChatActive] = useState(false);
  const [currentData, setCurrentData] = useState<any>({});

  // Function to initialize the chat
  async function initSmith() {
    const url = window.location.href;
    const currentItem = await parseUrlToJson(url);
    setCurrentData(currentItem);
    setChatActive(true);
  }

  // Function to go back to the initial view (when X button is clicked)
  const handleBack = () => {
    setChatActive(false);
  };

  // If the dialog is closed, show the button to open it
  if (!isDialogOpen) {
    return (
      <div className="mx-auto p-6">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-white rounded-md p-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Call NearYou <span aria-hidden="true">+</span>
        </button>
      </div>
    );
  }

  return (
    <Providers>
      <div className="fixed bottom-0 right-0 mb-4 mr-4 max-w-sm w-full">
        <Layout>
          {!chatActive ? (
            <div className="relative isolate overflow-hidden border border-white bg-teal-900 px-4 py-4 shadow-2xl rounded-xl">
              <div className="mx-auto max-w-md text-center">
                <div className="flex items-center justify-center space-x-4 my-4 mx-auto">
                  <img
                    alt="logo"
                    src="https://nearblocks.io/images/nearblocksblack.svg"
                    className="relative inline-block w-30 h-30 rounded-xl"
                  />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white my-4">
                  Chat with NearYou, your AI assistant
                </h2>
                <WorldCoinConnect />
                <button
                  onClick={initSmith}
                  className="ml-2 px-4 py-2 border border-white bg-teal-900 text-white rounded-lg disabled:opacity-50"
                >
                  Call NearYou for this tx/address
                </button>

                <div>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="mt-4 underline hover:no-underline text-sm"
                  >
                    Click to send NearYou away.
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Pass the handleBack function to the Chat component
            <Chat data={currentData} onBack={handleBack} />
          )}
        </Layout>
      </div>
    </Providers>
  );
}
