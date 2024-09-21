"use client";

import React, { useEffect, useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import axios from "axios";

export default function WorldCoinConnect() {
  const [worldcoinVerified, setWorldcoinVerified] = useState(false);
  const [worldcoinId, setWorldcoinId] = useState<any>(null);

  const handleVerify = async (proof: any) => {
    // console.log(proof);
    const response = await fetch("http://localhost:4000/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof }),
    });
    if (!response.ok) {
      throw new Error(`Error verifying Worldcoin: ${response.statusText}`);
    }

    const data = await response.json();
    setWorldcoinVerified(data.verified);
  };

  const handleSign = async (message: string) => {
    console.log("Success");
    // Fund the user's wallet
  };

  const onSuccess = async (proof: any) => {
    await handleSign(proof.nullifier_hash);
    setWorldcoinId(proof);
  };

  return (
    <>
      {!worldcoinId ? (
        <IDKitWidget
          app_id="app_a43db934cac4a4d3391e9c768d358951" // obtained from the Developer Portal
          action="verify-human" // this is your action id from the Developer Portal
          onSuccess={onSuccess} // callback when the modal is closed
          handleVerify={handleVerify} // optional callback when the proof is received
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => (
            <div
              className="font-bold text-center text-lg pt-1 text-white cursor-pointer"
              onClick={open}
            >
              World ID Login
            </div>
          )}
        </IDKitWidget>
      ) : (
        <div className="text-center mt-1 mr-1">
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Worldcoin ✅{" "}
          </span>
        </div>
      )}
    </>
  );
}
