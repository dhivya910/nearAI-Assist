import express from "express";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

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

async function fetchAccountInfo(accountId: string): Promise<any> {
  try {
    const response = await axios.get(`https://api.nearblocks.io/v1/account/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NEAR account info", error);
    return undefined;
  }
}

async function fetchContractInfo(accountId: string): Promise<any> {
  try {
    const response = await axios.get(`https://api.nearblocks.io/v1/account/${accountId}/contract`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NEAR contract info", error);
    return undefined;
  }
}

async function fetchContractDeployments(accountId: string): Promise<any> {
  try {
    const response = await axios.get(`https://api.nearblocks.io/v1/account/${accountId}/contract/deployments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NEAR contract deployments", error);
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

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);
});

// Route to fetch account info
app.post("/account", async (req, res) => {
  const { accountId } = req.body;
  if (!accountId) {
    return res.status(400).send("Account ID is required");
  }
  const accountInfo = await fetchAccountInfo(accountId);
  if (!accountInfo) {
    return res.status(500).send("Error fetching account info");
  }
  res.send(accountInfo);
});

// Route to fetch contract info
app.post("/contract", async (req, res) => {
  const { accountId } = req.body;
  if (!accountId) {
    return res.status(400).send("Account ID is required");
  }
  const contractInfo = await fetchContractInfo(accountId);
  if (!contractInfo) {
    return res.status(500).send("Error fetching contract info");
  }
  res.send(contractInfo);
});

// Route to fetch contract deployments
app.post("/contract-deployments", async (req, res) => {
  const { accountId } = req.body;
  if (!accountId) {
    return res.status(400).send("Account ID is required");
  }
  const deployments = await fetchContractDeployments(accountId);
  if (!deployments) {
    return res.status(500).send("Error fetching contract deployments");
  }
  res.send(deployments);
});


