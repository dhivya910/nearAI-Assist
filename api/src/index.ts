import express from "express";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const app = express();

app.use(cors());
app.use(express.json());

// Function to fetch NEAR transaction by its transaction_hash from the NEARBlocks API
async function fetchTransactionById(txHash: string): Promise<any> {
  try {
    // Fetch transaction by transaction_hash (append it to the URL)
    const response = await axios.get(`https://api.nearblocks.io/v1/txns/${txHash}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NEAR transaction by ID", error);
    return undefined;
  }
}

// Route to fetch transaction by transaction_hash
app.post("/transaction", async (req, res) => {
  const { txHash } = req.body;

  if (!txHash) {
    return res.status(400).send("Transaction hash is required");
  }

  const transaction = await fetchTransactionById(txHash);

  if (!transaction) {
    return res.status(500).send("Error fetching transaction");
  }

  res.send(transaction);
});

const verifyProof = async (
  proof: any,
  app_id: string,
  action: string = "verify-human"
) => {
  const response = await fetch(
    `https://developer.worldcoin.org/api/v1/verify/${app_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...proof, action: action}),
    }
  );

  if (response.ok) {
    const verified = await response.json();
    return verified;
  } else {
    const { code, detail } = await response.json();
    throw new Error(`Error Code ${code}: ${detail}`);
  }
};

app.post("/api/verify", async (req, res) => {
  const { proof } = req.body;
 const app_id = "app_a43db934cac4a4d3391e9c768d358951"
  const action = "verify-human"

  try {
    const result = await verifyProof(proof, app_id, action);

    if (result.success) {
      return res.json({ verified: true });
    } else {
      return res.json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({ verified: false, error: "error" });
  }
});

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);

});
// import express from "express";
// import cors from "cors";
// import axios from "axios";

// const PORT = process.env.PORT || 4000;
// const HOSTNAME = process.env.HOSTNAME || "http://localhost";
// const HONO_URL = "http://your-hono-api-url"; // Update this to your actual Hono API URL

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Function to fetch NEAR transaction by its transaction_hash from the NEARBlocks API
// async function fetchTransactionById(txHash: string): Promise<any> {
//   try {
//     // Fetch transaction by transaction_hash (append it to the URL)
//     const response = await axios.get(`https://api.nearblocks.io/v1/txns/${txHash}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching NEAR transaction by ID", error);
//     return undefined;
//   }
// }

// // Route to fetch transaction by transaction_hash and pass to Hono API
// app.post("/transaction", async (req, res) => {
//   const { txHash } = req.body;

//   if (!txHash) {
//     return res.status(400).send("Transaction hash is required");
//   }

//   const transaction = await fetchTransactionById(txHash);

//   if (!transaction) {
//     return res.status(500).send("Error fetching transaction");
//   }

//   // Now send the transaction to the Hono API as a chatQuery
//   try {
//     const honoResponse = await axios.post(`${HONO_URL}`, {
//       chatQuery: `Here's the transaction data: ${JSON.stringify(transaction)}`
//     });

//     // Send the response from Hono back to the client
//     res.send(honoResponse.data);
//   } catch (honoError) {
//     console.error("Error sending transaction to Hono API:", honoError);
//     res.status(500).send("Error sending transaction to Hono API");
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Running - ${HOSTNAME}:${PORT}`);
// });

// import express from "express";
// import cors from "cors";
// import axios from "axios";

// const PORT = process.env.PORT || 4000;
// const HOSTNAME = process.env.HOSTNAME || "http://localhost";
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Function to fetch NEAR transaction by its transaction_hash from the NEARBlocks API
// async function fetchTransactionById(txHash: string): Promise<any> {
//   try {
//     // Fetch transaction by transaction_hash (append it to the URL)
//     const response = await axios.get(`https://api.nearblocks.io/v1/txns/${txHash}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching NEAR transaction by ID", error);
//     return undefined;
//   }
// }

// // Route to fetch transaction by transaction_hash
// app.post("/transaction", async (req, res) => {
//   const { txHash } = req.body;

//   if (!txHash) {
//     return res.status(400).send("Transaction hash is required");
//   }

//   const transaction = await fetchTransactionById(txHash);

//   if (!transaction) {
//     return res.status(500).send("Error fetching transaction");
//   }

//   res.send(transaction);
// });

// // Function to verify proof with Worldcoin API
// const verifyProof = async (
//   proof: any,
//   app_id: string,
//   action: string = "verify-human"
// ) => {
//   const response = await fetch(
//     `https://developer.worldcoin.org/api/v1/verify/${app_id}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ ...proof, action: "test"}),
//     }
//   );

//   if (response.ok) {
//     const verified = await response.json();
//     return verified;
//   } else {
//     const { code, detail } = await response.json();
//     throw new Error(`Error Code ${code}: ${detail}`);
//   }
// };

// // API route to verify the proof
// app.post("/api/verify", async (req, res) => {
//   const { proof } = req.body;
//   const app_id = "app_572e528a8f224be7fcc7e1ec62d026d5";
//   const action = "verify-human";

//   try {
//     const result = await verifyProof(proof, app_id, action);

//     // Log the actual result from the verification for debugging purposes
//     console.log("Verification result:", result);

//     // Always respond with verified: true, regardless of actual result
//     return res.json({
//       verified: true,
//       message: "Verification successful!",
//     });
//   } catch (error) {
//     console.error("Error verifying proof:", error);

//     // Even if there is an error, respond with success for the user
//     return res.json({
//       verified: true, // Defaulting to success even in case of error
//       message: "Verification successful!", // Default message
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Running - ${HOSTNAME}:${PORT}`);
// });
