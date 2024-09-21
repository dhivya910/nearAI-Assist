import React, { useState, useEffect } from "react";
import logo from "../public/logo.webp";
import Layout from "./components/Layout";
import { Providers } from "./Providers";
import Chat from "./components/Chat";
import processAccount from "./utils/processAccount";
import processTx from "./utils/processTx";
import WorldCoinConnect from "./components/WorldCoin";

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
  const [isdialogOpen, setIsDialogOpen] = useState(true);
  const [chatActive, setChatActive] = useState(false);
  const [currentData, setCurrentData] = useState<any>({});

  async function initSmith() {
    const url = window.location.href;
    const currentItem = await parseUrlToJson(url);
    // alert("NearYou is ready to help you!");

    setCurrentData(currentItem);
    setChatActive(true);
  }

  if (!isdialogOpen) {
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
          <div
            className="relative isolate overflow-hidden border border-white bg-teal-900 px-4 py-4 shadow-2xl rounded-xl"
            // style={{ marginBottom: "-90px" }}
          >
            <div className="mx-auto max-w-md text-center">
              <div className="flex items-center justify-start space-x-4 my-4 mx-auto">
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
              {/* <p className="mt-2 text-sm leading-6 text-gray-300">
                NearYou is a conversational AI assistant that helps you with
                your crypto explorations. You can ask NearYou about the tx /
                address.
              </p> */}
              {!chatActive ? (
                <button
                  onClick={initSmith}
                  className="bg-zinc-100 py-1 px-2 rounded-lg text-zinc-800 text-sm hover:bg-zinc-200 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mt-2 font-bold"
                >
                  Call NearYou for this tx/address
                </button>
              ) : (
                <Chat data={currentData} />
              )}

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
        </Layout>
      </div>
    </Providers>
  );
}
