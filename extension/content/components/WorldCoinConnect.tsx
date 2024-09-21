import React, { useEffect, useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import axios from "axios";

type IDKitWidgetProps = {
  open: () => void;
};

export default function WorldCoinConnect() {
  const [worldcoinVerified, setWorldcoinVerified] = useState(false);
  const [worldcoinId, setWorldcoinId] = useState<any>(null);

  const [preparingAccount, setPreparingAccount] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);

  useEffect(() => {
    const signature = localStorage.getItem("worldcoinSignature");
    if (signature) {
      setWorldcoinVerified(true);
      const worldcoinSignature = JSON.parse(signature);
      setWorldcoinId({
        nullifier_hash: worldcoinSignature.message,
      });
      console.log("Loaded worldcoin");
    }
  }, []);

  const handleVerify = async (proof: any) => {
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
    setPreparingAccount(true);
    const response = await fetch("/api/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`Error signing Worldcoin: ${response.statusText}`);
    }

    const signedMessage = await response.json();

    // Store the signed message in the localStorage
    localStorage.setItem(
      "worldcoinSignature",
      JSON.stringify({
        message,
        signature: signedMessage,
      })
    );
  };

  const onSuccess = async (proof: any) => {
    await handleSign(proof.nullifier_hash);
    setWorldcoinId(proof);
  };

  return (
    <>
      {!worldcoinId ? (
        <IDKitWidget
          app_id="app_572e528a8f224be7fcc7e1ec62d026d5"
          action="verify-human"
          onSuccess={onSuccess}
          handleVerify={handleVerify}
          verification_level={VerificationLevel.Device}
        >
          {({ open }: IDKitWidgetProps) => (
            <div
              className="font-bold text-lg pt-1 text-white-600 cursor-pointer"
              onClick={open}
            >
              World ID Login
            </div>
          )}
        </IDKitWidget>
      ) : (
        <div className="text-right mt-1 mr-1">
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Worldcoin ✅{" "}
            {worldcoinVerified &&
              preparingAccount &&
              "Creating Account using ApeCoin..."}
          </span>
        </div>
      )}
    </>
  );
}
